import './d2l-sequences-module-name.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Maybe } from '../maybe.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
export class D2LSequencesContentModule extends mixinBehaviors([
	D2L.PolymerBehaviors.Siren.EntityBehavior,
	D2L.PolymerBehaviors.Siren.SirenActionBehaviorImpl
], PolymerElement) {
	static get template() {
		return html`
		<style>
		:host {
			max-width: 678px;
			margin: auto;
			display: block;
		}

		.d2l-sequences-module-name {
			border-bottom: 1px solid #ddd;
			padding-bottom: 30px;
			font-weight: 500;
			margin-bottom: 10px;
			padding-top: 2em;
		}
		</style>
		<div class="d2l-module-container">
			<h1 class="d2l-sequences-module-name">
				<d2l-sequences-module-name href="[[href]]" token="[[token]]"></d2l-sequences-module-name>
			</h1>

			<p id="description">
				[[description]]
			</p>
		</div>
`;
	}

	static get is() {
		return 'd2l-sequences-content-module';
	}

	static get contentModuleClass() {
		return 'sequence-description';
	}

	static get observers() {
		return [
			'_getDescription(entity)',
			'_moduleSetDashboardViewState(entity)'
		];
	}

	_getDescription(entity) {
		if (!entity || !entity.properties || !entity.properties.description) {
			return;
		}

		this.$.description.innerHTML = entity.properties.description;
	}

	_moduleSetDashboardViewState(entity) {
		if (!entity) {
			return;
		}
		return new Promise((resolve, reject) => {
			const action = Maybe.of(entity)
				.chain(
					a => a.getActionByName('set-dashboard-view-state')
				);
			if (action.isNothing()) {
				return reject(entity, 'no action found');
			}

			return this.performSirenAction(action.value)
				.then(resolve);
		});
	}
}

customElements.define(D2LSequencesContentModule.is, D2LSequencesContentModule);
