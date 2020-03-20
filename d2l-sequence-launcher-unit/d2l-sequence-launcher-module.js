import '../d2l-sequence-navigator/d2l-inner-module.js';
import '../d2l-sequence-navigator/d2l-activity-link.js';
import { CompletionStatusMixin } from '../mixins/completion-status-mixin.js';
import { PolymerASVLaunchMixin } from '../mixins/polymer-asv-launch-mixin.js';
import { ASVFocusWithinMixin } from '../mixins/asv-focus-within-mixin.js';
import '@brightspace-ui-labs/accordion/accordion.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/icons/icon.js';
import 'd2l-offscreen/d2l-offscreen.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/*
@memberOf window.D2L.Polymer.Mixins;
@mixes D2L.Polymer.Mixins.CompletionStatusMixin
@mixes D2L.Polymer.Mixins.PolymerASVLaunchMixin
@mixes D2L.Polymer.Mixins.ASVFocusWithinMixin
*/

class D2LSequenceLauncherModule extends ASVFocusWithinMixin(PolymerASVLaunchMixin(CompletionStatusMixin())) {
	static get template() {
		return html`
		<style>
			:host {
				display: block;
				@apply --d2l-body-compact-text;
				width: 100%;
				--d2l-outer-module-text-color: var(--d2l-asv-text-color);
				--d2l-outer-module-background-color: transparent;
				--d2l-activity-link-padding: 10px 24px;
				margin-top: -1px;
			}

			#header-container {
				--d2l-outer-module-border-color: var(--d2l-outer-module-background-color);
				--d2l-outer-module-opacity: 1;
				box-sizing: border-box;
				padding: var(--d2l-activity-link-padding);
				color: var(--d2l-outer-module-text-color);
				background-color: transparent;
				border-style: solid;
				border-width: var(--d2l-outer-module-border-width, 1px);
				border-color: transparent;
				position: relative;
				z-index: 0;
				cursor: pointer;
			}

			#header-container.hide-description {
				cursor: default;
			}

			#header-container.d2l-asv-current {
				--d2l-outer-module-background-color: var(--d2l-asv-primary-color);
				--d2l-outer-module-text-color: var(--d2l-asv-selected-text-color);
				--d2l-outer-module-border-color: rgba(0, 0, 0, 0.6);
			}

			#header-container.d2l-asv-focus-within:not(.hide-description),
			#header-container:hover:not(.hide-description) {
				--d2l-outer-module-background-color: var(--d2l-asv-primary-color);
				--d2l-outer-module-border-color: rgba(0, 0, 0, 0.42);
				--d2l-outer-module-text-color: var(--d2l-asv-text-color);
				--d2l-outer-module-opacity: 0.26;
			}

			div.bkgd, div.border {
				position: absolute;
				top: 0;
				left: 0;
				border-radius: 8px;
			}

			div.bkgd {
				opacity: var(--d2l-outer-module-opacity);
				background-color: var(--d2l-outer-module-background-color);
				z-index: -2;
				height: 100%;
				width: 100%;
			}

			div.border {
				border-style: solid;
				border-width: 1px;
				border-color:	var(--d2l-outer-module-border-color);
				z-index: -1;
				height: calc(100% - 2px);
				width: calc(100% - 2px);
			}

			.start-date-text {
				margin: 0;
				text-align: right;
				color: var(--d2l-outer-module-text-color);
			}

			.module-header {
				display: table;
				table-layout: fixed;
				width: 100%;
			}

			.module-title {
				@apply --d2l-body-compact-text;
				font-weight: 700;
				width: calc(100% - 2rem - 24px);

				overflow: hidden;
				text-overflow: ellipsis;
				float: left;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2; /* number of lines to show */
				max-height: 2.4rem; /* fallback */
			}

			.module-completion-count {
				@apply --d2l-body-small-text;
				font-weight: 700;
				color: var(--d2l-outer-module-text-color);
				text-align: right;
				float: right;
				display: table-cell;
				width: 2rem;
				line-height: inherit !important;
				padding-left: 24px;
			}

			.should-pad {
				padding: 0 10px;
			}

			ol {
				list-style-type: none;
				border-collapse: collapse;
				margin: 0px;
				padding: 0;
			}

			.optionalStatus {
				color: var(--d2l-color-tungsten);
			}

			d2l-icon {
				color: var(--d2l-outer-module-text-color);
			}
			d2l-labs-accordion-collapse > a {
				outline: none;
			}

			.d2l-asv-current .optionalStatus {
				color: var(--d2l-asv-text-color);
			}

			.d2l-asv-current:not(:hover) .optionalStatus {
				color: var(--d2l-asv-selected-text-color);
			}

			hr {
				border: solid var(--d2l-color-mica);
				border-width: 1px 0 0 0;
				width: 100%;
				margin: 24px 0 0 0;
			}

			li {
				padding-top: 6px;
				padding-bottom: 6px;
			}

			#startDate{
				color: var(--d2l-outer-module-text-color, inherit);
				font-size: var(--d2l-body-small-text_-_font-size);
				font-weight: var(--d2l-body-small-text_-_font-weight);
				line-height: var(--d2l-body-small-text_-_line-height);
			}

		</style>

		<siren-entity href="[[lastViewedContentObject]]" token="[[token]]" entity="{{_lastViewedContentObjectEntity}}"></siren-entity>
		<d2l-labs-accordion-collapse no-icons="" flex="">
			<div slot="header" id="header-container" class$="[[_getIsSelected(currentActivity, focusWithin)]] [[isEmpty(subEntities)]] [[_getHideDescriptionClass(_hideModuleDescription, isSidebar)]]" is-sidebar$="[[isSidebar]]">
				<div class="bkgd"></div>
				<div class="border"></div>
				<div class="module-header">
					<span class="module-title">[[entity.properties.title]]</span>
					<span class="module-completion-count">
						<template is="dom-if" if="[[showCount]]">
							<span class="countStatus" aria-hidden="true">
								[[localize('sequenceNavigator.countStatus', 'completed', completionCompleted, 'total', completionTotal)]]
							</span>
							<d2l-offscreen>[[localize('sequenceNavigator.requirementsCompleted', 'completed', completionCompleted, 'total', completionTotal)]]</d2l-offscreen>
						</template>
						<template is="dom-if" if="[[showCheckmark]]">
							<span class="completedStatus">
								<d2l-icon aria-label$="[[localize('sequenceNavigator.completed')]]" icon="tier1:check"></d2l-icon>
							</span>
						</template>
						<template is="dom-if" if="[[!showCheckmark]]">
							<h6 class="start-date-text" aria-label$="[[entity.properties.startDateText]]" >[[entity.properties.startDateText]]</h6>
						</template>
						<template is="dom-if" if="[[showOptional]]">
							<span class="optionalStatus">
								[[localize('sequenceNavigator.optional')]]
							</span>
						</template>
					</span>
				</div>
				<div id ="startDate">[[startDate]]</div>
			</div>
			<ol>
				<template is="dom-if" if="[[_getShowModuleChildren(_moduleStartOpen, _moduleWasExpanded)]]">
					<template is="dom-repeat" items="[[subEntities]]" as="childLink">
						<li on-click="_onActivityClicked" class$="[[_padOnActivity(childLink)]]">
							<template is="dom-if" if="[[_isActivity(childLink)]]">
								<d2l-activity-link last-module$="[[lastModule]]" is-sidebar$="[[isSidebar]]" href="[[childLink.href]]" token="[[token]]" current-activity="{{currentActivity}}" on-sequencenavigator-d2l-activity-link-current-activity="childIsActiveEvent"></d2l-activity-link>
							</template>
							<template is="dom-if" if="[[!_isActivity(childLink)]]">
								<d2l-inner-module href="[[childLink.href]]" token="[[token]]" current-activity="{{currentActivity}}" on-sequencenavigator-d2l-inner-module-current-activity="childIsActiveEvent"></d2l-inner-module>
							</template>
						</li>
					</template>
				</template>
			</ol>
		</d2l-labs-accordion-collapse>
		`;
	}

