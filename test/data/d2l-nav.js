/*
 * D2Lnav - control next and previous navigation buttons in D2L Content Player
 *
 * Different than the lms file since this does not use JQuery
 */
'use strict';

var D2Lnav = (function() { // eslint-disable-line no-unused-vars
	var instance = {},
		doneInit = false,
		isHostCommunicationEstablished = false,
		waitTime = 50,

		NAV_PARENT_HANDLER = 'd2l.nav.customize',
		NAV_LOCAL_HANDLER = 'd2l.nav.client',
		CUSTOM_NEXT_LINK_SELECTOR = 'd2l-nav-next',
		CUSTOM_PREV_LINK_SELECTOR = 'd2l-nav-prev';

	instance.init = function() {
		requestCustomization();

		if (!doneInit) {
			window.addEventListener('message', handleMessage, false);

			doneInit = true;

			setTimeout(verifyInit, waitTime);
		}
	};

	// If the client window comes up first but is not the first frame in the host (e.g. LOR-hosted content), we will not receive the host's 'init' message,
	// so we need to wait and retry until the host is reached and thus knows where to send events.
	function verifyInit() {
		if (!isHostCommunicationEstablished) {

			requestCustomization();

			// exponential backoff, since if the first couple of attempts don't work, we're likely not
			// running in an enabled iframe at all
			waitTime *= 2;
			setTimeout(verifyInit, waitTime);
		}
	}

	function handleMessage(event) {
		try {
			var data = JSON.parse(event.data);
			if (data.handler !== NAV_LOCAL_HANDLER) {
				return;
			}

			switch (data.action) {
				case 'next':
					clickIfEnabled(document.getElementsByClassName(CUSTOM_NEXT_LINK_SELECTOR)[0]);
					break;

				case 'prev':
					clickIfEnabled(document.getElementsByClassName(CUSTOM_PREV_LINK_SELECTOR)[0]);
					break;

				// may also receive:
				// - 'init', which is sent by the host to trigger a customization request in case the host window wasn't ready during our init
				// - 'ack', which indicates that customization has happened, and is sent just so isHostCommunicationEstablished can be set to true
			}

			isHostCommunicationEstablished = true;

			// If local state has changed or the host just came up (action is next, prev, or init), tell the host which
			// nav buttons to override. If action was 'ack', we're done.
			if (data.action !== 'ack') {
				requestCustomization();
			}

		} catch (e) {
			// failed to parse JSON, probably due to an unrelated use of postMessage
			// since the D2L logging wrapper may or may not be present, we will not log this
		}
	}

	function requestCustomization() {
		// NB: payload must be stringified for IE

		window.parent.postMessage(JSON.stringify({
			handler: NAV_PARENT_HANDLER,
			hasNext: isLinkSet(document.getElementsByClassName(CUSTOM_NEXT_LINK_SELECTOR)[0]),
			hasPrev: isLinkSet(document.getElementsByClassName(CUSTOM_PREV_LINK_SELECTOR)[0])
		}),
		'*');
	}

	function clickIfEnabled(el) {
		if (isLinkSet(el)) el.click();
	}

	function isLinkSet(link) {
		return link && link.getAttribute('href');
	}

	return instance;
})();

//$(document).ready(D2Lnav.init); //Initialized by page this is on for tests and demos
