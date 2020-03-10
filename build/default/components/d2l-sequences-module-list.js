import { html, PolymerElement } from "../node_modules/@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../node_modules/@polymer/polymer/lib/legacy/class.js";
import { EntityMixin } from "../node_modules/siren-sdk/src/mixin/entity-mixin.js";
import { SequenceEntity } from "../node_modules/siren-sdk/src/sequences/SequenceEntity.js";
import '../d2l-sequence-navigator/d2l-completion-status.js';
import "../node_modules/@polymer/iron-collapse/iron-collapse.js";
import "../node_modules/d2l-link/d2l-link-shared-styles.js";
import "../node_modules/@brightspace-ui/core/components/icons/icon.js";
import "../node_modules/@brightspace-ui/core/components/colors/colors.js";
import "../node_modules/d2l-typography/d2l-typography-shared-styles.js";
import '../localize-behavior.js';
const behaviors = [D2L.PolymerBehaviors.Sequences.LocalizeBehavior, D2L.PolymerBehaviors.Siren.EntityBehavior];
/**
 * @customElement
 * @polymer
 */

class D2lSequenceModuleList extends mixinBehaviors(behaviors, EntityMixin(PolymerElement)) {
  static get template() {
    return html`
			<style include="d2l-link-shared-styles"></style>
			<style include="d2l-typography-shared-styles">
				.d2l-sequences-module-list-container {
					background-color: #ffffff;
					border-bottom-left-radius: 6px;
					border-bottom-right-radius: 6px;
					border-top: 1px solid var(--d2l-color-sylvite);
				}
				.d2l-sequences-module-list-list {
					border-bottom: 1px solid var(--d2l-color-sylvite);
					counter-reset: d2l-sequence-module-list-counter;
					list-style: none;
					margin: 0;
					padding: 12px 0;
					position:relative;
					width: 100%;
				}
				.d2l-sequences-module-list-list li {
					box-sizing: content-box;
					margin: 0 0 -1px 0;
					width: 100%;
				}
				.d2l-sequences-module-list-list li:first-child {
					margin: -1px 0 -1px 0;
				}
				.d2l-sequences-module-list-list li a div {
					@apply --d2l-body-compact-text;
					color: var(--d2l-color-ferrite);
					display: flex;
					justify-content: space-between;
					letter-spacing: 0.4px;
					line-height: 1.19;
					padding: 13px 20px;
				}
				.d2l-sequences-module-list-list li a {
					--d2l-link-hover_-_color: var(--d2l-color-ferrite);
					@apply --d2l-link;
					display: block;
				}
				.d2l-sequences-module-list-list li a:hover {
					@apply --d2l-link-hover;
				}
				.d2l-sequences-module-list-list li a[continue],
				.d2l-sequences-module-list-list li a[continue] div {
					color: var(--d2l-color-celestine);
				}
				.d2l-sequences-module-list-list li a:hover div {
					background-color: var(--d2l-color-regolith);
					border-bottom: 1px solid var(--d2l-color-mica);
					border-top: 1px solid var(--d2l-color-mica);
					padding: 12px 20px;
				}
				.d2l-sequences-module-list-vertical-flip {
					-moz-transform: scale(1, -1);
					-o-transform: scale(1, -1);
					-webkit-transform: scale(1, -1);
					transform: scale(1, -1);
				}
				.d2l-sequences-module-list-collapse-title d2l-icon {
					margin: 12px 7px 12px 12px;
				}
				.d2l-sequences-module-list-collapse-title {
					align-items: center;
					display: flex;
				}
				.d2l-sequences-module-list-collapse-title,
				.d2l-sequences-module-list-collapse-title:visited,
				.d2l-sequences-module-list-collapse-title:hover {
					@apply --d2l-body-compact-text;
					color: var(--d2l-color-ferrite);
					letter-spacing: 0.5px;
					text-decoration: none;
				}
				.d2l-sequences-module-list-collapse-title:hover span {
					text-decoration: underline;
				}
				.d2l-sequences-module-list-collapse-title:hover {
					background-color: var(--d2l-color-regolith);
				}
				.d2l-sequences-module-list-list a[focus=focus],
				.d2l-sequences-module-list-collapse-title[focus=focus] {
					border-color: rgba(0, 111, 191, 0.4);
					border-radius: 6px;
					box-shadow: 0 0 0 4px rgba(0, 111, 191, 0.3);
					outline : none;
					position: relative;
					z-index: 5;
				}
			</style>
			<template is="dom-if" if="[[_hasModules(_modules)]]">
			<div class="d2l-sequences-module-list-container">
				<iron-collapse id="collapse" no-animation="[[noAnimation]]" opened="[[opened]]">
					<ol class="d2l-sequences-module-list-list">
						<template is="dom-repeat" items="[[_modules]]">
							<li>
								<a href$="[[item.href]]" on-focus="_onFocus" on-blur="_onBlur" continue$="[[item.continue]]">
									<div>
										<span>[[item.title]]</span>
										<span hidden$="[[!item.continue]]">[[localize('continue')]]</span>
										<d2l-icon hidden$="[[!item.isCompleted]]" aria-label$="[[localize('completed')]]" icon="tier1:check"></d2l-icon>
									</div>
								</a>
							</li>
						</template>
					</ol>
				</iron-collapse>
				<a class="d2l-sequences-module-list-collapse-title" href="javascript:void(0)" id="trigger" on-click="toggle" aria-controls="collapse" role="button" on-focus="_onFocus" on-blur="_onBlur">
					<d2l-icon class="d2l-sequences-module-list-vertical-flip" icon="[[_toggle(opened, collapseIcon, expandIcon)]]"></d2l-icon>
					<span>[[_collapseTitle(_modules, opened)]]</span>
				</a>
			<div>
			</template>
		`;
  }

