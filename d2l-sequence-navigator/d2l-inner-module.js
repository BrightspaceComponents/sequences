import './d2l-activity-link.js';
import { CompletionStatusMixin } from '../mixins/completion-status-mixin.js';
import { PolymerASVLaunchMixin } from '../mixins/polymer-asv-launch-mixin.js';
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
				/*background-color: var(--d2l-color-sylvite);*/

				/* TODO: only the children get padded */
				/*padding: 0 24px;*/
			}

			#header-container {
				display: flex;
				padding: 12px 0;
				/*border-radius: 8px 8px 0 0;*/
				/*border-style: solid;*/
				/*border-width: var(--d2l-inner-module-border-width, 0);*/
				/*border-color: transparent;*/
				/*height: 30px;*/
			}

			/* TODO: can prob delete */
			#header-container.inner-module-empty {
				padding: 12px 0;
			}

			#module-header {
				/*--d2l-inner-module-opacity: 1;*/
				/*--d2l-inner-module-backdrop-opacity: 0;*/
				display: flex;
				flex-grow: 1;
				padding: 4px 14px 0 14px;
				cursor: pointer;
			}

			#module-header > a {
				text-decoration: none;
				color: var(--d2l-inner-module-text-color);
				outline: none;
				display: flex;
			}

			d2l-icon {
				/* TODO: use var */
				padding-right: 15px;
				color: var(--d2l-color-celestine);
			}

			#module-header.hide-description,
			#module-header.hide-description > a {
				cursor: default;
			}

			/* TODO: can probably delete */
			.module-title {
				/*@apply --d2l-body-compact-text;*/

				/*color: var(--d2l-inner-module-text-color);*/

				/*width: 100%;*/
				/*overflow: hidden;*/
				/*text-overflow: ellipsis;*/
				/*float: left;*/
				/*display: -webkit-box;*/
				/*-webkit-box-orient: vertical;*/
				/*-webkit-line-clamp: 2; !* number of lines to show *!*/
				/*max-height: 2.0rem; !* fallback *!*/
				/*font-size: 14px;*/
			}

			ol {
				list-style-type: none;
				border-collapse: collapse;
				margin: 0px;
				padding: 0px;
			}

			li {
				padding-top: 6px;
				padding-bottom: 6px;
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

		</style>

		<div id="skeleton"></div>
		<div id="header-container" class$="[[isEmpty(subEntities)]]">
			<div id="module-header" class$="[[_getIsSelected(currentActivity)]] [[_getHideDescriptionClass(_hideDescription)]]" on-click="_onHeaderClicked">
				<div on-click="_onHeaderClicked" style="width: 100%;">
					<div style="display: inline-flex;">
						<d2l-icon icon="tier1:folder"></d2l-icon>
						<span class="module-title">[[entity.properties.title]]</span>
					</div>
					<d2l-icon id="expand-icon" icon="tier1:arrow-expand-small" style="float: right;"></d2l-icon>
				</div>
			</div>
		</div>
		<ol>
			<template is="dom-repeat" items="[[subEntities]]" as="childLink">
				<li>
					<d2l-activity-link
						inner-last$="[[isLast(subEntities, index)]]"
						href="[[childLink.href]]"
						token="[[token]]"
						current-activity="{{currentActivity}}"
						on-sequencenavigator-d2l-activity-link-current-activity="childIsActiveEvent"
						on-d2l-content-entity-loaded="checkIfChildrenDoneLoading"
							next-sibling-is-activity="[[_activitySiblingIsActivity(subEntities, index)]]"
					></d2l-activity-link>
				</li>
			</template>
		</ol>
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
				computed: '_getHideDesciption(entity)'
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
			}
		};
	}

	static get observers() {
		return ['_checkIfNoChildren(entity, subEntities)'];
	}

	_activitySiblingIsActivity(subEntities, index) {
		if (index >= subEntities.length) {
			return false;
		}

		const nextSibling = subEntities[index + 1];

		return !this._isActivity(nextSibling);
	}

	// TODO: make this a helper function
	_isActivity(link) {
		return link && link.hasClass('sequenced-activity');
	}

	getSubEntities(entity) {
		return entity && entity.getSubEntities()
			.filter(subEntity => (subEntity.hasClass('sequenced-activity') && subEntity.hasClass('available')) || (subEntity.href && subEntity.hasClass('sequence-description')))
			.map(this._getHref);
	}

	_getHideDesciption(entity) {
		return Boolean(entity) && entity.hasClass('hide-description');
	}

	_getHref(entity) {
		// TODO: dont need the entity check since we're already passed that I think
		return entity && entity.getLinkByRel && entity.getLinkByRel('self') || entity || '';
	}
	_getIsSelected(currentActivity) {
		const selected = this.entity && this.entity.getLinkByRel('self').href === currentActivity;
		if (selected) {
			this.dispatchEvent(new CustomEvent('sequencenavigator-d2l-inner-module-current-activity', {detail: { href: this.href}}));
		}
		// return this._getTrueClass(focusWithin, selected);
	}

	_onHeaderClicked() {
		if (this._hideDescription) {
			return;
		}
		this.currentActivity = this.entity.getLinkByRel('self').href;
		this._contentObjectClick();
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
