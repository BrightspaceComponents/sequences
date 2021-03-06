import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class';
import { PolymerElement } from '@polymer/polymer/polymer-element';
import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
import '@brightspace-ui/core/components/button/button.js';
import 'd2l-content-icons/d2l-content-icons.js';
import { D2LPoller } from 'd2l-poller';
import '../mixins/d2l-sequences-automatic-completion-tracking-mixin.js';

/*
@extends D2L.PolymerBehaviors.Sequences.LocalizeBehavior
*/
export class D2LSequencesContentFileProcessing extends mixinBehaviors([
	D2L.PolymerBehaviors.Sequences.LocalizeBehavior
], PolymerElement) {
	static get template() {
		return html`
		<style>
			:host {
				display: flex;
				height: 100%;
			}
			.loading-container {
				display: flex;
				flex-direction: column;
				margin: auto;
			}
		</style>
		<div class="loading-container">
			<d2l-loading-spinner size="50"></d2l-loading-spinner>
			<span>[[localize('convertingDocument')]]</span>
		</div>
`;
	}

	static get is() {
		return 'd2l-sequences-content-file-processing';
	}
	static get properties() {
		return {
			href: {
				type: String,
				reflectToAttribute: true,
				notify: true,
			},
			_poller: Object,
			_pollIncrement: {
				type: Number,
				value: 5000
			},
			_pollMax: {
				type: Number,
				value: 120000
			},
			_pollInterval: {
				type: Number,
				value: 5000
			}
		};
	}

	constructor() {
		super();
		this._poller = new D2LPoller();
		this._poll = this._poll.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('d2l-poll', this._poll);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._stopPolling();
		window.removeEventListener('d2l-poll', this._poll);
	}

	_stopPolling() {
		this._poller.teardownPolling();
	}

	async _poll() {
		await this._refreshEntity();
		if (this._pollInterval < this._pollMax) {
			this._pollInterval += this._pollIncrement;
			this._poller.setupPolling(this._pollInterval);
		}
	}

	async _refreshEntity() {
		// Hit the same href to bypass and override the entity cached in EntityStore
		const { entity: refreshedEntity } = await window.D2L.Siren.EntityStore.fetch(this.href, this.token, true);
		this.href = refreshedEntity.getLinkByRel('self').href;
	}
}

customElements.define(D2LSequencesContentFileProcessing.is, D2LSequencesContentFileProcessing);
