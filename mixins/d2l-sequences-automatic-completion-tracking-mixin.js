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
				_finishCompletionCallback: {
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
			this._finishCompletionCallback = this.getFinishCompletionHandler().bind(this);
			this._immediateFinishCompletionCallback = this.getFinishCompletionHandler({ delay: 0 }).bind(this);
			this._visibilityChangeCallback = function() {
				if (document.visibilityState === 'hidden') {
					this._finishCompletionCallback();
				} else {
					this.startCompletion();
				}
			}.bind(this);
		}

		connectedCallback() {
			super.connectedCallback();
			window.addEventListener('pagehide', this._finishCompletionCallback);
			window.addEventListener('visibilitychange', this._visibilityChangeCallback);
			window.addEventListener('beforeunload', this._finishCompletionCallback);
			window.addEventListener('back-to-content', this._immediateFinishCompletionCallback);
		}

		disconnectedCallback() {
			super.disconnectedCallback();
			this.finishCompletion();
			window.removeEventListener('pagehide', this._finishCompletionCallback);
			window.removeEventListener('visibilitychange', this._visibilityChangeCallback);
			window.removeEventListener('beforeunload', this._finishCompletionCallback);
			window.removeEventListener('back-to-content', this._immediateFinishCompletionCallback);
		}

		_onHrefChanged(href, previousHref) {
			this._previousHref = previousHref;
		}

		_entityUpdated() {
			if (this.href !== this._previousHref) {
				this.finishCompletion();
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
