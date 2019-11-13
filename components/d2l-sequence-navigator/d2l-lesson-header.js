/**
'd2l-lesson-header'
@demo demo/index.html
*/
import { CompletionStatusMixin } from '../../util/d2l-sequence-navigator/completion-status-mixin.js';
import { ASVFocusWithinMixin } from '../../util/d2l-sequence-navigator/asv-focus-within-mixin.js';
import 'd2l-offscreen/d2l-offscreen.js';
import 'd2l-colors/d2l-colors.js';
import 'd2l-typography/d2l-typography.js';
import '@brightspace-ui/core/components/meter/meter-circle.js';
import 'd2l-progress/d2l-progress.js';
import '@brightspace-ui/core/components/icons/icon.js';
import { isColorAccessible } from '@brightspace-ui/core/helpers/contrast.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/*
@memberOf D2L.Polymer.Mixins;
@mixes CompletionStatusMixin
@mixes D2L.Polymer.Mixins.ASVFocusWithinMixin
*/
class D2LLessonHeader extends ASVFocusWithinMixin(CompletionStatusMixin()) {
	static get template() {
		return html`
		<style>
		:host {
			--d2l-lesson-header-text-color: var(--d2l-asv-text-color);
			--d2l-lesson-header-background-color: transparent;
			--d2l-lesson-header-border-color: transparent;
			--d2l-lesson-header-opacity: 1;
			--d2l-meter-size: 48px;
			background-color: transparent;
			color: var(--d2l-lesson-header-text-color);
			margin: 10px var(--d2l-sequence-nav-padding) 10px var(--d2l-sequence-nav-padding);
			padding: 6px;
			display: block;
			position: relative;
			z-index: 0;
		}

		:host(.d2l-asv-current) {
			--d2l-lesson-header-background-color: var(--d2l-asv-primary-color);
			--d2l-lesson-header-text-color: var(--d2l-asv-selected-text-color);
			--d2l-lesson-header-border-color: rgba(0, 0, 0, 0.6);
		}

		a:focus {
			outline: none;
		}

		:host(.d2l-asv-focus-within:not(.hide-description)),
		:host(:hover:not(.hide-description)) {
			--d2l-lesson-header-background-color: var(--d2l-asv-primary-color);
			--d2l-lesson-header-border-color: rgba(0, 0, 0, 0.42);
			--d2l-lesson-header-text-color: var(--d2l-asv-text-color);
			--d2l-lesson-header-opacity: 0.26;
		}

		div.bkgd, div.border {
			position: absolute;
			top: 0;
			left: 0;
			border-radius: 8px;
		}

		div.bkgd {
			opacity: var(--d2l-lesson-header-opacity);
			background-color: var(--d2l-lesson-header-background-color);
			z-index: -2;
			height: 100%;
			width: 100%;
		}

		div.border {
			border-style: solid;
			border-width: 1px;
			border-color: var(--d2l-lesson-header-border-color);
			z-index: -1;
			height: calc(100% - 2px);
			width: calc(100% - 2px);
		}

		.module-title {
			@apply --d2l-heading-3;
			font-size: 24px;
			overflow: hidden;
			word-wrap: break-word;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2; /* number of lines to show */
			max-height: 3rem; /* fallback */
			margin-top: 0px;
			margin-bottom: 0px;
		}

		.module-completion-count {
			@apply --d2l-body-small-text;
			color: var(--d2l-lesson-header-text-color);
			text-align: right;
			padding-top: 10px;
			padding-right: 3px;
		}

		.d2l-header-lesson-link,
		.d2l-header-lesson-link:hover {
			cursor: pointer;
			color: var(--d2l-lesson-header-text-color);
			text-decoration: none;
		}

		progress.d2l-progress {
			@apply --d2l-progress;
			background-color: var(--d2l-color-gypsum);
			height:12px;
		}
		/* this is necessary to avoid white bleed over rounded corners in chrome and safari */
		progress.d2l-progress::-webkit-progress-bar {
			@apply --d2l-progress-webkit-progress-bar;
		}
		/* strangely, comma separating the selectors for these pseudo-elements causes them to break */
		progress.d2l-progress::-webkit-progress-value {
			@apply --d2l-progress-webkit-progress-value;
			background-color: var(--d2l-color-celestine);
			border:none;
		}
		/* note: unable to get firefox to animate the width... seems animation is not implemented for progress in FF */
		progress.d2l-progress::-moz-progress-bar {
			@apply --d2l-progress-moz-progress-bar;
			background-color: var(--d2l-color-celestine);
			border:none;
		}
		progress.d2l-progress::-ms-fill {
			@apply --d2l-progress-ms-fill;
			border: 1px solid transparent;
			border-radius: 10px;
			/*Added default value since --d2l-color-celestine doesn't work on Edge
			https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12837456/*/
			background-color: var(--d2l-color-celestine, #006fbf);
		}
		:host(.hide-description) .d2l-header-lesson-link,
		:host(.hide-description) .d2l-header-lesson-link:hover {
			cursor:default;
		}
		:host(.d2l-asv-current) progress.d2l-progress {
			background-color: transparent;
			border: 1px solid var(--d2l-asv-selected-text-color);
			box-shadow: none;
		}
		:host(.d2l-asv-current) progress.d2l-progress::-webkit-progress-value {
			background-color: var(--d2l-asv-selected-text-color);
		}
		:host(.d2l-asv-current) progress.d2l-progress::-moz-progress-bar {
			background-color: var(--d2l-asv-selected-text-color);
		}
		:host(.d2l-asv-current) progress.d2l-progress::-ms-fill {
			background-color: var(--d2l-asv-selected-text-color, #fff);
		}
		/* Added light-theme id as a workaround for Edge issue with variables in -ms-fill
		https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12837456/ */
		:host(.d2l-asv-current) progress.d2l-progress#light-theme::-ms-fill {
			background-color: var(--d2l-asv-selected-text-color, #565a5c);
		}

		:host(.d2l-asv-focus-within:not(.hide-description)) progress.d2l-progress,
		:host(:hover:not(.hide-description)) progress.d2l-progress {
			background-color: transparent;
			border: 1px solid var(--d2l-asv-text-color);
			box-shadow: none;
		}
		:host(.d2l-asv-focus-within:not(.hide-description)) progress.d2l-progress::-webkit-progress-value,
		:host(:hover:not(.hide-description)) progress.d2l-progress::-webkit-progress-value {
			background-color: var(--d2l-asv-text-color);
		}
		:host(.d2l-asv-focus-within:not(.hide-description)) progress.d2l-progress::-moz-progress-bar,
		:host(:hover:not(.hide-description)) progress.d2l-progress::-moz-progress-bar {
			background-color: var(--d2l-asv-text-color);
		}
		:host(.d2l-asv-focus-within:not(.hide-description)) progress.d2l-progress::-ms-fill,
		:host(:hover:not(.hide-description)) progress.d2l-progress::-ms-fill {
			background-color: var(--d2l-asv-text-color, #565a5c);
		}

		div.title-container {
			display: flex;
			justify-content: space-between;
		}
		div.title {
			width: calc(100% - var(--d2l-meter-size));
		}
		d2l-meter-circle {
			width: var(--d2l-meter-size);
			min-width: var(--d2l-meter-size);
		}

		d2l-icon {
			color: var(--d2l-lesson-header-text-color);
		}

		div.unit-info {
			font-size: 14px;
		}

		</style>
		<div class="bkgd"></div>
		<div class="border"></div>
		<a href="javascript:void(0)" class="d2l-header-lesson-link" on-click="_onHeaderClicked">
			<div class="title-container">
				<div class="title">
					<template is="dom-if" if="[[_useModuleIndex]]">
						<div class="unit-info">
							<span>[[_moduleTitle]]</span>
							<d2l-icon icon="d2l-tier1:bullet"></d2l-icon>
							<span>[[_completionProgress]]</span>
						</div>
					</template>
					<span class="module-title">[[entity.properties.title]]</span>
				</div>
				<template is="dom-if" if="[[_useNewProgressBar]]">
					<d2l-meter-circle
						class="d2l-progress"
						value="[[completionCount.completed]]"
						max="[[completionCount.total]]"
						foreground-light$="[[_lightMeter]]">
					</d2l-meter-circle>
				</template>
			</div>
			<template is="dom-if" if="[[!_useNewProgressBar]]">
				<progress id$="[[isLightTheme()]]" class="d2l-progress" value="[[percentCompleted]]" max="100"></progress>
				<div class="module-completion-count" aria-hidden="true">[[localize('sequenceNavigator.completedMofN', 'completed', completionCompleted, 'total', completionTotal)]]</div>
			</template>
			<div><d2l-offscreen>[[localize('sequenceNavigator.requirementsCompleted', 'completed', completionCompleted, 'total', completionTotal)]]</d2l-offscreen></div>
		</a>
`;
	}