	static get is() {
		return 'd2l-sequence-launcher-module';
	}

	static get behaviors() {
		D2L.PolymerBehaviors.LocalizeBehavior;
	}

	static get properties() {
		return {
			currentActivity: {
				type: String,
				value: '',
				notify: true
			},
			subEntities: {
				type: Array,
				computed: 'getSubEntities(entity, _allowChildrenRendering)'
			},
			hasChildren: {
				type: Boolean,
				computed: '_hasChildren(entity)'
			},
			showCount: {
				type: Boolean,
				value: false,
				computed: '_showCount(completionCount)'
			},
			showCheckmark: {
				type: Boolean,
				value: false,
				computed: '_showCheckmark(completionCount)'
			},
			showOptional: {
				type: Boolean,
				value: false,
				computed: '_showOptional(completionCount)'
			},
			isSidebar: {
				type: Boolean
			},
			lastModule: {
				type: Boolean,
				value: false
			},
			startDate: {
				type: String,
				computed: 'getFormattedDate(entity)'
			},
			_hideModuleDescription: {
				type: Boolean,
				computed: '_getHideModuleDescription(entity)'
			},
			lastViewedContentObject: {
				type: String
			},
			_lastViewedContentObjectEntity: {
				type: Object
			},
			_moduleStartOpen: {
				type: Boolean,
				computed: '_getModuleStartOpen(entity, subEntities, _lastViewedContentObjectEntity)'
			},
			_moduleWasExpanded: {
				type: Boolean,
				value: false
			}
		};
	}

