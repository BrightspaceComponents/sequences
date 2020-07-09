import '@polymer/polymer/polymer-legacy.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-polymer-siren-behaviors/store/siren-action-behavior.js';
import '../localize-behavior.js';
import { Maybe } from '../maybe.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
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

		startCompletion() {
			if (!this.entity || this._skipCompletion || this._isComplete(this.entity)) {
				return;
			}

			this._performViewActions(this.entity, 'view-activity-duration')
				.then(completion => {
					this._completionEntity = completion;
					this._finishCompletion();
				})
				.catch(() => {});
		}

		startPreviousEntityCompletion(previousEntity) {
			if (!previousEntity || this._skipCompletion  || this._isComplete(previousEntity)) {
				return;
			}
			// need timeout as items such as quizes, assignments, discussions etc
			// will not appear complete if immediately fetching activity completion information
			// after navigation to a new item
			setTimeout(() => {
				this._performViewActions(previousEntity, 'view-activity-duration')
					.then(completion => {
						this._completionEntity = completion;
						this._finishCompletion();
					})
					.catch(() => {});
			}, 6000);
		}

		_finishCompletion() {
			if (!this._completionEntity || this._skipCompletion) {
				return;
			}

			this._performViewActions(this._completionEntity, 'finish-view-activity')
				.then(() => { this._completionEntity = null; })
				.catch(() => { this._completionEntity = null; });
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

		_isComplete(entity) {
			const subEntity = entity.getSubEntityByClass('link-activity') || entity.getSubEntityByClass('file-activity');
			if (!subEntity) {
				return false;
			}
			return !!subEntity.getSubEntityByClass('completed');
		}
	};
}

window.D2L = window.D2L || {};
window.D2L.Polymer = window.D2L.Polymer || {};
window.D2L.Polymer.Mixins = window.D2L.Polymer.Mixins || {};
window.D2L.Polymer.Mixins.Sequences = window.D2L.Polymer.Mixins.Sequences || {};
window.D2L.Polymer.Mixins.Sequences.CompletionTrackingMixin = CompletionTrackingMixin;
