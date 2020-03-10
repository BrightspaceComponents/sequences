import '../mixins/d2l-sequences-automatic-completion-tracking-mixin.js';
import { html } from "../node_modules/@polymer/polymer/lib/utils/html-tag.js";
/*
	@extends D2L.PolymerBehaviors.Sequences.LocalizeBehavior
*/

export class D2LSequencesContentUnknown extends D2L.Polymer.Mixins.Sequences.AutomaticCompletionTrackingMixin() {
  static get template() {
    return html`
		<style>
		</style>
		[[localize('cannotBeRendered')]]
`;
  }

  static get is() {
    return 'd2l-sequences-content-unknown';
  }

  static get properties() {
    return {
      href: {
        type: String,
        reflectToAttribute: true,
        notify: true,
        observer: '_scrollToTop'
      }
    };
  }

  _scrollToTop() {
    window.top.scrollTo(0, 0);
  }

}
customElements.define(D2LSequencesContentUnknown.is, D2LSequencesContentUnknown);