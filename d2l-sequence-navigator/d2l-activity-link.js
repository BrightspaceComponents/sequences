import { CompletionStatusMixin } from '../mixins/completion-status-mixin.js';
import { PolymerASVLaunchMixin } from '../mixins/polymer-asv-launch-mixin.js';
import './d2l-completion-status.js';
import './d2l-completion-requirement.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/icons/icon.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/*
@memberOf window.D2L.Polymer.Mixins;
@mixes CompletionStatusMixin
@mixes PolymerASVLaunchMixin
*/

class D2LActivityLink extends PolymerASVLaunchMixin(CompletionStatusMixin()) {
	static get template() {
		return html`
		<style>
			:host {
				--d2l-activity-link-border-color: var(--d2l-activity-link-background-color);
				--d2l-activity-link-text-color: var(--d2l-asv-text-color);
				--d2l-activity-link-opacity: 1;
				--d2l-activity-link-backdrop-opacity: 0;
				--d2l-left-icon-padding: 15px;
				--d2l-right-icon-padding: 24px;
				--d2l-icon-size: 18px;
				display: block;
				@apply --d2l-body-compact-text;
				/*padding: var(--d2l-activity-link-padding, 10px 24px);*/
				padding-left: 24px;
				padding-right: 24px;
			}

			:host > div {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
			}

			:host([show-loading-skeleton]) {
				cursor: unset;
			}

			/* TODO: rename this property and function name */
			:host([next-sibling-is-activity]) > #outer-container {
				border-bottom: 1px solid transparent;
			}

			d2l-icon,
			a,
			d2l-completion-requirement,
			d2l-completion-status {
				vertical-align: top;
			}

			.d2l-activity-link-title {
				word-wrap: break-word;
				width: calc(
					100% -
					var(--d2l-left-icon-padding) -
					var(--d2l-right-icon-padding) -
					(var(--d2l-icon-size) * 2)
				);
			}

			a {
				@apply --d2l-body-compact-text;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				max-height: 3.0rem;
				-webkit-line-clamp: 2; /* number of lines to show */
				outline: none;
				text-decoration: none;
				color: var(--d2l-color-celestine);
			}

			a.d2l-activity-link-one-line {
				-webkit-line-clamp: 1; /* number of lines to show */
			}

			d2l-completion-requirement {
				--d2l-activity-link-subtext-color: var(--d2l-color-tungsten);
				color: var(--d2l-activity-link-subtext-color);
			}

			d2l-completion-status {
				width: var(--d2l-icon-size);
				padding-left: var(--d2l-right-icon-padding);
				color: var(--d2l-activity-link-text-color);
			}

			d2l-icon {
				padding-top: 3px;
				padding-right: var(--d2l-left-icon-padding);
				color: var(--d2l-color-celestine);
			}

			:host([inner-last]) {
				border-radius: 0 0 8px 8px;
			}

			#skeleton-container {
				height: 24px;
				width: 100%;
				display: flex;
				justify-content: flex-start;
			}

			#icon-skeleton {
				height: 100%;
				width: 24px;
				margin-right: 15px;
				border-radius: 8px;
				background: #F1F5FB;
			}

			#title-skeleton {
				height: 100%;
				width: 70%;
				border-radius: 8px;
				background: #F1F5FB;
			}

			#outer-container {
				border-bottom: 1px solid var(--d2l-color-mica);
				display: flex;
				flex-direction: row;
				flex: 1;
				padding-top: 5px;
				padding-bottom: 15px;
			}
			#content-container {
				display: flex;
				flex: 1;
				justify-content: space-between;
				cursor: pointer;
			}

		</style>
		<div id="outer-container">
			<template is="dom-if" if="[[showLoadingSkeleton]]">
				<div id="skeleton-container">
					<div id="icon-skeleton"></div>
					<div id="title-skeleton"></div>
				</div>
			</template>
			<template is="dom-if" if="[[!showLoadingSkeleton]]">
				<div id="content-container" on-click="_contentObjectClick">
					<template is="dom-if" if="[[hasIcon]]">
						<d2l-icon icon="[[_getIconSetKey(entity)]]"></d2l-icon>
					</template>
					<div class="d2l-activity-link-title">
						<a on-click="setCurrent" class$="[[completionRequirementClass]]" href="javascript:void(0)">
							[[entity.properties.title]]
						</a>
						<d2l-completion-requirement href="[[href]]" token="[[token]]">
						</d2l-completion-requirement>
					</div>
					<d2l-completion-status href="[[href]]" token="[[token]]">
					</d2l-completion-status>
				</div>
			</template>
		</div>
`;
	}

	static get is() {
		return 'd2l-activity-link';
	}
	static get properties() {
		return {
			currentActivity: {
				type: String,
				value: '',
				notify: true
			},
			completionRequirementClass: {
				type: String,
				computed: '_getCompletionRequirementClass(entity)'
			},
			hasIcon: {
				type: Boolean,
				computed: '_hasIcon(entity)'
			},
			class: {
				type: String,
				computed: '_getIsSelected(currentActivity, entity)',
				reflectToAttribute: true
			},
			completionStatus: {
				type: String,
				computed: '_getCompletionStatus(entity)',
			},
			showLoadingSkeleton: {
				type: Boolean,
				value: true,
				reflectToAttribute: true,
				computed: '_showSkeleton(entity)'
			},
			nextSiblingIsActivity: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			}
		};
	}
	static get observers() {
		return [
			'onCurrentActivityChanged(currentActivity, entity)'
		];
	}

	ready() {
		super.ready();
		this.addEventListener('keypress', this._onKeyPress);
	}

	_onKeyPress(event) {
		if (event.key !== 'Enter') {
			return;
		}
		this.setCurrent();
	}

	setCurrent() {
		this.currentActivity = this.entity && this.entity.getLinkByRel('self').href;
		this.dispatchEvent(new CustomEvent('sequencenavigator-d2l-activity-link-current-activity', {detail: { href: this.href}}));
	}

	onCurrentActivityChanged(currentActivity, entity) {
		if (currentActivity && entity) {
			this.dispatchEvent(new CustomEvent('activitySelected', { detail:{ activityHref: currentActivity }, composed: true }));
		}
	}

	_hasIcon(entity) {
		const tierClass = 'tier1';
		return entity && entity.getSubEntityByClass(tierClass);
	}

	_getIconSetKey(entity) {
		const tierClass = 'tier1';
		return (entity.getSubEntityByClass(tierClass)).properties.iconSetKey;
	}

	_getCompletionRequirementClass(entity) {
		const completionRequirement = this._getCompletionRequirement(entity);
		switch (completionRequirement) {
			case 'exempt':
			case 'optional':
				return 'd2l-activity-link-one-line';
		}
		return '';
	}
	_getIsSelected(currentActivity, entity) {
		const selected = entity && entity.getLinkByRel('self').href === currentActivity;
		if (selected) {
			this.dispatchEvent(new CustomEvent('sequencenavigator-d2l-activity-link-current-activity', {detail: { href: this.href}}));
		}
		// return this._getTrueClass(focusWithin, selected);
	}

	_showSkeleton(entity) {
		return !entity;
	}
}
customElements.define(D2LActivityLink.is, D2LActivityLink);