	static get observers() {
		return ['_getShowModuleChildren(_moduleStartOpen, _moduleWasExpanded)'];
	}

	_accordionCollapseClass(focusWithin) {
		return this._focusWithinClass(focusWithin);
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-labs-accordion-collapse-clicked', this._onHeaderClicked);
		this.addEventListener('d2l-labs-accordion-collapse-state-changed', this._updateHeaderClass);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('d2l-labs-accordion-collapse-clicked', this._onHeaderClicked);
		this.removeEventListener('d2l-labs-accordion-collapse-state-changed', this._updateHeaderClass);
	}

	_isAccordionOpen() {
		if (!this.shadowRoot || !this.shadowRoot.querySelector('d2l-labs-accordion-collapse')) {
			return false;
		}
		return this.shadowRoot.querySelector('d2l-labs-accordion-collapse').hasAttribute('opened');
	}

	_isOptionalModule() {
		return this.completionCount && this.completionCount.total === 0 && this.completionCount.optionalTotal > 0;
	}

	_isAllRequiredViewed() {
		return this.completionCount && this.completionCount.total > 0 && this.completionCount.total === this.completionCount.completed;
	}

	_isActivity(link) {
		return link && link.hasClass('sequenced-activity');
	}

	_showCount() {
		if (!this.hasChildren) {
			return false;
		}
		if (this._isAccordionOpen()) {
			return true;
		}
		return !this._isOptionalModule() && !this._isAllRequiredViewed();
	}

	_showCheckmark() {
		if (!this.hasChildren) {
			return false;
		}
		if (this._isAccordionOpen()) {
			return false;
		}
		return !this._isOptionalModule() && this._isAllRequiredViewed();
	}

	_showOptional() {
		if (!this.hasChildren) {
			return false;
		}
		if (this._isAccordionOpen()) {
			return false;
		}
		return this._isOptionalModule();
	}

	getSubEntities(entity, allowChildrenRendering) {
		return allowChildrenRendering && entity && entity.getSubEntities()
			.filter(subEntity => (subEntity.hasClass('sequenced-activity') && subEntity.hasClass('available')) || (subEntity.href && subEntity.hasClass('sequence-description')))
			.map(this._getHref);
	}

	_getHref(entity) {
		return entity && entity.getLinkByRel && entity.getLinkByRel('self') || entity || '';
	}

	_hasChildren(entity) {
		return entity && entity.getSubEntities().length !== 0;
	}

	_getIsSelected(currentActivity, focusWithin) {
		const selected = this.entity && this.entity.getLinkByRel('self').href === currentActivity;
		return this._getTrueClass(focusWithin, selected);
	}