  static get properties() {
    return {
      opened: {
        type: Boolean,
        value: false,
        notify: true,
        reflectToAttribute: true
      },
      expandIcon: {
        type: String,
        value: 'tier1:arrow-expand'
      },
      collapseIcon: {
        type: String,
        value: 'tier1:arrow-collapse'
      },
      _modules: {
        type: Array,
        value: function () {
          return [];
        }
      }
    };
  }

  static get observers() {
    return ['_onSequenceRootChange(_entity)'];
  }

  constructor() {
    super();

    this._setEntityType(SequenceEntity);
  }

  open() {
    if (this.disabled) {
      return;
    }

    this.opened = true;
  }

  _focusFirst() {
    var item = this._tryGetFirstFocusable();

    if (item) {
      item.focus();
    }
  }

  _tryGetFirstFocusable() {
    return this.shadowRoot.querySelector('ol > li > a');
  }

  close() {
    if (this.disabled) {
      return;
    }

    this.opened = false;
  }

  toggle(e) {
    if (this.disabled) {
      return;
    }

    if (this.opened) {
      this.close();
    } else {
      this.open();

      if (e.screenX === 0 && e.screenY === 0) {
        this._focusFirst();
      }
    }
  }

  _toggle(cond, t, f) {
    return cond ? t : f;
  }

  _onSequenceRootChange(sequenceRoot) {
    const modulesBySequence = [];
    sequenceRoot.onSubSequencesChange(subSequence => {
      const completion = subSequence.completion();
      const isCompleted = completion && completion.isCompleted;
      modulesBySequence[subSequence.index()] = {
        title: subSequence.title(),
        href: subSequence.sequenceViewerApplicationHref(),
        isCompleted
      };
      let foundCountinue = false;
      this._modules = modulesBySequence.filter(element => typeof element !== 'undefined').map(subSequence => {
        subSequence.continue = false;

        if (!foundCountinue && !subSequence.isCompleted) {
          subSequence.continue = true;
          foundCountinue = true;
        }

        return subSequence;
      });
    });
  }

  _collapseTitle(modules, opened) {
    const showOrHide = !opened ? 'showModules' : 'hideModules';
    return this.localize(showOrHide, 'numberOfModules', modules.length);
  }

  _hasModules(modules) {
    return !!modules.length;
  }

  _onFocus(e) {
    e.srcElement && e.srcElement.setAttribute && e.srcElement.setAttribute('focus', 'focus');
  }

  _onBlur(e) {
    e.srcElement && e.srcElement.setAttribute && e.srcElement.removeAttribute('focus', 'focus');
  }

}

window.customElements.define('d2l-sequences-module-list', D2lSequenceModuleList);