import 'd2l-content-icons/d2l-open-one-drive-icon.js';
import '@brightspace-ui/core/components/button/button.js';
import { D2LSequencesContentLink } from './d2l-sequences-content-link.js';
import '../mixins/d2l-sequences-automatic-completion-tracking-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/*
	@extends D2L.PolymerBehaviors.Sequences.LocalizeBehavior
*/

export class D2LSequencesContentLinkOnedrive extends D2L.Polymer.Mixins.Sequences.AutomaticCompletionTrackingMixin() {
	static get template() {
		return html`
		<style>
			.content-link-onedrive-container {
				padding-top: 100px;
				text-align: center;
				width: 550px;
				margin: auto;
			}

			.content-link-onedrive-container > * {
				margin: 25px 0;
			}

			:host-context([dir="rtl"]) .content-link-onedrive-container-icon {
				margin-right: 52px;
				margin-left: 0px;
			}

			.content-link-onedrive-container-icon {
				margin-left: 52px;
				margin-right: 0px;
			}

		</style>
		<div class="content-link-onedrive-container">
			<div class="content-link-onedrive-container-icon">
				<d2l-open-one-drive-icon></d2l-open-one-drive-icon>
			</div>
			<p>
				[[localize('openOnedriveFile')]]
			</p>
			<d2l-button primary="true" onclick$="window.open('[[_linkLocation]]')">
				[[localize('gotoOnedrive')]]
			</d2l-button>
		</div>
`;
	}

	static get is() {
		return 'd2l-sequences-content-link-onedrive';
	}
	static get properties() {
		return {
			href: {
				type: String,
				reflectToAttribute: true,
				notify: true,
				observer: '_scrollToTop'
			},
			_linkLocation: {
				type: String,
				computed: '_getLinkLocation(entity)'
			}
		};
	}
	static get contentClass() {
		return 'link-onedrive';
	}

	_scrollToTop() {
		window.top.scrollTo(0, 0);
	}

	_getLinkLocation(entity) {
		try {
			const linkActivity = entity.getSubEntityByClass(D2LSequencesContentLink.contentClass);
			const link = linkActivity.getLinkByRel('about');
			return link.href;
		} catch (e) {
			return '';
		}
	}
}
customElements.define(D2LSequencesContentLinkOnedrive.is, D2LSequencesContentLinkOnedrive);
