import { mixinBehaviors } from "../node_modules/@polymer/polymer/lib/legacy/class.js";
import { PolymerElement } from "../node_modules/@polymer/polymer/polymer-element.js";

function ReturnMixin(classes) {
  return class extends mixinBehaviors(classes, PolymerElement) {
    _onClickBack() {
      const event = new CustomEvent('sequences-return-mixin-click-back', {
        composed: true,
        bubbles: true
      });
      this.dispatchEvent(event);
    }

  };
}

window.D2L = window.D2L || {};
window.D2L.Polymer = window.D2L.Polymer || {};
window.D2L.Polymer.Mixins = window.D2L.Polymer.Mixins || {};
window.D2L.Polymer.Mixins.Sequences = window.D2L.Polymer.Mixins.Sequences || {};
window.D2L.Polymer.Mixins.Sequences.ReturnMixin = ReturnMixin;