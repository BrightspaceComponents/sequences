import '@polymer/polymer/polymer-legacy.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import '@brightspace-ui/core/components/link/link.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
/*
	@extends D2L.PolymerBehaviors.Siren.EntityBehavior
*/
class D2LSequencesContentEoLActivityLink extends mixinBehaviors([
	D2L.PolymerBehaviors.Siren.EntityBehavior
], PolymerElement) {
	static get template() {
		return html`
		<style>
			:host {
				display: block;
			}

		</style>
		<d2l-link on-click="_onClick" href="javascript:void(0)">
			[[title]]
		</d2l-link>
`;
	}

	static get is() {
		return 'd2l-sequences-content-eol-activity-link';
	}
	static get properties() {
		return {
			title: {
				type: Object,
				computed: '_getTitle(entity)'
			},
			href: {
				type: String,
				reflectToAttribute: true,
			}
		};
	}

	_onClick() {
		const event = new CustomEvent('hrefUpdated', {
			detail: { href: this.href },
			composed: true,
			bubbles: true
		});

		this.dispatchEvent(event);
	}

	_getTitle(entity) {
		return entity && entity.properties && entity.properties.title || '';
	}
}
customElements.define(D2LSequencesContentEoLActivityLink.is, D2LSequencesContentEoLActivityLink);
