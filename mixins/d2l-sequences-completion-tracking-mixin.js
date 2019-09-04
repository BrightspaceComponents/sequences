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
				_failedCompletion: {
					type: Object
				},
				_skipCompletion: {
					type: Boolean,
					computed: '_isImpersonating(token)'
				}
			};
		}

		finishCompletion() {
			this._fireToastEvent();

			if (!this._completionEntity || this._skipCompletion) {
				return;
			}

			this._performViewActions(this._completionEntity, 'finish-view-activity')
				.then(() => { this._completionEntity = null; })
				.catch(() => { this._completionEntity = null; });
		}

		startCompletion() {
			if (this._skipCompletion) {
				return;
			}

			this._performViewActions(this.entity, 'view-activity-duration')
				.then(completion => this._completionEntity = completion)
				.catch(entity => this._failedCompletion = entity);
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

		_fireToastEvent() {
			const activity = Maybe.of(this._failedCompletion)
				.map(e => e.getSubEntityByClass('activity'));

			if (activity.isNothing()) {
				this._failedCompletion = null;
				return;
			}

			const complete = activity.map(
				a => a.getSubEntityByClass('completed')
			);

			if (!complete.isNothing()) {
				this._failedCompletion = null;
				return;
			}

			// Due to the router / entity store, we may run this
			// twice during initial load and we don't want to fire
			// the toast event if we're just refreshing our own
			// data.
			const currentActivity = Maybe.of(this.entity)
				.chain(
					e => e.getSubEntityByClass('activity'),
					a => a.getLinkByRel('about'),
					p => p.href
				);

			const oldActivity = activity.chain(
				a => a.getLinkByRel('about'),
				p => p.href
			);

			if (currentActivity.value === oldActivity.value) {
				this._failedCompletion = null;
				return;
			}

			const href = activity.chain(
				a => a.getLinkByRel('about'),
				a => a.href
			).value;

			if (!href) {
				this._failedCompletion = null;
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
						name: this._failedCompletion.properties.title,
						url: this._failedCompletion.getLinkByRel('self').href
					},
					bubbles: true,
					composed: true,
				});
				window.dispatchEvent(event);
			}
			this._failedCompletion = null;
		}
	};
}

window.D2L = window.D2L || {};
window.D2L.Polymer = window.D2L.Polymer || {};
window.D2L.Polymer.Mixins = window.D2L.Polymer.Mixins || {};
window.D2L.Polymer.Mixins.Sequences = window.D2L.Polymer.Mixins.Sequences || {};
window.D2L.Polymer.Mixins.Sequences.CompletionTrackingMixin = CompletionTrackingMixin;
