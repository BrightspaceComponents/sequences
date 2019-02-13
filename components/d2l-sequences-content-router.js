import '../mixins/d2l-sequences-router-mixin.js';
import { D2LSequencesContentEoLMain } from './d2l-sequences-content-eol-main.js';
import './d2l-sequences-content-file-download.js';
import { D2LSequencesContentFileHtml } from './d2l-sequences-content-file-html.js';
import './d2l-sequences-content-file-html.js';
import { D2LSequencesContentLinkMixed } from './d2l-sequences-content-link-mixed.js';
import { D2LSequencesContentLinkScorm } from './d2l-sequences-content-link-scorm.js';
import { D2LSequencesContentLinkOnedrive } from './d2l-sequences-content-link-onedrive.js';
import { D2LSequencesContentLink } from './d2l-sequences-content-link.js';
import { D2LSequencesContentUnknown } from './d2l-sequences-content-unknown.js';
import { D2LSequencesContentModule } from './d2l-sequences-content-module.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class D2LSequencesContentRouter extends D2L.Polymer.Mixins.Sequences.RouterMixin(getEntityType) {
	static get template() {
		return html`

`;
	}

	static get is() {
		return 'd2l-sequences-content-router';
	}
	static get fileActivity() {
		return 'file-activity';
	}
	static get fileUnknown() {
		return 'd2l-sequences-content-file-download';
	}
	static get linkActivity() {
		return 'link-activity';
	}
	static get mimeType() {
		return new Map([
			['application/pdf', D2LSequencesContentFileHtml.is],
			['image/bmp', D2LSequencesContentFileHtml.is],
			['image/gif', D2LSequencesContentFileHtml.is],
			['image/jpeg', D2LSequencesContentFileHtml.is],
			['image/png', D2LSequencesContentFileHtml.is],
			['image/svg+xml', D2LSequencesContentFileHtml.is],
			['text/html', D2LSequencesContentFileHtml.is],
			['application/vnd.openxmlformats-officedocument.wordprocessingml.document', D2LSequencesContentFileHtml.is]
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
				case D2LSequencesContentRouter.fileActivity:
					return getFileEntityType(subEntity);
				case D2LSequencesContentRouter.linkActivity:
					return getLinkEntityType(subEntity);
				case D2LSequencesContentLinkScorm.contentClass:
					return D2LSequencesContentLinkScorm.is;
			}
		}
	}
	return D2LSequencesContentUnknown.is;
}

function getFileEntityType(fileActivity) {
	const file = fileActivity.getSubEntityByClass('file');
	const mimeType = file && file.properties && file.properties.type;
	return D2LSequencesContentRouter.mimeType.get(mimeType) || D2LSequencesContentRouter.fileUnknown;
}

function getLinkEntityType(linkActivity) {
	const link = linkActivity.getLinkByRel('about');
	if (link && link.href.startsWith(window.location.protocol)) {
		return D2LSequencesContentLink.is;
	}
	return D2LSequencesContentLinkMixed.is;
}