	_getModuleStartOpen(entity, subEntities, _lastViewedContentObjectEntity) {
		if (!entity || !_lastViewedContentObjectEntity) {
			return false;
		}

		const lastViewedParentHref = _lastViewedContentObjectEntity.getLinkByRel('up').href;

		const isCurrentModuleLastViewedContentObject = _lastViewedContentObjectEntity.getLinkByRel('self').href === this.href;
		const isDirectChildOfCurrentModule = lastViewedParentHref === this.href;
		const isChildOfSubModule = subEntities.some((s) => s.href === lastViewedParentHref);

		return isCurrentModuleLastViewedContentObject || isDirectChildOfCurrentModule || isChildOfSubModule;
	}

	_padOnActivity(childLink) {
		return this.isSidebar || this._isActivity(childLink)
			? ''
			: 'should-pad';
	}

	_onActivityClicked(e) {
		const childLink =	e.model.__data.childLink;
		if (childLink.class.includes('sequenced-activity') && this.currentActivity !== childLink.href) {
			this.currentActivity = childLink.href;
		}
	}

	_onHeaderClicked() {
		this._moduleWasExpanded = true;
	}

	_getShowModuleChildren(_moduleStartOpen, _moduleWasExpanded) {
		return _moduleStartOpen || _moduleWasExpanded;
	}

	childIsActiveEvent() {
		this.shadowRoot.querySelector('d2l-labs-accordion-collapse').setAttribute('opened', '');
	}

	isLastOfSubModule(entities, index) {
		if (entities.length <= index + 1 && !this._isActivity(entities[index]) && (!this.lastModule || this.isSidebar)) {
			return true;
		}
		else {
			return false;
		}
	}

	isEmpty(subEntities) {
		if ((subEntities === null || subEntities.length === 0) && (!this.lastModule || this.isSidebar)) {
			return 'empty-module-header-container';
		}
		else {
			return '';
		}
	}

	getFormattedDate(entity) {

		const currentDate = new Date();
		let startDate;
		let result = '';
		if (entity && entity.properties && entity.properties.startDate) {
			const startYear = entity.properties.startDate.Year;
			const startMonth = entity.properties.startDate.Month - 1;
			const startDay = entity.properties.startDate.Day;
			startDate = new Date(startYear, startMonth, startDay);
		}
		let dueDate;
		if (entity && entity.properties && entity.properties.dueDate) {
			const dueYear = entity.properties.dueDate.Year;
			const dueMonth = entity.properties.dueDate.Month - 1;
			const dueDay = entity.properties.dueDate.Day;
			dueDate = new Date(dueYear, dueMonth, dueDay);
		}

		if (startDate && startDate > currentDate) {
			result = this.formatDate(startDate, {format: 'medium'});
			return this.localize('sequenceNavigator.starts', 'startDate', result);
		}
		if (dueDate) {
			result = this.formatDate(dueDate,  {format: 'medium'});
			return this.localize('sequenceNavigator.due', 'dueDate', result);
		}
		return result;
	}

	_getHideModuleDescription(entity) {
		return Boolean(entity) && entity.hasClass('hide-description');
	}

	_hasActiveChild(entity, currentActivity) {
		const hasActiveTopic = Boolean(entity) && entity.entities.some(subEntity => subEntity.href === currentActivity);
		const innerModules = this.shadowRoot && this.shadowRoot.querySelectorAll('d2l-inner-module') || [];
		const hasActiveModule = [...innerModules].some(innerMod => innerMod.hasAttribute('has-active-child'));

		return hasActiveTopic || hasActiveModule;
	}

	_updateHeaderClass() {
		if (this.isSidebar && this._hideModuleDescription) {
			const active = this._hasActiveChild(this.entity, this.currentActivity) && !this._isAccordionOpen();
			this.$['header-container'].setAttribute('class', this._getTrueClass(this.focusWithin, active));
		}
	}

	_getHideDescriptionClass(_hideModuleDescription, isSidebar) {
		return _hideModuleDescription && !isSidebar ? 'hide-description' : '';
	}
}
customElements.define(D2LSequenceLauncherModule.is, D2LSequenceLauncherModule);
