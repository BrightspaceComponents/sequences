import { D2LSequencesContentLink } from './d2l-sequences-content-link.js';
import { redirectCS } from '../util/util.js';

export class D2LSequencesContentContentServiceLink extends D2LSequencesContentLink {
	static get is() {
		return 'd2l-sequences-content-content-service-link';
	}

	static get properties() {
		return {
			redirectCs: Boolean,
			csRedirectPath: String,
			noRedirectQueryParamString: String
		};
	}

	_redirect() {
		redirectCS(this.redirectCs, this.csRedirectPath, this.noRedirectQueryParamString);
	}
}
customElements.define(D2LSequencesContentContentServiceLink.is, D2LSequencesContentContentServiceLink);
