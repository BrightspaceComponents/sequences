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
			if (this._skipCompletion) {
				return;
			}

			this._performViewActions(this.entity, 'view-activity-duration')
				.then(completion => {
					this._completionEntity = completion;
					this._finishCompletion();
				})
				.catch(entity => this._failedCompletion = entity);
		}

		finishPreviousEntityCompletion(previousEntity) {
			this._fireToastEvent(previousEntity);

			if (!previousEntity || this._skipCompletion) {
				return;
			}

			this._performViewActions(previousEntity, 'finish-view-activity')
				.then(() => {})
				.catch(() => {});
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

		_fireToastEvent(previousEntity) {
			const activity = Maybe.of(previousEntity)
				.map(e => e.getSubEntityByClass('activity'));

			if (activity.isNothing()) {
				return;
			}

			const incompleteClass = activity.map(
				a => a.getSubEntityByClass('incomplete')
			);

			if (!incompleteClass) {
				return;
			}

			const href = activity.chain(
				a => a.getLinkByRel('about'),
				a => a.href
			).value;

			if (!href) {
				return;
			}

			const notifyActivityTypes = [
				'dropbox',
				'quiz',
				'discuss'
			];

			if (notifyActivityTypes.some(t => href.includes(t))) {
				const event = new CustomEvent('toast', {
					detail: {
						message: 'There was more to do in the last activity.',
						name: previousEntity.properties.title,
						url: previousEntity.getLinkByRel('self').href
					},
					bubbles: true,
					composed: true,
				});
				window.dispatchEvent(event);
			}
		}
	};
}

window.D2L = window.D2L || {};
window.D2L.Polymer = window.D2L.Polymer || {};
window.D2L.Polymer.Mixins = window.D2L.Polymer.Mixins || {};
window.D2L.Polymer.Mixins.Sequences = window.D2L.Polymer.Mixins.Sequences || {};
window.D2L.Polymer.Mixins.Sequences.CompletionTrackingMixin = CompletionTrackingMixin;
