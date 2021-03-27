const gradesPageRule = {
	conditions: [
		new browser.declarativeContent.PageStateMatcher({
			pageUrl: {
				hostEquals: 'aimsportal.iitbhilai.ac.in',
				pathEquals: '/iitbhAims/courseReg/myCrsHistoryPage',
			},
		}),
	],
	actions: [new browser.declarativeContent.ShowPageAction()],
};

browser.runtime.onInstalled.addListener(function () {
	browser.declarativeContent.onPageChanged.removeRules(undefined, function () {
		browser.declarativeContent.onPageChanged.addRules([gradesPageRule]);
	});
});
