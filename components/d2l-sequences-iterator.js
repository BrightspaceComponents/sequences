import '@polymer/polymer/polymer-legacy.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-navigation/d2l-navigation-button-notification-icon.js';
import '../localize-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
/*
	@extends D2L.PolymerBehaviors.Sequences.LocalizeBehavior
	@demo demos/index.html
*/
export class D2LSequencesIterator extends mixinBehaviors([
	D2L.PolymerBehaviors.Siren.EntityBehavior,
	D2L.PolymerBehaviors.Sequences.LocalizeBehavior
], PolymerElement) {
	static get template() {
		return html`
		<style>
			d2l-navigation-button-notification-icon {
				display: inline-block;
				height: 50px;
			}
			d2l-navigation-button-notification-icon[disabled] {
				opacity: 0.5;
				height: 60px;
			}
		</style>
		<d2l-navigation-button-notification-icon
			id="iteratorButton"
			disabled="[[disabled]]"
			aria-disabled$="[[disabled]]"
			icon="[[icon]]"
			type="button"
			text="[[localize(iterateTo)]]"
			on-click="_onClick">
		</d2l-navigation-button-notification-icon>
`;
	}

	static get is() {
		return 'd2l-sequences-iterator';
	}
	static get properties() {
		return {
			href: {
				type: String
			},
			disabled: {
				type: Boolean
			},
			currentActivity: {
				type: String,
				reflectToAttribute: true,
				notify: true
			},
			icon: {
				type: String
			},
			next: {
				type: Boolean
			},
			previous: {
				type: Boolean
			},
			link: {
				type: Object
			},
			iterateTo: {
				type: String,
				computed: 'getIterateTo()'
			}
		};
	}
	static get observers() {
		return [
			'_setLink(entity)',
			'_setDisabled(href)'
		];
	}
	connectedCallback() {
		super.connectedCallback();
	}
	getIterateTo() {
		if (this.next) {
			return 'iterateToNext';
		}
		else if (this.previous) {
			return 'iterateToPrevious';
		}
	}
	_onClick() {
		if (this.link && this.link.href) {
			this.currentActivity = this.link.href;
			this.dispatchEvent(new CustomEvent('iterate', { composed: true, bubbles: true }));
		}
	}
	_setLink(entity) {

		if (!entity) {
			return;
		}
		this.link = entity.getLinkByRel('self');
	}
	_setDisabled(href) {
		this.disabled = href ? false : true;
	}
}
customElements.define(D2LSequencesIterator.is, D2LSequencesIterator);
