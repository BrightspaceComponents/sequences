import '../mixins/d2l-sequences-router-mixin.js';
import { D2LSequencesContentEoLMain } from './d2l-sequences-content-eol-main.js';
import './d2l-sequences-content-file-download.js';
import { D2LSequencesContentFileHtml } from './d2l-sequences-content-file-html.js';
import { D2LSequencesContentFilePdf } from './d2l-sequences-content-file-pdf.js';
import { D2LSequencesContentVideo } from './d2l-sequences-content-video';
import { D2LSequencesContentAudio } from './d2l-sequences-content-audio';
import { D2LSequencesContentImage } from './d2l-sequences-content-image';
import './d2l-sequences-content-file-html.js';
import { D2LSequencesContentLinkMixed } from './d2l-sequences-content-link-mixed.js';
import { D2LSequencesContentLinkNewTab } from './d2l-sequences-content-link-new-tab';
import { D2LSequencesContentLinkScorm } from './d2l-sequences-content-link-scorm.js';
import { D2LSequencesContentLinkOnedrive } from './d2l-sequences-content-link-onedrive.js';
import { D2LSequencesContentLinkGoogledrive } from './d2l-sequences-content-link-googledrive.js';
import { D2LSequencesContentLink } from './d2l-sequences-content-link.js';
import { D2LSequencesContentUnknown } from './d2l-sequences-content-unknown.js';
import { D2LSequencesContentFileProcessing } from './d2l-sequences-content-file-processing';
import { D2LSequencesContentModule } from './d2l-sequences-content-module.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { D2LSequencesContentContentServiceLink } from './d2l-sequences-content-content-service-link.js';
import { D2LSequencesContentFileDownload } from './d2l-sequences-content-file-download';

class D2LSequencesContentRouter extends D2L.Polymer.Mixins.Sequences.RouterMixin(getEntityType) {
	static get template() {
		return html``;
	}

	static get is() {
		return 'd2l-sequences-content-router';
	}
	static get fileActivity() {
		return 'file-activity';
	}
	static get fileUnknown() {
		return D2LSequencesContentFileDownload.is;
	}
	static get fileProcessing() {
		return D2LSequencesContentFileProcessing.is;
	}
	static get linkActivity() {
		return 'link-activity';
	}
	static get mimeType() {
		return new Map([
			['application/pdf', D2LSequencesContentFilePdf.is],
			['video/mp4', D2LSequencesContentVideo.is],
			['video/ogg', D2LSequencesContentVideo.is],
			['video/webm', D2LSequencesContentVideo.is],
			['audio/webm', D2LSequencesContentVideo.is],
			['audio/flac', D2LSequencesContentAudio.is],
			['audio/mp3', D2LSequencesContentAudio.is],
			['audio/ogg', D2LSequencesContentAudio.is],
			['audio/aac', D2LSequencesContentAudio.is],
			['audio/wave', D2LSequencesContentAudio.is],
			['image/bmp', D2LSequencesContentImage.is],
			['image/gif', D2LSequencesContentImage.is],
			['image/jpeg', D2LSequencesContentImage.is],
			['image/png', D2LSequencesContentImage.is],
			['image/svg+xml', D2LSequencesContentImage.is],
			['text/html', D2LSequencesContentFileHtml.is]
		]);
	}
}
customElements.define(D2LSequencesContentRouter.is, D2LSequencesContentRouter);

function getEntityType(entity) {
	if (!entity || !entity.entities) {
		return D2LSequencesContentUnknown.is;
	}

	if (entity.class.includes(D2LSequencesContentEoLMain.eolClass)) {
		return D2LSequencesContentEoLMain.is;
	}

	if (entity.class.includes(D2LSequencesContentModule.contentModuleClass)) {
		return D2LSequencesContentModule.is;
	}

	for (let i = 0; i < entity.entities.length; i++) {
		const subEntity = entity.entities[i];
		// hypermedia classes tend to be more specific at the end of the array
		for (let j = subEntity.class.length - 1; j >= 0; --j) {
			switch (subEntity.class[j]) {
				case D2LSequencesContentLinkOnedrive.contentClass:
					return D2LSequencesContentLinkOnedrive.is;
				case D2LSequencesContentLinkGoogledrive.contentClass:
					return D2LSequencesContentLinkGoogledrive.is;
				case D2LSequencesContentRouter.fileActivity:
					return getFileEntityType(subEntity);
				case D2LSequencesContentRouter.linkActivity:
					return getLinkEntityType(subEntity);
				case D2LSequencesContentLinkScorm.contentClass:
					return subEntity.hasClass('open-in-new-tab') ? D2LSequencesContentLinkScorm.is : D2LSequencesContentContentServiceLink.is;
				case 'link-scorm-2004':
					return D2LSequencesContentLinkScorm.is;
				case 'link-scorm-1-2':
					return D2LSequencesContentLinkScorm.is;
			}
		}
	}
	return D2LSequencesContentUnknown.is;
}

function getFileEntityType(fileActivity) {
	const file = fileActivity.getSubEntityByClass('file');
	let mimeType = file && file.properties && file.properties.type;

	// eslint-disable-next-line no-console
	console.log('getFileEntityType()');

	// A converted doc will either be present, or processing
	if (fileActivity.getSubEntityByClass('processing')) {
		return D2LSequencesContentRouter.fileProcessing;
	} else if (file.getLinkByClass('d2l-converted-doc')) {
		mimeType = file.getLinkByClass('d2l-converted-doc').type;
	}

	return D2LSequencesContentRouter.mimeType.get(mimeType) || D2LSequencesContentRouter.fileUnknown;
}

function getLinkEntityType(linkActivity) {
	const link = linkActivity.getLinkByRel('about');
	const embedLink = linkActivity.getLinkByClass('embed');
	const openInNewTab = linkActivity.hasClass('open-in-new-tab');
	const isLorPdf = link.hasClass('adapted-lor-pdf');
	if (link && isLorPdf) {
		return D2LSequencesContentFilePdf.is;
	} else if (
		(link && link.href.startsWith(window.location.protocol)) ||
		(embedLink && embedLink.href.startsWith(window.location.protocol))
	) {
		return openInNewTab ? D2LSequencesContentLinkNewTab.is : D2LSequencesContentLink.is;
	} else {
		return D2LSequencesContentLinkMixed.is;
	}
}

