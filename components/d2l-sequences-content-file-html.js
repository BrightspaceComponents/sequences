import '../mixins/d2l-sequences-automatic-completion-tracking-mixin.js';
import { VIEWER_MAX_WIDTH, VIEWER_HORIZONTAL_MARGIN } from '../util/constants';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
export class D2LSequencesContentFileHtml extends D2L.Polymer.Mixins.Sequences.AutomaticCompletionTrackingMixin() {
	static get template() {
		return html`
			<style>
				.d2l-sequences-content-container {
					-webkit-overflow-scrolling: touch;
					overflow-y: auto;
					height: 100%;
				}
				iframe {
					width: 100%;
					height: calc(100% - 12px);
					overflow: hidden;
				}
			</style>
			<div class="d2l-sequences-content-container">
				<iframe
					id="content"
					on-load="_setIframeStyles"
					frameborder="0"
					src$="[[_fileLocation]]"
					title$="[[title]]"
					allowfullscreen
					allow="microphone *; camera *; display-capture *; encrypted-media *;"
				></iframe>
			</div>
		`;
	}

	static get is() {
		return 'd2l-sequences-content-file-html';
	}
	static get properties() {
		return {
			href: {
				type: String,
				reflectToAttribute: true,
				notify: true,
				observer: '_scrollToTop'
			},
			_fileLocation: {
				type: String,
				computed: '_getFileLocation(entity)'
			},
			title: {
				type: String,
				computed: '_getTitle(entity)'
			},
			_navigateMultiPageFileListener: Function
		};
	}
	ready() {
		super.ready();
		this._navigateMultiPageFileListener = this._navigateMultiPageFile.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('d2l-sequence-viewer-multipage-navigation', this._navigateMultiPageFileListener);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('d2l-sequence-viewer-multipage-navigation', this._navigateMultiPageFileListener);
		window.postMessage(JSON.stringify({ handler: 'd2l.nav.reset' }), '*');
	}

	_setIframeStyles() {
		const htmlIframe = this.$.content;
		const maxWidth = VIEWER_MAX_WIDTH + (2 * VIEWER_HORIZONTAL_MARGIN);
		htmlIframe.contentDocument.body.style.maxWidth = `${maxWidth}px`;
		htmlIframe.contentDocument.body.style.margin = '0 auto';
		htmlIframe.contentDocument.body.style.padding = `0 ${VIEWER_HORIZONTAL_MARGIN}px`;
	}

	_scrollToTop() {
		window.top.scrollTo(0, 0);
	}

	_getFileLocation(entity) {
		try {
			const fileActivity = entity.getSubEntityByClass('file-activity');
			const file = fileActivity.getSubEntityByClass('file');
			const link = file.getLinkByClass('pdf') || file.getLinkByClass('embed') || file.getLinkByRel('alternate');
			return link.href;
		} catch (e) {
			return '';
		}
	}
	_getTitle(entity) {
		return entity && entity.properties && entity.properties.title || '';
	}

	_navigateMultiPageFile(e) {
		const iframe = this.shadowRoot.querySelector('iframe');
		if (iframe && iframe.contentWindow) {
			iframe.contentWindow.postMessage(JSON.stringify({
				handler: 'd2l.nav.client',
				action: e.detail
			}), '*');
		}
	}
}
customElements.define(D2LSequencesContentFileHtml.is, D2LSequencesContentFileHtml);
