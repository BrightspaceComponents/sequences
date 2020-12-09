import { formatDate, formatDateTime } from '@brightspace-ui/intl/lib/dateTime.js';

const availDateTooltipSuffix = 'tooltip';
const availDateAriaLabelSuffix = 'ariaLabel';

function isMobile() {
	return /iP[ao]d|iPhone|Android|Windows (?:Phone|CE)|PlayBook|BlackBerry|Vodafone|Mobile/.test(window.navigator.userAgent);
}

function isIOS() {
	return /iP[ao]d|iPhone/.test(window.navigator.userAgent);
}

function isSafari() {
	return (
		window.navigator.userAgent.indexOf('Safari/') >= 0 &&
		window.navigator.userAgent.indexOf('Chrome/') === -1
	);
}

function parseUrlQueryParameters(url) {
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

function redirectCS(redirectCs, csRedirectPath, noRedirectQueryParamString) {
	if (redirectCs &&
		(isIOS() || isSafari()) &&
		csRedirectPath &&
		noRedirectQueryParamString) {
		const location = window.location.href;
		const queryParams = parseUrlQueryParameters(location);
		const redirectAfterCS = `${location}${Object.keys(queryParams).length ? '&' : '?'}${noRedirectQueryParamString}`;
		const finalForwardUrl = `${csRedirectPath}/${encodeURIComponent(redirectAfterCS)}`;

		window.location.replace(finalForwardUrl);
	}
}

function createDateFromObj(dateObj) {
	if (!dateObj) {
		return null;
	}

	return new Date(
		dateObj.Year,
		dateObj.Month - 1,
		dateObj.Day,
		dateObj.Hour,
		dateObj.Minute,
		dateObj.Second,
		dateObj.Millisecond
	);
}

function formatAvailabilityDateString(localize, startDateObj, endDateObj, langTermSuffix) {
	const tooltipText = langTermSuffix ? `.${langTermSuffix}` : '';
	let format, formatFunction;
	switch (langTermSuffix) {
		case availDateTooltipSuffix:
			format = 'medium';
			formatFunction = formatDateTime;
			break;
		case availDateAriaLabelSuffix:
			format = 'monthDay';
			formatFunction = formatDate;
			break;
		default:
			format = 'shortMonthDay';
			formatFunction = formatDate;
	}

	const startDate = createDateFromObj(startDateObj);
	const endDate = createDateFromObj(endDateObj);

	if (startDate && endDate) {
		return localize(
			`sequenceNavigator.dateRange${tooltipText}`,
			'startDate',
			formatFunction(startDate, { format }),
			'endDate',
			formatFunction(endDate, { format })
		);
	}

	if (startDate) {
		return localize(
			`sequenceNavigator.starts${tooltipText}`,
			'startDate',
			formatFunction(startDate, { format })
		);
	}

	if (endDate) {
		return localize(
			`sequenceNavigator.ends${tooltipText}`,
			'endDate',
			formatFunction(endDate, { format })
		);
	}

	return '';
}

function getDueDateTimeString(dueDateTime, localize) {
	if (!dueDateTime) {
		return;
	}
	const actualDueDateTime = createDateFromObj(dueDateTime);
	const dueDateTimeString = formatDateTime(actualDueDateTime,  {format: 'medium'});

	return localize('sequenceNavigator.due', 'dueDateTime', dueDateTimeString);
}

export {
	isMobile,
	isIOS,
	isSafari,
	parseUrlQueryParameters,
	redirectCS,
	createDateFromObj,
	formatAvailabilityDateString,
	getDueDateTimeString,
	availDateTooltipSuffix,
	availDateAriaLabelSuffix
};
