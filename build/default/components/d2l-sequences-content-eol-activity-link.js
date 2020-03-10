import "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/d2l-polymer-siren-behaviors/store/entity-behavior.js";
import "../node_modules/@brightspace-ui/core/components/link/link.js";
import { html } from "../node_modules/@polymer/polymer/lib/utils/html-tag.js";
import { mixinBehaviors } from "../node_modules/@polymer/polymer/lib/legacy/class.js";
import { PolymerElement } from "../node_modules/@polymer/polymer/polymer-element.js";
/*
	@extends D2L.PolymerBehaviors.Siren.EntityBehavior
*/

class D2LSequencesContentEoLActivityLink extends mixinBehaviors([D2L.PolymerBehaviors.Siren.EntityBehavior], PolymerElement) {
  static get template() {
    return html`
		<style>
			:host {
				display: block;
			}

		</style>
		<d2l-link on-click="_onClick" href="javascript:void(0)">
			[[title]]
		</d2l-link>
`;
  }

  static get is() {
    return 'd2l-sequences-content-eol-activity-link';
  }

  static get properties() {
    return {
      title: {
        type: Object,
        computed: '_getTitle(entity)'
      },
      href: {
        type: String,
        reflectToAttribute: true
      }
    };
  }

  _onClick() {
    const event = new CustomEvent('hrefUpdated', {
      detail: {
        href: this.href
      },
      composed: true,
      bubbles: true
    });
    this.dispatchEvent(event);
  }

  _getTitle(entity) {
    return entity && entity.properties && entity.properties.title || '';
  }

}

customElements.define(D2LSequencesContentEoLActivityLink.is, D2LSequencesContentEoLActivityLink);