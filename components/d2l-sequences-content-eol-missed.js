import '@brightspace-ui/core/components/button/button.js';
import './d2l-sequences-content-eol-activity-link.js';
import '@polymer/polymer/polymer-legacy.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import '../localize-behavior.js';
import '../mixins/d2l-sequences-return-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/*
	@extends D2L.PolymerBehaviors.Sequences.LocalizeBehavior
*/
class D2LSequencesContentEoLMissed extends D2L.Polymer.Mixins.Sequences.ReturnMixin([
	D2L.PolymerBehaviors.Siren.EntityBehavior,
	D2L.PolymerBehaviors.Sequences.LocalizeBehavior
]) {
	static get template() {
		return html`
		<style>
			:host {
				color: var(--d2l-color-ferrite);
			}
			.content-eol-missed-container {
				padding-top: 50px;
				text-align: left;
			}

			.content-eol-missed-container > * {
				margin: 25px 0;
			}

			.module-item-list {
				list-style-type: none;
				padding-left: 0px;
			}

			.module-item-list li {
				padding-top: 15px;
				padding-bottom: 15px;
				border-bottom: 1px solid var(--d2l-color-mica);
			}
		</style>
		<div class="content-eol-missed-container">
			<h2>
				[[localize('youMissedThese')]]
			</h2>
			<ol class="module-item-list">
				<template is="dom-repeat" items="[[subEntities]]" as="childLink">
					<li>
						<d2l-sequences-content-eol-activity-link href="[[childLink.href]]" token="[[token]]">
						</d2l-sequences-content-eol-activity-link>
					</li>
				</template>
			</ol>
			<d2l-button primary="" on-click="_onClickBack">
				[[localize('imDone')]]
			</d2l-button>
		</div>
`;
	}

	static get is() {
		return 'd2l-sequences-content-eol-missed';
	}
	static get properties() {
		return {
			href: {
				type: String,
				reflectToAttribute: true,
				notify: true,
				observer: '_scrollToTop'
			},
			token: {
				type: String
			},
			subEntities: {
				type: Object,
				computed: '_getSubEntities(entity)'
			}
		};
	}

	_scrollToTop() {
		window.top.scrollTo(0, 0);
	}

	_getSubEntities(entity) {
		if (!entity) {
			return [];
		}
		return entity.entities;
	}
}
customElements.define(D2LSequencesContentEoLMissed.is, D2LSequencesContentEoLMissed);
