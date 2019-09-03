import { D2LSequencesContentLink } from './d2l-sequences-content-link.js';

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
		if (this.redirectCs &&
			(this._isIOS() || this._isSafari()) &&
			this.csRedirectPath &&
			this.noRedirectQueryParamString) {
			const location = window.location.href;
			const queryParams = this._parseUrlQueryParameters(location);
			const redirectAfterCS = `${location}${Object.keys(queryParams).length ? '&' : '?'}${this.noRedirectQueryParamString}`;
			const finalForwardUrl = `${this.csRedirectPath}/${encodeURIComponent(redirectAfterCS)}`;

			window.location.replace(finalForwardUrl);
		}
	}

	_isIOS() {
		return /iP[ao]d|iPhone/.test(window.navigator.userAgent);
	}

	_isSafari() {
		return (
			window.navigator.userAgent.indexOf('Safari/') >= 0 &&
			window.navigator.userAgent.indexOf('Chrome/') === -1
		);
	}

	_parseUrlQueryParameters(url) {
		const queryStart = url.indexOf('?');
		let fragmentStart = url.indexOf('#');

		const params = {};
		if (queryStart < 0 || (fragmentStart >= 0 && queryStart > fragmentStart)) {
			return params;
		}

		if (fragmentStart < 0) {
			fragmentStart = undefined;
		}

		url.substring(queryStart + 1, fragmentStart).split('&').forEach(queryParam => {
			const parts = queryParam.split('=', 2);
			if (parts.length === 2) {
				params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
			}
		});

		return params;
	}

}
customElements.define(D2LSequencesContentContentServiceLink.is, D2LSequencesContentContentServiceLink);
