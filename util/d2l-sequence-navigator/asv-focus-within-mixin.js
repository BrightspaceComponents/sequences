/*
	@polymerMixin
	@memberOf D2L.Polymer.Mixins;
*/

export function ASVFocusWithinMixin(superClass) {
	return class extends superClass {
		static get properties() {
			return {
				focusWithin: {
					type: Boolean,
					notify: true
				}

			};
		}
		ready() {
			super.ready();
			this.addEventListener('focus', this._focusWithinOnFocus);
			this.addEventListener('blur', this._focusWithinOnBlur);
			this.addEventListener('defocus-parent', ()=>{ this.focusWithin = false; });
		}

		_focusWithinOnFocus(e) {
			e.stopPropagation(); //stop focus event from propagating up the parent components
			var event = new CustomEvent('defocus-parent', { bubbles: true, composed: true });
			this.dispatchEvent(event);
			this.focusWithin = true;
		}

		_focusWithinOnBlur(e) {
			e.stopPropagation(); //stop focus event from propagating up the parent components
			this.focusWithin = false;
		}

		_focusWithinClass(focusWithin) {
			return focusWithin ? ' d2l-asv-focus-within' : '';
		}

		_getTrueClass(focusWithin, isSelected) {
			return `${ isSelected ? 'd2l-asv-current' : ''} ${ focusWithin ? 'd2l-asv-focus-within' : ''}`;
		}

	};
}
