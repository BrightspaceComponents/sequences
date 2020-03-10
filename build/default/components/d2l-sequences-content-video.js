import '../mixins/d2l-sequences-automatic-completion-tracking-mixin.js';
import { html } from "../node_modules/@polymer/polymer/lib/utils/html-tag.js";
import "../node_modules/@d2l/video/d2l-video.js";
export class D2LSequencesContentVideo extends D2L.Polymer.Mixins.Sequences.AutomaticCompletionTrackingMixin() {
  static get template() {
    return html`
		<style>
			d2l-video {
				width: 100%;
				height: calc(100% - 12px);
				overflow: hidden;
			}
		</style>
		<d2l-video src="[[_fileLocation]]" auto-load=""></d2l-video>
`;
  }

  static get is() {
    return 'd2l-sequences-content-video';
  }

  static get properties() {
    return {
      href: {
        type: String,
        reflectToAttribute: true,
        notify: true,
        observer: '_scrollToTop'
      },
      _fileLocation: {
        type: String,
        computed: '_getFileLocation(entity)'
      },
      title: {
        type: String,
        computed: '_getTitle(entity)'
      }
    };
  }

  _scrollToTop() {
    window.top.scrollTo(0, 0);
  }

  _getFileLocation(entity) {
    try {
      const fileActivity = entity.getSubEntityByClass('file-activity');
      const file = fileActivity.getSubEntityByClass('file');
      const link = file.getLinkByClass('pdf') || file.getLinkByClass('embed') || file.getLinkByRel('alternate');
      return link.href;
    } catch (e) {
      return '';
    }
  }

  _getTitle(entity) {
    return entity && entity.properties && entity.properties.title || '';
  }

}
customElements.define(D2LSequencesContentVideo.is, D2LSequencesContentVideo);