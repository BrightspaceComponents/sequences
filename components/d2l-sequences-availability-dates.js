import '@polymer/polymer/polymer-legacy.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { formatDate, formatDateTime } from '@brightspace-ui/intl/lib/dateTime.js';

import '../localize-behavior.js';
import { createDateFromObj } from '../util/util.js';
import '../mixins/d2l-sequences-return-mixin.js';
/*
	@extends D2L.PolymerBehaviors.Sequences.LocalizeBehavior
*/

class D2LSequencesAvailabilityDates extends D2L.Polymer.Mixins.Sequences.ReturnMixin([
	D2L.PolymerBehaviors.Sequences.LocalizeBehavior
]) {
	static get template() {
		return html`
		<style>
		</style>
		<div id="availability-dates">[[_availabilityDateString]]</div>
		<d2l-tooltip for="availability-dates">[[_availabilityDateTooltip]]</d2l-tooltip>
		`;
	}

	static get is() {
		return 'd2l-sequences-availability-dates';
	}

	static get properties() {
		return {
			startDate: Object,
			endDate: Object,
			_availabilityDateString: {
				type: String,
				value: '',
				computed: '_getAvailabilityDateString(startDate, endDate)'
			},
			_availabilityDateTooltip: {
				type: String,
				value: '',
				computed: '_getAvailabilityDateTooltip(startDate, endDate)'
			}
		};
	}

	_getAvailabilityDateString(startDate, endDate) {
		return this._formatAvailabilityDateString(startDate, endDate);
	}

	_getAvailabilityDateTooltip(startDate, endDate) {
		return this._formatAvailabilityDateString(startDate, endDate, true);
	}

	_formatAvailabilityDateString(startDateObj, endDateObj, forTooltip) {
		const tooltipText = forTooltip ? '.tooltip' : '';
		const format = forTooltip ? 'medium' : 'shortMonthDay';
		const formatFunction = forTooltip ? formatDateTime : formatDate;

		const startDate = createDateFromObj(startDateObj);
		const endDate = createDateFromObj(endDateObj);

		if (startDate && endDate) {
			return this.localize(
				`sequenceNavigator.dateRange${tooltipText}`,
				'startDate',
				formatFunction(startDate, { format }),
				'endDate',
				formatFunction(endDate, { format })
			);
		}

		if (startDate) {
			return this.localize(
				`sequenceNavigator.starts${tooltipText}`,
				'startDate',
				formatFunction(startDate, { format })
			);
		}

		if (endDate) {
			return this.localize(
				`sequenceNavigator.ends${tooltipText}`,
				'endDate',
				formatFunction(endDate, { format })
			);
		}

		return '';
	}
}

window.customElements.define(D2LSequencesAvailabilityDates.is, D2LSequencesAvailabilityDates);
