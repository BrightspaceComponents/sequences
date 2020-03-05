import '../mixins/d2l-sequences-automatic-completion-tracking-mixin.js';
import 'd2l-pdf-viewer/d2l-pdf-viewer.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
export class D2LSequencesContentFilePdf extends D2L.Polymer.Mixins.Sequences.AutomaticCompletionTrackingMixin() {
	static get template() {
		return html`
		<style>
			d2l-pdf-viewer {
				width: 100%;
				height: calc(100% - 12px);
				overflow: hidden;
			}
		</style>
		<d2l-pdf-viewer
			src="[[_fileLocation]]"
			loader="script"
			use-cdn
			enable-download="[[_enableDownload]]"
			enable-print="[[_enablePrint]]"
		>
		</d2l-pdf-viewer>
`;
	}

	static get is() {
		return 'd2l-sequences-content-file-pdf';
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
			_enableDownload: {
				type: Boolean,
				computed: '_isDownloadEnabled(entity)'
			},
			_enablePrint: {
				type: Boolean,
				computed: '_isPrintEnabled(entity)'
			}
		};
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.postMessage(JSON.stringify({ handler: 'd2l.nav.reset' }), '*');
	}

	_scrollToTop() {
		window.top.scrollTo(0, 0);
	}

	_getFileLocation(entity) {
		try {
			const linkActivityHref = this._getLinkLocation(entity);
			if (linkActivityHref) {
				return linkActivityHref;
			}
			const fileActivity = entity.getSubEntityByClass('file-activity');
			const file = fileActivity.getSubEntityByClass('file');
			const link = file.getLinkByClass('pdf') || file.getLinkByClass('embed') || file.getLinkByRel('alternate');
			return link.href;
		} catch (e) {
			return '';
		}
	}
	_getLinkLocation(entity) {
		try {
			const linkActivity = entity.getSubEntityByClass('link-activity');
			const link = linkActivity.getLinkByRel('about');
			return link.href;
		} catch (e) {
			return '';
		}
	}
	_getTitle(entity) {
		return entity && entity.properties && entity.properties.title || '';
	}
	_isDownloadEnabled(entity) {
		if (entity) {
			console.log(JSON.stringify(entity.properties));
		}
		return entity && entity.properties && !!entity.properties.canDownload;
	}
	_isPrintEnabled(entity) {
		if (entity) {
			console.log(JSON.stringify(entity.properties));
		}
		return entity && entity.properties && !!entity.properties.canPrint;
	}
}
customElements.define(D2LSequencesContentFilePdf.is, D2LSequencesContentFilePdf);
