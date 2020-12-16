class HypermediaHelper {
	static get linkContentClass() {
		return 'link-activity';
	}
	static get fileContentClass() {
		return 'file-activity';
	}

	static get captionClass() {
		return 'caption';
	}

	static getLinkLocation(entity) {
		try {
			const linkActivity = entity.getSubEntityByClass(HypermediaHelper.linkContentClass);

			// if embed link exists, use that link
			const embedASVLink = linkActivity.getLinkByClass('embed-asv');
			if (embedASVLink !== undefined) {
				return embedASVLink.href;
			}

			const embedLink = linkActivity.getLinkByClass('embed');
			if (embedLink !== undefined) {
				return embedLink.href;
			}

			const link = linkActivity.getLinkByRel('about');
			return link.href;
		} catch (e) {
			return '';
		}
	}

	static getFileLocation(entity) {
		try {
			const fileActivity = entity.getSubEntityByClass(HypermediaHelper.fileContentClass);
			const file = fileActivity.getSubEntityByClass('file');
			const link = file.getLinkByClass('pdf') || file.getLinkByClass('embed') || file.getLinkByRel('alternate');
			return link.href;
		} catch (e) {
			return HypermediaHelper.getLinkLocation(entity);
		}
	}

	static getFileCaptions(entity) {
		try {
			const languageCodes = {
				af:'Afrikaans',
				sq:'Albanian',
				ar:'Arabic',
				be:'Belarusian',
				bg:'Bulgarian',
				ca:'Catalan',
				zh:'Chinese',
				'zh-cn':'Chinese Simplified',
				'zh-tw':'Chinese Traditional',
				hr:'Croatian',
				cs:'Czech',
				da:'Danish',
				nl:'Dutch',
				en:'English',
				et:'Estonian',
				fi:'Finnish',
				fr:'French',
				gl:'Galician',
				de:'German',
				el:'Greek',
				ht:'Haitian Creole',
				iw:'Hebrew',
				hi:'Hindi',
				hu:'Hungarian',
				is:'Icelandic',
				id:'Indonesian',
				ga:'Irish',
				it:'Italian',
				ja:'Japanese',
				ko:'Korean',
				lv:'Latvian',
				lt:'Lithuanian',
				mk:'Macedonian',
				ms:'Malay',
				mt:'Maltese',
				no:'Norwegian',
				fa:'Persian',
				pl:'Polish',
				pt:'Portuguese',
				ro:'Romanian',
				ru:'Russian',
				sr:'Serbian',
				sk:'Slovak',
				sl:'Slovenian',
				es:'Spanish',
				sw:'Swahili',
				sv:'Swedish',
				tl:'Tagalog',
				th:'Thai',
				tr:'Turkish',
				uk:'Ukrainian',
				vi:'Vietnamese',
				cy:'Welsh',
				yi:'Yiddish'
			};

			const captionLinks = entity.getLinksByClass(HypermediaHelper.captionClass);
			return captionLinks ? captionLinks.map(captionLink => {
				const lang = captionLink.class.filter(c => c !== HypermediaHelper.captionClass)[0];
				return {
					src: captionLink.href,
					lang,
					label: languageCodes[lang.toLowerCase()] || lang
				};
			}) : [];
		} catch (e) {
			return [];
		}
	}
}

export default HypermediaHelper;
