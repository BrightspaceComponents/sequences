import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/link/link.js';
import '../d2l-sequence-navigator/d2l-missed-activity.js';
import './d2l-sequences-content-eol-missed.js';
import '@polymer/polymer/polymer-legacy.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import '../localize-behavior.js';
import './d2l-sequences-end-of-lesson-progress.js';
import '../mixins/d2l-sequences-return-mixin.js';
import 's-html/s-html.js';
import { D2LPoller } from 'd2l-poller/d2l-poller.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/*
	@extends D2L.PolymerBehaviors.Sequences.LocalizeBehavior
*/

export class D2LSequencesContentEoLMain extends D2L.Polymer.Mixins.Sequences.ReturnMixin([
	D2L.PolymerBehaviors.Siren.EntityBehavior,
	D2L.PolymerBehaviors.Sequences.LocalizeBehavior
]) {
	static get template() {
		return html`
		<style>
			:host {
				color: var(--d2l-color-ferrite);
			}
			.content-eol-main-container {
				text-align: center;
				margin:  68px auto;
			}

			.content-eol-main-container > * {
				margin: 25px 0;
			}

			.missed-count-text {
				color: var(--d2l-color-celestine);
			}
			d2l-missed-activity {
				text-align: left;
				width: 50%;
				margin: auto!important;
			}
			@media (max-width:550px) {
				d2l-missed-activity {
					width: 100%;
				}
			}
		</style>
		<div class="content-eol-main-container">
			<template is="dom-if" if="[[!hasMissed]]">
				<d2l-end-of-lesson-progress href="{{_getRootHref(entity)}}" token="[[token]]">
				</d2l-end-of-lesson-progress>
				<h2>
					[[localize('congratulations')]]
				</h2>
				<p>
					[[sequenceFinishedLangTerm]]
				</p>
				<d2l-button primary="" on-click="_onClickBack">
					[[localize('imDone')]]
				</d2l-button>
			</template>
			<template is="dom-if" if="[[hasMissed]]">
				<template is="dom-if" if="[[!showMissed]]">
					<d2l-end-of-lesson-progress href="{{_getRootHref(entity)}}" token="[[token]]">
					</d2l-end-of-lesson-progress>
					<h2>
						[[localize('niceWork')]]
					</h2>
					<template is="dom-if" if="[[!showEnhancedView]]">
						<p>
							<s-html on-click="_setShowMissed" html="[[localize('missedActivities','count',missedCount)]]"></s-html>
							<br>
							[[localize('noNeedToFinish', 'count', missedCount)]]
						</p>
						<d2l-button on-click="_setShowMissed">
							[[localize('showMissed')]]
						</d2l-button>
						<d2l-button primary="" on-click="_onClickBack">
							[[localize('imDone')]]
						</d2l-button>
					</template>
					<template is="dom-if" if="[[showMissed]]">
						<d2l-sequences-content-eol-missed href="{{href}}" token="[[token]]">
						</d2l-sequences-content-eol-missed>
					</template>
				</template>

				<template is="dom-if" if="[[showEnhancedView]]">
					<d2l-missed-activity href="{{href}}" token="[[token]]"> </d2l-missed-activity>
					<d2l-button on-click="_onClickBack">
						[[localize('backToContents')]]
					</d2l-button>
				</template>
			</template>
		</div>
`;
	}

	static get is() {
		return 'd2l-sequences-content-eol-main';
	}
	static get properties() {
		return {
			href: {
				type: String,
				reflectToAttribute: true,
				notify: true,
				observer: '_scrollToTop'
			},
			token: {
				type: String
			},
			missedCount: {
				type: Number,
				computed: '_getMissedCount(entity)'
			},
			hasMissed: {
				type: Boolean,
				computed: '_getHasMissed(missedCount)'
			},
			showMissed: {
				type: Boolean,
				value: false
			},
			showEnhancedView:{
				type: Boolean,
				alue: false,
				computed: '_isFlagOn(entity)'
			},
			sequenceFinishedLangTerm: {
				type: String,
				computed: '_getSequenceFinishedLangTerm(entity)'
			},
			_pollAttempt: {
				type: Number,
				value: 0
			},
			_pollMaxAttempts: {
				type: Number,
				value: 10
			},
			_pollInterval: {
				type: Number,
				value: 1000
			}
		};
	}

	static get eolClass() {
		return 'end-of-sequence';
	}

	static get observers() {
		return ['_onActivitySelected(entity)'];
	}

	constructor() {
		super();
		this._poller = new D2LPoller();
		this._stopPolling = this._stopPolling.bind(this);
		this._poll = this._poll.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('d2l-completion-checker', this._poll);
		this._poller.setupPolling(this._pollInterval, 'd2l-completion-checker');
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._stopPolling();
		window.removeEventListener('d2l-completion-checker', this._poll);
	}

	_scrollToTop() {
		window.top.scrollTo(0, 0);
	}

	_onActivitySelected(entity) {
		if (entity && entity.hasClass('sequenced-activity')) {
			this.showMissed = false;
		}
	}
	_getHasMissed(missedCount) {
		return missedCount !== 0;
	}
	_getMissedCount(entity) {
		if (!entity) return 0;
		return entity.entities.length;
	}
	_setShowMissed() {
		this.showMissed = true;
	}

	_getRootHref(entity) {
		const rootLink = entity && entity.getLinkByRel('https://sequences.api.brightspace.com/rels/sequence-root');
		return rootLink && rootLink.href || '';
	}

	_isFlagOn(entity) {
		return entity && entity.class && entity.class.includes('enhanced-end-of-sequence');
	}

	_getSequenceFinishedLangTerm(entity) {
		return entity && entity.properties && entity.properties.sequenceFinishedLangTerm || this.localize && this.localize('activitiesFinishedGreatJob') || '';
	}

	_stopPolling() {
		this._poller.teardownPolling();
	}

	async _poll() {
		if (this.hasMissed && this._pollAttempt < this._pollMaxAttempts) {
			await this._refreshEntities();
			this._pollAttempt++;
			this._poller.setupPolling(this._pollInterval, 'd2l-completion-checker');
		} else {
			this._stopPolling();
		}
	}

	async _refreshEntities() {
		if (this.href) {
			await window.D2L.Siren.EntityStore.fetch(this.href, this.token, true);
		}
	}

}
customElements.define(D2LSequencesContentEoLMain.is, D2LSequencesContentEoLMain);
