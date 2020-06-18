import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { D2LSequencesContentError } from '../components/d2l-sequences-content-error.js';
import '../components/d2l-sequences-content-error.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import { TemplateStamp } from '@polymer/polymer/lib/mixins/template-stamp.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
function RouterMixin(getEntityType) {
	return class extends TemplateStamp(
		mixinBehaviors([D2L.PolymerBehaviors.Siren.EntityBehavior],	PolymerElement)
	) {
		static get properties() {
			return {
				href: {
					type: String,
					reflectToAttribute: true,
					notify: true
				},
				_contentType: {
					type: String
				},
				_contentElement: {
					type: Object
				},
				_debouncer: {
					type: Object
				},
				_hrefUpdated: {
					type: Function
				},
				error: {
					type: Boolean
				},
				redirectCs: Boolean,
				csRedirectPath: String,
				noRedirectQueryParamString: String
			};
		}

		static get observers() {
			return ['_render(entity, error)'];
		}

		connectedCallback() {
			super.connectedCallback();
			this._hrefUpdated = this.addEventListener('hrefUpdated', ({detail}) => {
				this.href = detail.href;
			});
			this._D2LErrorListener = window.addEventListener('message', (event) => {
				this.error = event.data.type === 'd2l-error';
			});
		}

		disconnectedCallback() {
			super.disconnectedCallback();
			this.removeEventListener('hrefUpdated', this._hrefUpdated);
			window.removeEventListener('message', this._D2LErrorListener);
		}

		_render(entity, error) {
			getEntityType = getEntityType.bind(this);
			this._debouncer = Debouncer.debounce(
				this._debouncer,
				timeOut.after(20),
				() => {
					const entityType = error
						? D2LSequencesContentError.is
						: getEntityType(entity);

					const replaceContentElement = (entity &&
						(!this._contentElement || this._contentElement.href !== this.href)
					) || error;

					if (replaceContentElement) {
						this.error = false;
						const nodeTemplate = customElements.get(entityType).template.cloneNode(true);
						const contentElement = document.createElement(entityType);
						contentElement.appendChild(this._stampTemplate(nodeTemplate));

						if (this._contentElement) {
							this._contentElement.isUnloaded = true;
							this.shadowRoot.removeChild(this._contentElement);
						}

						this._contentElement = contentElement;
						this._contentType = entityType;

						this.shadowRoot.appendChild(this._contentElement);
						this._contentElement.href = this.href;
						this._contentElement.token = this.token;
						this._contentElement.redirectCs = this.redirectCs;
						this._contentElement.csRedirectPath = this.csRedirectPath;
						this._contentElement.noRedirectQueryParamString = this.noRedirectQueryParamString;
					}
				}
			);
		}
	};
}

window.D2L = window.D2L || {};
window.D2L.Polymer = window.D2L.Polymer || {};
window.D2L.Polymer.Mixins = window.D2L.Polymer.Mixins || {};
window.D2L.Polymer.Mixins.Sequences = window.D2L.Polymer.Mixins.Sequences || {};
window.D2L.Polymer.Mixins.Sequences.RouterMixin = RouterMixin;
