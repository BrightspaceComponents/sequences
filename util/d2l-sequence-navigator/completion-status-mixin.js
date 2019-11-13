import '@polymer/polymer/polymer-legacy.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import '../../localize-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
/*
	@polymerMixin
	@mixes SirenEntityMixin
	@memberOf D2L.Polymer.Mixins;
*/
export function CompletionStatusMixin() {
	return class extends mixinBehaviors([
		D2L.PolymerBehaviors.Siren.EntityBehavior,
		D2L.PolymerBehaviors.Sequences.LocalizeBehavior,
	],
	PolymerElement
	) {
		static get properties() {
			return {
				completionCount: {
					type: Object,
					computed: '_getStatus(entity)',
					observer: '_getPercentCompleted'
				},
				percentCompleted: {
					type: Number,
					value: 0
				},
				completionCompleted: {
					type: String,
					value: '',
					computed: '_stringifyCount(completionCount.completed)'
				},
				completionTotal: {
					type: String,
					value: '',
					computed: '_stringifyCount(completionCount.total)'
				}
			};
		}

		_getStatus(entity) {
			const completionEntity = entity && entity.getSubEntityByClass('completion');
			if (!completionEntity || !completionEntity.properties) {
				return {
					completed: 0,
					optionalViewed: 0,
					optionalTotal: 0,
					total: 0
				};
			}
			return completionEntity.properties;
		}

		_getPercentCompleted() {
			if (!this.completionCount || this.completionCount.total === 0) {
				this.percentCompleted = '0';
				return;
			}
			this.percentCompleted = 100 * this.completionCount.completed / this.completionCount.total;
		}

		_stringifyCount(count) {
			if (count === undefined ||  count === null) {
				return '';
			}
			return `${count}`;
		}

		_getCompletionRequirement(activity) {
			if (!activity) {
				return;
			}
			var subEntity = activity.getSubEntityByClass('link-activity') || activity.getSubEntityByClass('file-activity');
			if (subEntity
				&& subEntity.getSubEntityByClass('exemption')
				&& subEntity.getSubEntityByClass('exemption').hasClass('exempted')) {
				return 'exempt';
			}
			if (subEntity && !subEntity.getSubEntityByClass('completion')) {
				return 'optional';
			}
			else return 'required';
		}

		_getCompletionStatus(activity) {
			if (!activity) {
				return;
			}
			const subEntity = activity.getSubEntityByClass('link-activity') || activity.getSubEntityByClass('file-activity');
			if (!subEntity) {
				return;
			}

			const completionClass = subEntity.getSubEntityByClass('completion');
			if (!completionClass) {
				if (subEntity.getSubEntityByClass('last-viewed')) {
					return 'optional-viewed';
				}
				return 'optional';
			}

			return completionClass.hasClass('completed')
				? 'complete'
				: 'incomplete';
		}
	};
}
