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
				display: block;
				@apply --d2l-body-compact-text;
				color: var(--d2l-color-celestine);
				line-height: initial;
			}

			:focus {
				border: 2px solid var(--d2l-color-celestine);
			}

			#title-container {
				display: inline-flex;
				align-items: center;
			}

			#module-header {
				display: flex;
				justify-content: space-between;
				flex-grow: 1;
				cursor: pointer;
				padding: 12px;
				border-radius: 6px;
			}

			#module-header:hover {
				background: var(--d2l-color-gypsum);
			}

			#module-header:hover a {
				color: var(--d2l-color-celestine-minus-1);
			}

			#module-header:hover d2l-icon {
				color: var(--d2l-color-celestine-minus-1);
			}

			#module-header a {
				text-decoration: none;
				color: var(--d2l-color-celestine);
				outline: none;
				display: flex;
			}

			d2l-icon {
				padding-right: 15px;
				color: var(--d2l-color-celestine);
			}

			.count-status {
				color: var(--d2l-color-ferrite);
			}

			#module-header.hide-description,
			#module-header.hide-description > a {
				cursor: default;
			}

			ol {
				list-style-type: none;
				border-collapse: collapse;
				margin: 0;
				padding: 8px 20px 0 30px;
			}

			li {
				padding-top: 6px;
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

			:host([show-loading-skeleton]) #module-header,
			:host([show-loading-skeleton]) ol {
				display: none;
			}
		</style>
		<div id="skeleton"></div>
		<div id="module-header" class$="[[[[_getHideDescriptionClass(_hideDescription)]]" on-click="_onHeaderClicked">
			<div id="title-container">
				<d2l-icon icon="tier1:folder"></d2l-icon>
				<a href="javascript:void(0)">[[entity.properties.title]]</a>
			</div>
			<span class="count-status" aria-hidden="true">
				[[localize('sequenceNavigator.countStatus', 'completed', completionCompleted, 'total', completionTotal)]]
			</span>
		</div>
		<ol>
			<template is="dom-repeat" items="[[subEntities]]" as="childLink">
				<li>
					<d2l-activity-link
						href="[[childLink.href]]"
						token="[[token]]"
						current-activity="{{currentActivity}}"
						on-sequencenavigator-d2l-activity-link-current-activity="childIsActiveEvent"
						on-d2l-content-entity-loaded="checkIfChildrenDoneLoading"
						show-underline="[[_nextActivitySiblingIsActivity(subEntities, index)]]"
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
			}
		};
	}

	static get observers() {
		return ['_checkIfNoChildren(entity, subEntities)'];
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
