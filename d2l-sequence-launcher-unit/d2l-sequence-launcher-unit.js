import '@polymer/polymer/polymer-legacy.js';

import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import './d2l-sequence-launcher-module.js';
import '@brightspace-ui-labs/accordion/accordion.js';
import '@brightspace-ui/core/components/colors/colors.js';
import 'siren-entity/siren-entity.js';
import '../localize-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
/*
@memberOf D2L.Polymer.Mixins;
@mixes SirenEntityMixin
*/

class D2LSequenceLauncherUnit extends mixinBehaviors([
	D2L.PolymerBehaviors.Siren.EntityBehavior,
	D2L.PolymerBehaviors.Sequences.LocalizeBehavior
],
PolymerElement
) {
	static get template() {
		return html`
		<style>
			:host {
				display: block;
				height: 100%;
				border: 1px solid var(--d2l-color-mica);
				border-bottom-left-radius: 6px;
				border-bottom-right-radius: 6px;
			}

			.module-item-list {
				list-style-type: none;
				padding: 0 20px;
				margin: 0;
			}

			::slotted(.shadowed) {
				position: relative;
				z-index: 1;
				box-shadow: 0 4px 0 0 rgba(185,194,208,.3);
			}

			.module-content {
				height: calc( 100% - 203px );
			}

			#sidebarContent {
				position: relative;
				overflow-y: auto;
				overflow-x: hidden;
			}
			li:first-of-type d2l-activity-link,
			li:first-of-type {
				margin-top: 10px;
			}

			li:last-of-type {
				margin-bottom: 10px;
			}

			li {
				padding-top: 6px;
			}
		</style>
		<siren-entity href="[[rootHref]]" token="[[token]]" entity="{{_lessonEntity}}"></siren-entity>
		<slot name="lesson-header"></slot>
		<d2l-labs-accordion auto-close="" class="module-content" id="sidebarContent" on-scroll="onSidebarScroll">
			<ol class="module-item-list">
				<template is="dom-repeat" items="[[subEntities]]" as="childLink">
					<template is="dom-if" if="[[childLink.href]]">
						<li>
							<template is="dom-if" if="[[!_isActivity(childLink)]]">
								<d2l-sequence-launcher-module
									href="[[childLink.href]]"
									token="[[token]]"
									current-activity="{{href}}"
									is-sidebar="[[isSidebar()]]"
									last-module="[[isLast(subEntities, index)]]"
									last-viewed-content-object="[[lastViewedContentObject]]"
									on-d2l-content-entity-loaded="checkIfChildrenDoneLoading"
									show-loading-skeleton="[[_showChildSkeletons(showLoadingSkeleton, _childrenLoading)]]"
								>
								</d2l-sequence-launcher-module>
							</template>
							<template is="dom-if" if="[[_isActivity(childLink)]]">
								<d2l-activity-link
									href="[[childLink.href]]"
									token="[[token]]"
									current-activity="{{href}}"
									show-underline="[[_nextActivitySiblingIsActivity(subEntities, index)]]"
									on-d2l-content-entity-loaded="checkIfChildrenDoneLoading"
									show-loading-skeleton="[[_showChildSkeletons(showLoadingSkeleton, _childrenLoading)]]"
								>
								</d2l-activity-link>
							</template>
						</li>
					</template>
				</template>
			</ol>
			<slot name="end-of-lesson"></slot>
		</d2l-labs-accordion>
		`;
	}

	static get is() {
		return 'd2l-sequence-launcher-unit';
	}
	static get properties() {
		return {
			dataAsvCssVars: String,
			href: {
				type: String,
				reflectToAttribute: true,
				notify: true
			},
			role: {
				type: String
			},
			rootHref: {
				type: String,
				computed: '_getRootHref(entity)'
			},
			subEntities: {
				type: Array,
				computed: 'getSubEntities(_lessonEntity)'
			},
			_lessonEntity:{
				type: Object
			},
			lastViewedContentObject: {
				type: String
			},
			showLoadingSkeleton: {
				type: Boolean,
				value: true
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
		return [
			'_checkForEarlyLoadEvent(entity, subEntities)'
		];
	}

	ready() {
		super.ready();
		const styles = this.dataAsvCssVars && JSON.parse(this.dataAsvCssVars) ||
			JSON.parse(document.getElementsByTagName('html')[0].getAttribute('data-asv-css-vars'));

		this.updateStyles(
			styles
		);
	}

	_getRootHref(entity) {
		const rootLink = entity && entity.getLinkByRel('https://sequences.api.brightspace.com/rels/sequence-root');
		return rootLink && rootLink.href || '';
	}

	getSubEntities(entity) {
		return entity && entity.getSubEntities()
			.filter(subEntity =>
				((subEntity.properties && Object.keys(subEntity.properties).length > 0) || subEntity.href) && !subEntity.hasClass('unavailable'))
			.map(this._getHref);
	}

	_isActivity(link) {
		return link && link.hasClass('sequenced-activity');
	}

	_getHref(entity) {
		return entity && entity.getLinkByRel && entity.getLinkByRel('self') || entity || '';
	}

	onSidebarScroll() {
		const sidebarHeader = this.getSideBarHeader();
		if (this.$.sidebarContent.scrollTop === 0) {
			if (sidebarHeader && sidebarHeader.classList && sidebarHeader.classList.contains('shadowed')) {
				sidebarHeader.classList.remove('shadowed');
			}
		} else {
			if (sidebarHeader && sidebarHeader.classList && !sidebarHeader.classList.contains('shadowed')) {
				sidebarHeader.classList.add('shadowed');
			}
		}
	}

	getSideBarHeader() {
		const sidebarHeaderSlot = this.shadowRoot.querySelector('slot');
		return sidebarHeaderSlot.assignedNodes()[0].querySelector('d2l-lesson-header#sidebarHeader');
	}

	_nextActivitySiblingIsActivity(subEntities, index) {
		if (index >= subEntities.length) {
			return false;
		}

		const nextSibling = subEntities[index + 1];

		return this._isActivity(nextSibling);
	}

	isLast(entities, index) {
		return entities.length <= index + 1;
	}
	isSidebar() {
		return this.role === 'navigation';
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

		if (!this._childrenLoadingTracker || !this._childrenLoading) {
			return;
		}

		if (this._childrenLoadingTracker[childHref] !== undefined) {
			this._childrenLoadingTracker[childHref] = true;
			contentLoadedEvent.stopPropagation();
		}

		if (!Object.values(this._childrenLoadingTracker).some(loaded => !loaded)) {
			this._childrenLoading = false;
			this.dispatchEvent(new CustomEvent('d2l-content-entity-loaded', {detail: { href: this.href}}));
		}
	}

	_checkForEarlyLoadEvent(entity, subEntities) {
		if (entity &&
			subEntities && (
			subEntities.length <== 0 ||
			subEntities.find(({ rel }) => rel && rel.includes('item')))
		) {
			this.dispatchEvent(new CustomEvent('d2l-content-entity-loaded', {detail: { href: this.href}}));
		}
	}

	_showChildSkeletons(showLoadingSkeleton, _childrenLoading) {
		return showLoadingSkeleton || _childrenLoading;
	}
}

window.customElements.define(D2LSequenceLauncherUnit.is, D2LSequenceLauncherUnit);
