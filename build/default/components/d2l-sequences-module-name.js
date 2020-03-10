import "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/d2l-polymer-siren-behaviors/store/entity-behavior.js";
import { html } from "../node_modules/@polymer/polymer/lib/utils/html-tag.js";
import { mixinBehaviors } from "../node_modules/@polymer/polymer/lib/legacy/class.js";
import { PolymerElement } from "../node_modules/@polymer/polymer/polymer-element.js";
/*
	@demo demos/index.html
 */

export class D2LSequencesModuleName extends mixinBehaviors([D2L.PolymerBehaviors.Siren.EntityBehavior], PolymerElement) {
  static get template() {
    return html`
		<style>
			:host {
				display: inline;
			}
		</style>
		[[title]]
`;
  }

  static get is() {
    return 'd2l-sequences-module-name';
  }

  static get properties() {
    return {
      title: {
        type: String,
        computed: '_getTitle(entity)',
        notify: true
      }
    };
  }

  _getTitle(entity) {
    return entity && entity.properties && entity.properties.title || '';
  }

}
customElements.define(D2LSequencesModuleName.is, D2LSequencesModuleName);