	static get is() {
		return 'd2l-lesson-header';
	}
	static get properties() {
		return {
			class: {
				type: String,
				reflectToAttribute: true,
				computed:'_getHeaderClass(currentActivity, entity, focusWithin)'
			},
			currentActivity: {
				type: String,
				value: '',
				notify: true,
				observer: '_lightenMeter'
			},
			_useModuleIndex: {
				type: Boolean,
				value: false,
				computed: '_checkModuleIndex(entity.properties)'
			},
			_moduleIndex: {
				type: Number,
				computed: '_getModuleIndex(entity.properties)'
			},
			_siblingModules: {
				type: Number,
				computed: '_getSiblingModules(entity.properties)'
			},
			_moduleTitle: {
				type: String,
				computed: '_getModuleTitle(entity.properties)'
			},
			_useNewProgressBar: {
				type: Boolean,
				value: false,
				computed: '_getUseNewProgressBar(entity.properties)'
			},
			_lightMeter: {
				type: Boolean,
				value: false
			},
			_selfLink: {
				type: String,
				value: '',
				computed: '_getSelfLink(entity)',
				observer: '_lightenMeter'
			},
			_completionProgress: {
				type: String,
				computed: '_getCompletionProgress(entity.properties, _self)'
			},
			_self: Object
		};
	}

