import '@polymer/polymer/polymer-legacy.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import './d2l-outer-module.js';
import '@brightspace-ui-labs/accordion/accordion.js';
import '@brightspace-ui/core/components/colors/colors.js';
import 'siren-entity/siren-entity.js';
import '../localize-behavior.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {PolymerElement} from '@polymer/polymer/polymer-element.js';

/*
@memberOf D2L.Polymer.Mixins;
@mixes SirenEntityMixin
*/

class D2LSequenceNavigator extends mixinBehaviors([
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
			background-color: white;
			border: 1px solid var(--d2l-color-mica);
		}

		.module-item-list {
			list-style-type: none;
			padding: 0;
			margin: 0;
		}

		::slotted(.shadowed) {
			position: relative;
			z-index: 1;
			box-shadow: 0 4px 0 0 rgba(185,194,208,.3);
		}

		.module-content {
			height: calc( 100% - 203px );
			border-top: 1px solid var(--d2l-color-mica);
		}

		d2l-activity-link:focus {
			outline: none;
		}

		#sidebarContent {
			position: relative;
			overflow-y: auto;
			overflow-x: hidden;
		}
		li:first-of-type d2l-activity-link,
		li:first-of-type d2l-outer-module {
			margin-top: 0;
		}

		li {
			padding-top: 6px;
			padding-bottom: 6px;
			border-bottom: 1px solid var(--d2l-color-mica);
			padding-left: var(--d2l-sequence-nav-padding, 0);
			padding-right: var(--d2l-sequence-nav-padding, 0);
		}

		</style>
		<siren-entity href="[[rootHref]]" token="[[token]]" entity="{{_lessonEntity}}"></siren-entity>
		<slot name="lesson-header"></slot>
		<d2l-labs-accordion auto-close="" class="module-content" id="sidebarContent" on-scroll="onSidebarScroll">
			<ol class="module-item-list">

				<template is="dom-if" if="[[!_isLoading]]">
					<template is="dom-repeat" items="[[topicEntities]]" as="childLink">
						<template is="dom-if" if="[[childLink.href]]">
							<li>
								<template is="dom-if" if="[[!_isActivity(childLink)]]">
									<d2l-outer-module href="[[childLink.href]]" token="[[token]]" current-activity="{{href}}" disabled="[[disabled]]" is-sidebar="[[isSidebar()]]" last-module="[[isLast(topicEntities, index)]]"></d2l-outer-module>
								</template>
								<template is="dom-if" if="[[_isActivity(childLink)]]">
									<d2l-activity-link href="[[childLink.href]]" token="[[token]]" current-activity="{{href}}" before-module$="[[isBeforeModule(topicEntities, index)]]"></d2l-activity-link>
								</template>
							</li>
						</template>
					</template>
				</template>

				<template is="dom-if" if="[[_isLoading]]">
					<span>--- hi this is loading ---</span>
				</template>

			</ol>
			<slot name="end-of-lesson"></slot>
		</d2l-labs-accordion>
		`;
	}

	static get is() {
		return 'd2l-sequence-navigator';
	}
	static get properties() {
		return {
			dataAsvCssVars: String,
			disabled: {
				type: Boolean
			},
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
			// TODO: rename topicEntities
			topicEntities: {
				type: Array,
				computed: '_getTopicEntities(_lessonEntity)'
			},
			_lessonEntity: {
				type: Object
			},
			_isLoading: {
				type: Boolean,
				value: true,
				computed: '_getIsLoading(topicEntities)'
			},
			keysThatNeedToLoad: {
				type: Object,
				value: {}
			}
		};
	}

	ready() {
		super.ready();
		const styles = this.dataAsvCssVars && JSON.parse(this.dataAsvCssVars) ||
			JSON.parse(document.getElementsByTagName('html')[0].getAttribute('data-asv-css-vars'));

		this.updateStyles(
			styles
		);
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-sequence-navigator-item-loaded', this._onNavigatorListItemLoaded);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('d2l-sequence-navigator-item-loaded', this._onNavigatorListItemLoaded);
	}

	// Need to check when _every_ list item is loaded. Recursively using d2l-outer-module
	_onNavigatorListItemLoaded(e) {
		//eslint-disable-next-line
		// console.log({topLevelLoaded: e});

		const hrefThatLoaded = e.detail.href;

		// this event is consumed in multiple places, check if this component cares
		if (this.keysThatNeedToLoad.hasOwnProperty(hrefThatLoaded)) {
			// console.log({navLoaded: hrefThatLoaded});

			this.keysThatNeedToLoad[hrefThatLoaded] = true;
			this.checkIfFullyLoaded();
		}
	}

	checkIfFullyLoaded() {
		if (Object.values(this.keysThatNeedToLoad).every((val) => !!val)) {
			console.log('==== THE WHOLE THING IS FULLY LOADED!!!!! ======');
		}
	}

	// This is only looking at the outer modules, not all topics.. Need to find a way to load all inner stuff
	// Rename from topicEntities
	_getIsLoading(topicEntities) {
		//eslint-disable-next-line
		// console.log({topicEntities});

		return !topicEntities || !topicEntities.length;
	}

	_getRootHref(entity) {
		const rootLink = entity && entity.getLinkByRel('https://sequences.api.brightspace.com/rels/sequence-root');
		return rootLink && rootLink.href || '';
	}

	_getTopicEntities(entity) {
		const subEntities = entity && entity.getSubEntities()
			.filter(subEntity =>
				((subEntity.properties && Object.keys(subEntity.properties).length > 0) || subEntity.href) && !subEntity.hasClass('unavailable'))
			.map(this._getHref);

		if (subEntities && subEntities.length) {
			const keysThatNeedToLoad = subEntities.reduce((acc, curr) => {
				return {
					...acc,
					[curr.href]: false,
				};
			}, {});

			console.log({ d2lseqnavkeys: keysThatNeedToLoad });

			this.keysThatNeedToLoad = keysThatNeedToLoad;
		}

		return subEntities;
	}

	_isActivity(link) {
		return link && link.hasClass('sequenced-activity');
	}

	// Simplify and inline
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

	isBeforeModule(topicEntities, index) {
		if (index < topicEntities.length - 1) {
			if (!this._isActivity(topicEntities[index + 1])) {
				return true;
			}
		}
		return false;
	}

	isLast(topicEntities, index) {
		return topicEntities.length <= index + 1;
	}
	isSidebar() {
		return this.role === 'navigation';
	}
}

window.customElements.define(D2LSequenceNavigator.is, D2LSequenceNavigator);
