import { CompletionStatusMixin } from '../mixins/completion-status-mixin.js';
import "../node_modules/@brightspace-ui/core/components/icons/icon.js";
import "../node_modules/@brightspace-ui/core/components/colors/colors.js";
import { html } from "../node_modules/@polymer/polymer/lib/utils/html-tag.js";
/*
@memberOf window.D2L.Polymer.Mixins;
@mixes CompletionStatusMixin
*/

class D2LCompletionStatus extends CompletionStatusMixin() {
  static get template() {
    return html`
		<style>
			d2l-icon {
				color: inherit;
			}
		</style>
		<template is="dom-if" if="[[isComplete]]">
			<d2l-icon aria-label$="[[localize('sequenceNavigator.completed')]]" icon="tier1:check"></d2l-icon>
		</template>
`;
  }

  static get is() {
    return 'd2l-completion-status';
  }

  static get properties() {
    return {
      completionStatus: {
        type: String,
        computed: '_getCompletionStatus(entity)',
        observer: '_showCompletionType'
      },
      isOptional: {
        type: Boolean
      },
      isComplete: {
        type: Boolean
      }
    };
  }

  _showCompletionType(completion) {
    switch (completion) {
      case 'complete':
        this.isComplete = true;
        break;

      case 'optional-viewed':
        this.isComplete = true;
        this.isOptional = true;
        break;

      case 'optional':
        this.isOptional = true;
        break;

      case 'incomplete':
        this.isComplete = false;
        this.isOptional = false;
    }
  }

}

customElements.define(D2LCompletionStatus.is, D2LCompletionStatus);