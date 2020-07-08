import './d2l-sequences-completion-tracking-mixin.js';
function AutomaticCompletionTrackingMixin() {
	return class extends D2L.Polymer.Mixins.Sequences.CompletionTrackingMixin() {

		static get properties() {
			return {
				href: {
					type: String,
					observer: '_onHrefChanged',
					reflectToAttribute: true,
					notify: true
				},
				_previousHref: {
					type: String
				},
				_startCompletionCallback: {
					type: Function
				},
				_visibilityChangeCallback: {
					type: Function
				}
			};
		}

		static get observers() {
			return ['_entityUpdated(entity)'];
		}

		ready() {
			super.ready();
			this._startCompletionCallback = this.startCompletion.bind(this);
		}

		connectedCallback() {
			super.connectedCallback();
			window.addEventListener('pagehide', this._startCompletionCallback);
			window.addEventListener('visibilitychange', this._startCompletionCallback);
			window.addEventListener('beforeunload', this._startCompletionCallback);
		}

		disconnectedCallback() {
			super.disconnectedCallback();
			window.removeEventListener('pagehide', this._startCompletionCallback);
			window.removeEventListener('visibilitychange', this._startCompletionCallback);
			window.removeEventListener('beforeunload', this._startCompletionCallback);
		}

		_onHrefChanged(href, previousHref) {
			this._previousHref = previousHref;
		}

		_entityUpdated() {
			if (this.href !== this._previousHref) {
				this.startCompletion();
				this._previousHref = this.href;
			}
		}
	};
}

window.D2L = window.D2L || {};
window.D2L.Polymer = window.D2L.Polymer || {};
window.D2L.Polymer.Mixins = window.D2L.Polymer.Mixins || {};
window.D2L.Polymer.Mixins.Sequences = window.D2L.Polymer.Mixins.Sequences || {};
window.D2L.Polymer.Mixins.Sequences.AutomaticCompletionTrackingMixin = AutomaticCompletionTrackingMixin;
