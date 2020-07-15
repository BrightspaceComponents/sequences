import '@polymer/polymer/polymer-legacy.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-polymer-siren-behaviors/store/siren-action-behavior.js';
import '../localize-behavior.js';
import { Maybe } from '../maybe.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

const FINISH_COMPLETION_DELAY = 6000;

function CompletionTrackingMixin() {
	return class extends mixinBehaviors([
		D2L.PolymerBehaviors.Siren.EntityBehavior,
		D2L.PolymerBehaviors.Siren.SirenActionBehaviorImpl,
		D2L.PolymerBehaviors.Sequences.LocalizeBehavior
	],
	PolymerElement
	) {
		static get properties() {
			return {
				_completionEntity: {
					type: Object
				},
				_skipCompletion: {
					type: Boolean,
					computed: '_isImpersonating(token)'
				}
			};
		}

		finishCompletion() {
			if (!this._completionEntity || this._skipCompletion) {
				return;
			}

			setTimeout(() => {
				this._performViewActions(this._completionEntity, 'finish-view-activity');
			}, FINISH_COMPLETION_DELAY);
		}

		startCompletion() {
			if (this._skipCompletion) {
				return;
			}

			this._performViewActions(this.entity, 'view-activity-duration')
				.then(completion => this._completionEntity = completion);
		}

		_performViewActions(entity, actionName) {
			return new Promise((resolve, reject) => {
				const action = Maybe.of(entity)
					.chain(
						e => e.getSubEntityByClass('activity'),
						a => a.getActionByName(actionName),
					);

				if (action.isNothing()) {
					return reject(entity, 'no action found');
				}

				// DEBUG WITH console.log('performing completion action', actionName, 'on', entity.properties.title);
				return this.performSirenAction(action.value)
					.then(resolve);
			});
		}

		_isImpersonating(token) {
			try {
				const payload = token.split('.')[1];
				const b64 = payload
					.replace(/-/g, '+')
					.replace(/_/g, '/');
				const jwt = JSON.parse(atob(b64));
				return jwt.hasOwnProperty('actualsub') &&
					jwt.hasOwnProperty('sub') &&
					jwt.actualsub !== jwt.sub;
			} catch (e) {
				return false;
			}
		}
	};
}

window.D2L = window.D2L || {};
window.D2L.Polymer = window.D2L.Polymer || {};
window.D2L.Polymer.Mixins = window.D2L.Polymer.Mixins || {};
window.D2L.Polymer.Mixins.Sequences = window.D2L.Polymer.Mixins.Sequences || {};
window.D2L.Polymer.Mixins.Sequences.CompletionTrackingMixin = CompletionTrackingMixin;
