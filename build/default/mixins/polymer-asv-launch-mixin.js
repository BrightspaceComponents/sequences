/*
	@polymerMixin
	@memberOf D2L.Polymer.Mixins;
*/
export function PolymerASVLaunchMixin(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        launchLink: {
          type: String,
          value: '',
          computed: '_getLaunchLink(entity)'
        }
      };
    }

    _getLaunchLink(entity) {
      const launchLink = entity && entity.getLinkByRel('https://sequences.api.brightspace.com/rels/sequence-viewer-application');
      return launchLink && launchLink.href || '';
    }

    _contentObjectClick() {
      const contentTopicClicked = new CustomEvent('d2l-content-topic-click', {
        bubbles: true,
        detail: {
          launchLink: this.launchLink
        }
      });
      window.dispatchEvent(contentTopicClicked);
    }

  };
}