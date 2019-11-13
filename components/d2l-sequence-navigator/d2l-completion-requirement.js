import { CompletionStatusMixin } from '../../util/d2l-sequence-navigator/completion-status-mixin.js';
import 'd2l-icons/d2l-icons.js';
import 'd2l-colors/d2l-colors.js';
import 'd2l-typography/d2l-typography.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/*
@memberOf window.D2L.Polymer.Mixins;
@mixes CompletionStatusMixin
*/

class D2LCompletionRequirement extends CompletionStatusMixin() {
	static get template() {
		return html`
		<style>
			:host {
				color: inherit;
				display: inline;
				@apply --d2l-body-small-text;
			}
		</style>
		<template is="dom-if" if="[[isExempt]]">
			<div class="exempt">
				[[localize('sequenceNavigator.exempt')]]
			</div>
		</template>
		<template is="dom-if" if="[[isOptional]]">
			<div class="optional">
				[[localize('sequenceNavigator.optional')]]
			</div>
		</template>
`;
	}

	static get is() {
		return 'd2l-completion-requirement';
	}
	static get properties() {
		return {
			completionRequirement: {
				type: String,
				computed: '_getCompletionRequirement(entity)',
				observer: '_showCompletionRequirementType'
			},
			isExempt: {
				type: Boolean
			},
			isOptional: {
				type: Boolean
			}
		};
	}

	_showCompletionRequirementType(exemption) {
		switch (exemption) {
			case 'exempt':
				this.isExempt = true;
				break;
			case 'optional':
				this.isOptional = true;
				break;
			default:
				this.isExempt = false;
				this.isOptional = false;
		}
	}
}
customElements.define(D2LCompletionRequirement.is, D2LCompletionRequirement);
