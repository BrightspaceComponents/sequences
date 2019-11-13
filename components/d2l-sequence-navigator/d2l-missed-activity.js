import './d2l-eol-activity-link.js';
import { CompletionStatusMixin } from '../../util/d2l-sequence-navigator/completion-status-mixin.js';
import { PolymerASVLaunchMixin } from '../../util/d2l-sequence-navigator/polymer-asv-launch-mixin.js';
import { ASVFocusWithinMixin } from '../../util/d2l-sequence-navigator/asv-focus-within-mixin.js';
import 'd2l-accordion/d2l-accordion.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/*
@memberOf window.D2L.Polymer.Mixins;
@mixes D2L.Polymer.Mixins.CompletionStatusMixin
@mixes D2L.Polymer.Mixins.PolymerASVLaunchMixin
@mixes D2L.Polymer.Mixins.ASVFocusWithinMixin
*/

class D2LMissedActivity extends ASVFocusWithinMixin(PolymerASVLaunchMixin(CompletionStatusMixin())) {
	static get template() {
		return html`
		<style>
			:host {
				--d2l-inner-module-text-color: var(--d2l-asv-text-color);
				--d2l-activity-link-padding: 10px 14px;
				display: block;
				cursor: pointer;
				@apply --d2l-body-compact-text;
				--d2l-inner-module-background-color: transparent;
				margin: 10px 0;
				color: var(--d2l-inner-module-text-color);
				border-radius: 8px;
			}

			ol {
				list-style-type: none;
				border-collapse: collapse;
				margin: 0px;
				padding: 0px;
			}

			d2l-accordion-collapse {
				padding: 18px;
				border-top: 1px solid var(--d2l-color-mica);
				border-bottom: 1px solid var(--d2l-color-mica);
				margin-bottom: 18px;
			}

			li:first-child {
				margin-top: 24px;
			}

		</style>

 		<d2l-accordion-collapse title="[[localize('sequenceNavigator.missedItems', 'numberOfMissedActivities', numberOfMissedActivity)]]" flex opened>
		<ol>
				<template is="dom-repeat" items="[[subEntities]]" as="childLink">
					<li>
						<d2l-eol-activity-link href="[[childLink.href]]" token="[[token]]"></d2l-eol-activity-link>
					</li>
				</template>
		</ol>
		</d2l-accordion-collapse>

`;
	}

	static get is() {
		return 'd2l-missed-activity';
	}
	static get properties() {
		return {
			numberOfMissedActivity:{
				type: String,
				computed: 'getnumberOfMissedActivity(subEntities)'
			},
			subEntities: {
				type: Array,
				computed: 'getSubEntities(entity)'
			}
		};
	}
	getSubEntities(entity) {
		return entity && entity.getSubEntities()
			.filter(subEntity => (subEntity.hasClass('sequenced-activity') && subEntity.hasClass('available')) || (subEntity.href && subEntity.hasClass('sequence-description')))
			.map(this._getHref);
	}

	_getHref(entity) {
		return entity && entity.getLinkByRel && entity.getLinkByRel('self') || entity || '';
	}

	getnumberOfMissedActivity(subEntities) {
		if (subEntities) {
			return subEntities.length;
		}
		return null;
	}
}
customElements.define(D2LMissedActivity.is, D2LMissedActivity);
