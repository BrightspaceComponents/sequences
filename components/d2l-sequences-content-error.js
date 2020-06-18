import '../localize-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
export class D2LSequencesContentError extends mixinBehaviors([
	D2L.PolymerBehaviors.Sequences.LocalizeBehavior
], PolymerElement) {
	static get template() {
		return html`
		<style>
		</style>
		[[localize('cannotBeRendered')]]
`;
	}

	static get is() {
		return 'd2l-sequences-content-error';
	}
}
customElements.define(D2LSequencesContentError.is, D2LSequencesContentError);
