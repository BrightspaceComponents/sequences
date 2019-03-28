import '@polymer/polymer/polymer-legacy.js';
import 'd2l-localize-behavior/d2l-localize-behavior.js';

/* eslint-disable */
window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};
window.D2L.PolymerBehaviors.Sequences = window.D2L.PolymerBehaviors.Sequences || {};

/**
 * THIS FILE IS GENERATED. RUN `npm run build:lang` TO REGENERATE.
 * Localizes the sequences component.
 * @polymerBehavior D2L.PolymerBehaviors.Sequences.LocalizeBehavior
 */
D2L.PolymerBehaviors.Sequences.LocalizeBehaviorImpl = {
	properties: {
		/**
		 * Localization resources.
		 */
		resources: {
			value: function() {
				return {"ar":{},"de":{},"en":{"activitiesFinishedGreatJob":"You have completed all of the activities in this unit. Great job!","cannotBeRendered":"This content item cannot be rendered.","congratulations":"Congratulations!","download":"Download","downloadInvalidFile":"Download and view the file in another application instead.","fileSize":"File size: {size}","goToActivity":"Go to Activity","gotoOnedrive":"Go to OneDrive","hideModules":"Hide {numberOfModules} Modules","imDone":"I'm Done","invalidFile":"This kind of file can't be opened in this viewer","iterateToNext":"Next activity","iterateToParent":"Go to parent activity","iterateToPrevious":"Previous activity","missedActivities":"You <d2l-link href=\"javascript:void(0)\">missed {count, plural, one {# activity} other {# activities}}</d2l-link>.","module":"Module","niceWork":"Nice work so far!","noNeedToFinish":"If you don't need to finish {count, plural, one {it} other {them}}, no problem.","openNew":"Open in a new window","openOnedriveFile":"Open OneDrive file in a new browser tab.","openUnsecureContent":"Your browser thinks this content is published in a less secure location. Don't worry, just open the content in a new window.","showMissed":"Show Me What I Missed","showModules":"Show {numberOfModules} Modules","undisplayableContent":"This content can't be displayed in this viewer","viewThisActivity":"View this Activity.","youMissedThese":"You missed these activities:"},"es":{},"fr":{},"ja":{},"ko":{},"nb":{},"nl":{},"pt":{},"sv":{},"tr":{},"zh-TW":{},"zh":{}};
			}
		}
	}
};

/** @polymerBehavior D2L.PolymerBehaviors.Sequences.LocalizeBehavior */
D2L.PolymerBehaviors.Sequences.LocalizeBehavior = [
	D2L.PolymerBehaviors.LocalizeBehavior,
	D2L.PolymerBehaviors.Sequences.LocalizeBehaviorImpl
];