	ready() {
		super.ready();
		this.addEventListener('mouseover', this._lightenMeter);
		this.addEventListener('mouseout', this._lightenMeter);
		this.addEventListener('blur', this._lightenMeter);
		this._self = this;
	}

	_lightenMeter() {
		const style = getComputedStyle(this);
		const bkgdColour = style.getPropertyValue('--d2l-lesson-header-background-color').trim();
		const opacity = style.getPropertyValue('--d2l-lesson-header-opacity');
		const ferrite = style.getPropertyValue('--d2l-color-ferrite').trim();

		this._lightMeter = opacity >= 1 &&
			this.currentActivity === this._selfLink &&
			bkgdColour !== 'transparent' &&
			!isColorAccessible(bkgdColour, ferrite);
	}

	_getHeaderClass(currentActivity, entity, focusWithin) {
		const selfLink = entity && entity.getLinkByRel('self').href;
		const selected = currentActivity === selfLink;
		let trueClasses = this._getTrueClass(focusWithin, selected);
		if (entity && entity.hasClass('hide-description')) {
			trueClasses += ' hide-description';
		}
		return trueClasses;
	}

	_getSelfLink(entity) {
		return entity && entity.getLinkByRel('self').href || '';
	}

	_onHeaderClicked() {
		if (this.entity && this.entity.hasClass('hide-description')) {
			return;
		}
		this.currentActivity = this._selfLink;
	}
	isLightTheme() {
		var styles = JSON.parse(document.getElementsByTagName('html')[0].getAttribute('data-asv-css-vars'));
		if (styles && styles['--d2l-asv-selected-text-color'] === 'var(--d2l-color-ferrite)') {
			return 'light-theme';
		}
		return;
	}

	_getCompletionProgress(properties) {
		return properties &&  properties.completionProgressLangTerm
		|| this._self && this._self.localize('sequenceNavigator.currentModule', 'current', this._moduleIndex, 'total', this._siblingModules)
		|| '';
	}

	_checkModuleIndex(properties) {
		return properties && properties.moduleIndex && properties.numberOfSiblingModules;
	}

	_getModuleIndex(properties) {
		return properties && properties.moduleIndex;
	}

	_getModuleTitle(properties) {
		return properties && properties.courseName;
	}

	_getSiblingModules(properties) {
		return properties && properties.numberOfSiblingModules;
	}

	_getUseNewProgressBar(properties) {
		return properties && properties.useNewProgressBar;
	}
}

window.customElements.define(D2LLessonHeader.is, D2LLessonHeader);
