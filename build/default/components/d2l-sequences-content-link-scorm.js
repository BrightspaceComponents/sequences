import "../node_modules/d2l-content-icons/d2l-content-icons.js";
import "../node_modules/@brightspace-ui/core/components/button/button.js";
import { D2LSequencesContentLink } from './d2l-sequences-content-link.js';
import '../mixins/d2l-sequences-automatic-completion-tracking-mixin.js';
import { html } from "../node_modules/@polymer/polymer/lib/utils/html-tag.js";
/*
	@extends D2L.PolymerBehaviors.Sequences.LocalizeBehavior
*/

export class D2LSequencesContentLinkScorm extends D2L.Polymer.Mixins.Sequences.AutomaticCompletionTrackingMixin() {
  static get template() {
    return html`
		<style>
			.content-link-scorm-container {
				padding-top: 100px;
				text-align: center;
				width: 550px;
				margin: auto;
			}

			.content-link-scorm-container > * {
				margin: 25px 0;
			}

			.content-link-scorm-container-icon {
				margin-left: 0px;
				margin-right: 0px;
			}

		</style>
		<div class="content-link-scorm-container">
			<div class="content-link-scorm-container-icon">
				<d2l-scorm-icon></d2l-scorm-icon>
			</div>
			<p>
				[[localize('viewThisActivity')]]
			</p>
			<d2l-button primary="true" onclick$="window.open('[[_linkLocation]]')">
				[[localize('goToActivity')]]
			</d2l-button>
		</div>
`;
  }

  static get is() {
    return 'd2l-sequences-content-link-scorm';
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
    return 'link-content-service';
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
customElements.define(D2LSequencesContentLinkScorm.is, D2LSequencesContentLinkScorm);