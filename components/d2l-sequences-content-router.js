import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '../mixins/d2l-sequences-router-mixin.js';
import EntityTypeHelper from '../helpers/entity-type-helper.js';

class D2LSequencesContentRouter extends D2L.Polymer.Mixins.Sequences.RouterMixin(EntityTypeHelper.getEntityType) {
	static get template() {
		return html``;
	}

	static get is() {
		return 'd2l-sequences-content-router';
	}
}
customElements.define(D2LSequencesContentRouter.is, D2LSequencesContentRouter);

