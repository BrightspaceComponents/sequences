import './d2l-activity-link.js';
import { CompletionStatusMixin } from '../mixins/completion-status-mixin.js';
import { PolymerASVLaunchMixin } from '../mixins/polymer-asv-launch-mixin.js';
import '@brightspace-ui-labs/accordion/accordion.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/icons/icon.js';
import 'd2l-offscreen/d2l-offscreen.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/*
@memberOf window.D2L.Polymer.Mixins;
@mixes D2L.Polymer.Mixins.CompletionStatusMixin
@mixes D2L.Polymer.Mixins.PolymerASVLaunchMixin
*/

class D2LInnerModule extends PolymerASVLaunchMixin(CompletionStatusMixin()) {
	static get template() {
		return html`
		<style>
			:host {
				--d2l-inner-module-text-color: var(--d2l-color-celestine);
				--d2l-activity-link-padding: 10px 14px;
				display: block;
				@apply --d2l-body-compact-text;
				color: var(--d2l-inner-module-text-color);
				border-radius: 8px;
			}

			#header-container {
				display: flex;
				padding: 12px 0;
			}

			#header-container.inner-module-empty {
				padding: 12px 0;
			}

			#module-header {
				display: flex;
				justify-content: space-between;
				flex-grow: 1;
				padding: 0 15px;
				cursor: pointer;
			}

			#module-header > a {
				text-decoration: none;
				color: var(--d2l-inner-module-text-color);
				outline: none;
				display: flex;
			}

			#module-header.hide-description,
			#module-header.hide-description > a {
				cursor: default;
			}

			.header-left > d2l-icon {
				padding-right: 15px;
				color: var(--d2l-inner-module-text-color);
			}

			.header-right {
				color: var(--d2l-outer-module-text-color);
			}

			ol {
				list-style-type: none;
				border-collapse: collapse;
				margin: 0;
				padding: 0;
			}

			li {
				padding: 5px 0;
			}

			@keyframes loadingShimmer {
				0% { transform: translate3d(-100%, 0, 0); }
				100% { transform: translate3d(100%, 0, 0); }
			}

			#skeleton {
				display: none;
			}

			:host([show-loading-skeleton]) #skeleton {
				display: block;
				background-color: var(--d2l-color-sylvite);
				overflow: hidden;
				position: relative;
				height: 96px;
				width: 100%;
				border-radius: 8px;
			}

			:host([show-loading-skeleton]) #skeleton::after {
				animation: loadingShimmer 1.8s ease-in-out infinite;
				background: linear-gradient(90deg, var(--d2l-color-sylvite), var(--d2l-color-regolith), var(--d2l-color-sylvite));
				background-color: var(--d2l-color-sylvite);
				content: '';
				height: 100%;
				left: 0;
				position: absolute;
				top: 0;
				width: 100%;
			}

			:host([show-loading-skeleton]) #header-container,
			:host([show-loading-skeleton]) ol {
				display: none;
			}

			/* ======== */

			d2l-labs-accordion-collapse {
				/*border: 1px solid var(--d2l-color-mica);*/
				/*border-radius: 6px;*/
			}

		</style>

		<div id="skeleton"></div>
		<d2l-labs-accordion-collapse no-icons="" flex="">
			<div slot="header" id="header-container" class$="[[isEmpty(subEntities)]]">
				<div id="module-header" class$="[[[[_getHideDescriptionClass(_hideDescription)]]" on-click="_onHeaderClicked">
					<div class="header-left">
						<d2l-icon icon="tier1:folder"></d2l-icon>
						<span class="module-title">[[entity.properties.title]]</span>
					</div>
					<div class="header-right">
						<span class="countStatus" aria-hidden="true">
							[[localize('sequenceNavigator.countStatus', 'completed', completionCompleted, 'total', completionTotal)]]
						</span>
						<d2l-icon id="expand-icon" icon="[[_iconName]]"></d2l-icon>
					</div>
				</div>
			</div>
			<ol>
				<template is="dom-if" if="[[_getShowModuleChildren(_moduleStartOpen, _moduleWasExpanded)]]">
					<template is="dom-repeat" items="[[subEntities]]" as="childLink">
						<li>
							<d2l-activity-link
								inner-last$="[[isLast(subEntities, index)]]"
								href="[[childLink.href]]"
								token="[[token]]"
								current-activity="{{currentActivity}}"
								on-sequencenavigator-d2l-activity-link-current-activity="childIsActiveEvent"
								on-d2l-content-entity-loaded="checkIfChildrenDoneLoading"
								show-underline="[[_nextActivitySiblingIsActivity(subEntities, index)]]"
							></d2l-activity-link>
						</li>
					</template>
				</template>
			</ol>
		</d2l-labs-accordion-collapse>
`;
	}

