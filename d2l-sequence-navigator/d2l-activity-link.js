import { CompletionStatusMixin } from '../mixins/completion-status-mixin.js';
import { PolymerASVLaunchMixin } from '../mixins/polymer-asv-launch-mixin.js';
import { ASVFocusWithinMixin } from '../mixins/asv-focus-within-mixin.js';
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

class D2LActivityLink extends ASVFocusWithinMixin(PolymerASVLaunchMixin(CompletionStatusMixin())) {
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
				cursor: pointer;
				@apply --d2l-body-compact-text;
				padding: var(--d2l-activity-link-padding, 10px 24px);
				border-collapse: separate;
				box-sizing: border-box;
				border: 1px solid transparent;
				border-width: 1px 0;
				position: relative;
				z-index: 0;
				background-color: transparent;
				margin-top: -1px;
			}

			:host(.d2l-asv-current) {
				--d2l-activity-link-background-color: var(--d2l-asv-primary-color);
				--d2l-activity-link-text-color: var(--d2l-asv-selected-text-color);
				--d2l-activity-link-subtext-color: var(--d2l-asv-selected-text-color);
				--d2l-activity-link-border-color: rgba(0, 0, 0, 0.6);
			}

			:host(:focus) {
				outline: none;
				--d2l-activity-link-opacity: 0.26;
				--d2l-activity-link-backdrop-opacity: 1;
			}

			:host(.d2l-asv-focus-within),
			:host(:focus),
			:host(:hover) {
				--d2l-activity-link-background-color: var(--d2l-asv-primary-color);
				--d2l-activity-link-subtext-color: var(--d2l-asv-text-color);
				--d2l-activity-link-border-color: rgba(0, 0, 0, 0.42);
				--d2l-activity-link-text-color: var(--d2l-asv-text-color);
				--d2l-activity-link-opacity: 0.26;
				--d2l-activity-link-backdrop-opacity: 1;
			}

			:host > div {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
			}

			div.bkgd,
			div.border,
			div.bkgd-backdrop {
				position: absolute;
				top: 0;
				left: 0;
				border-radius: 8px;
			}

			div.bkgd {
				opacity: var(--d2l-activity-link-opacity);
				background-color: var(--d2l-activity-link-background-color);
				z-index: -2;
				height: 100%;
				width: 100%;
			}

			div.bkgd-backdrop {
				background-color: #FFFFFF;
				z-index: -3;
				height: 100%;
				width: 100%;
				opacity: var(--d2l-activity-link-backdrop-opacity);
			}

			div.border {
				border: 1px solid var(--d2l-activity-link-border-color, transparent);
				border-width: 1px;
				z-index: -1;
				height: calc(100% - 2px);
				width: calc(100% - 2px);
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
				color: var(--d2l-activity-link-text-color);
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
				color: var(--d2l-activity-link-text-color);
			}

			:host([inner-last]) {
				border-radius: 0 0 8px 8px;
			}

			:host(.d2l-asv-current) d2l-completion-requirement {
				color: var(--d2l-asv-text-color);
			}

			:host(.d2l-asv-current:not(:hover)) d2l-completion-requirement {
				color: var(--d2l-asv-selected-text-color);
			}

		</style>
		<div class="bkgd"></div>
		<div class="bkgd-backdrop"></div>
		<div class="border"></div>
		<div on-click="_contentObjectClick">
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
				computed: '_getIsSelected(currentActivity, entity, focusWithin)',
				reflectToAttribute: true
			},
			completionStatus: {
				type: String,
				computed: '_getCompletionStatus(entity)',
			},
		};
	}
	static get observers() {
		return [
			'onEntityChanged(entity)',
			'onCurrentActivityChanged(currentActivity, entity)'
		];
	}

	ready() {
		super.ready();
		this.addEventListener('keypress', this._onKeyPress);
	}

	onEntityChanged(entity) {
		//eslint-disable-next-line
		console.log({entityChanged: entity});

		if (!entity) {
			return;
		}

		// Dispatch an event here with the href as a detail, don't bubble up
		this.dispatchEvent(new CustomEvent('d2l-sequence-navigator-item-loaded', {
			detail: {
				href: this.href
			},
			bubbles: false
		}));
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
	_getIsSelected(currentActivity, entity, focusWithin) {
		const selected = entity && entity.getLinkByRel('self').href === currentActivity;
		if (selected) {
			this.dispatchEvent(new CustomEvent('sequencenavigator-d2l-activity-link-current-activity', {detail: { href: this.href}}));
		}
		return this._getTrueClass(focusWithin, selected);
	}
}
customElements.define(D2LActivityLink.is, D2LActivityLink);
