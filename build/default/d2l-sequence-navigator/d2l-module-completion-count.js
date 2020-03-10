import { html } from "../node_modules/@polymer/polymer/lib/utils/html-tag.js";
import { CompletionStatusMixin } from '../mixins/completion-status-mixin.js';

class D2LModuleCompletionCount extends CompletionStatusMixin() {
  static get template() {
    return html`
			<span class="countStatus" aria-hidden="true">
				[[localize('sequenceNavigator.completedMofN', 'completed', completionCompleted, 'total', completionTotal)]]
			</span>
			<d2l-offscreen>[[localize('sequenceNavigator.requirementsCompleted', 'completed', completionCompleted, 'total', completionTotal)]]</d2l-offscreen>
		`;
  }

  static get is() {
    return 'd2l-module-completion-count';
  }

}

customElements.define(D2LModuleCompletionCount.is, D2LModuleCompletionCount);