	static get is() {
		return 'd2l-inner-module';
	}
	static get properties() {
		return {
			currentActivity: {
				type: String,
				value: '',
				notify: true
			},
			_hideDescription: {
				type: Boolean,
				computed: '_getHideDescription(entity)'
			},
			hasCurrentActivity: {
				type: Boolean,
				value: false
			},
			subEntities: {
				type: Array,
				computed: 'getSubEntities(entity)'
			},
			hasActiveChild: {
				type: Boolean,
				computed: '_getHasActiveChild(entity, currentActivity)',
				reflectToAttribute: true
			},
			showLoadingSkeleton: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},
			_childrenLoading: {
				type: Boolean,
				value: true
			},
			_childrenLoadingTracker: {
				type: Object,
				computed: '_setUpChildrenLoadingTracker(subEntities)'
			},
			lastViewedContentObjectEntity: {
				type: Object
			},
			_moduleStartOpen: {
				type: Boolean,
				computed: '_getModuleStartOpen(entity, subEntities, lastViewedContentObjectEntity)'
			},
			_iconName: {
				type: String,
				value: 'tier1:arrow-expand-small'
			}
		};
	}

	static get observers() {
		return [
			'_checkIfNoChildren(entity, subEntities)',
			'_getShowModuleChildren(_moduleStartOpen, _moduleWasExpanded)',
			'_openModule(_moduleStartOpen)'
		];
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-labs-accordion-collapse-clicked', this._onHeaderClicked);
		this.addEventListener('d2l-labs-accordion-collapse-state-changed', this._updateCollapseIconName);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('d2l-labs-accordion-collapse-clicked', this._onHeaderClicked);
		this.removeEventListener('d2l-labs-accordion-collapse-state-changed', this._updateCollapseIconName);
	}

	_getModuleStartOpen(entity, subEntities, lastViewedContentObjectEntity) {
		if (!entity || !lastViewedContentObjectEntity) {
			return false;
		}
		// Set the starting icon depending on the collapse state
		this._updateCollapseIconName();

		const lastViewedParentHref = lastViewedContentObjectEntity.getLinkByRel('up').href;

		const isCurrentModuleLastViewedContentObject = lastViewedContentObjectEntity.getLinkByRel('self').href === this.href;
		const isDirectChildOfCurrentModule = lastViewedParentHref === this.href;
		// const isChildOfSubModule = subEntities.some((s) => s.href === lastViewedParentHref);

		const startOpen = isCurrentModuleLastViewedContentObject || isDirectChildOfCurrentModule;

		if (!startOpen) {
			this.dispatchEvent(new CustomEvent('d2l-content-entity-loaded', {detail: { href: this.href}}));
		}

		return startOpen;
	}

	_updateCollapseIconName() {
		if (this._isAccordionOpen()) {
			this._iconName = 'tier1:arrow-collapse-small';
		} else {
			this._iconName = 'tier1:arrow-expand-small';
		}
	}

	_isAccordionOpen() {
		if (!this.shadowRoot || !this.shadowRoot.querySelector('d2l-labs-accordion-collapse')) {
			return false;
		}
		return this.shadowRoot.querySelector('d2l-labs-accordion-collapse').hasAttribute('opened');
	}

	_getShowModuleChildren(_moduleStartOpen, _moduleWasExpanded) {
		return _moduleStartOpen || _moduleWasExpanded;
	}

	_openModule(_moduleStartOpen) {
		if (_moduleStartOpen) {
			this.shadowRoot.querySelector('d2l-labs-accordion-collapse').setAttribute('opened', '');
		}
	}

	_nextActivitySiblingIsActivity(subEntities, index) {
		if (index >= subEntities.length) {
			return false;
		}

		const nextSibling = subEntities[index + 1];

		return this._isActivity(nextSibling);
	}

	_isActivity(link) {
		return link && link.hasClass('sequenced-activity');
	}

	getSubEntities(entity) {
		return entity && entity.getSubEntities()
			.filter(subEntity => (subEntity.hasClass('sequenced-activity') && subEntity.hasClass('available')) || (subEntity.href && subEntity.hasClass('sequence-description')))
			.map(this._getHref);
	}

	_getHideDescription(entity) {
		return Boolean(entity) && entity.hasClass('hide-description');
	}

	_getHref(entity) {
		return entity && entity.getLinkByRel && entity.getLinkByRel('self') || entity || '';
	}

	_onHeaderClicked() {
		// if (this._hideDescription) {
		// 	return;
		// }
		// this.currentActivity = this.entity.getLinkByRel('self').href;
		// this._contentObjectClick();

		this._moduleWasExpanded = true;
	}

	childIsActiveEvent() {
		this.dispatchEvent(new CustomEvent('sequencenavigator-d2l-inner-module-current-activity', {detail: { href: this.href}}));
	}

	isLast(entities, index) {
		return entities.length <= index + 1;
	}

	isEmpty(subEntities) {
		if (subEntities === null || subEntities.length === 0) {
			return 'inner-module-empty';
		}
		else {
			return '';
		}
	}

	_getHideDescriptionClass(hideDescription) {
		return hideDescription ? 'hide-description' : '';
	}

	_getHasActiveChild(entity, currentActivity) {
		return Boolean(entity) && entity.entities.some(subEntity => subEntity.href === currentActivity);
	}

	_setUpChildrenLoadingTracker(subEntities) {
		if (!subEntities) {
			return {};
		}

		return subEntities.reduce((acc, { href }) => {
			return {
				...acc,
				[href]: false
			};
		}, {});
	}

	// TODO: modify this to only check if self is loaded if closed, children if open
	checkIfChildrenDoneLoading(contentLoadedEvent) {
		const childHref = contentLoadedEvent.detail.href;

		if (!this._childrenLoadingTracker) {
			return;
		}

		if (this._childrenLoadingTracker[childHref] !== undefined) {
			this._childrenLoadingTracker[childHref] = true;
			contentLoadedEvent.stopPropagation();
		}

		if (this._childrenLoading && !Object.values(this._childrenLoadingTracker).some(loaded => !loaded)) {
			this._childrenLoading = false;
			this.dispatchEvent(new CustomEvent('d2l-content-entity-loaded', {detail: { href: this.href}}));
		}
	}

	_checkIfNoChildren(entity, subEntities) {
		if (entity
			&& subEntities
			&& subEntities.length <= 0
		) {
			this._childrenLoading = false;
			this.dispatchEvent(new CustomEvent('d2l-content-entity-loaded', {detail: { href: this.href}}));
		}
	}
}
customElements.define(D2LInnerModule.is, D2LInnerModule);
