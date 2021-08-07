export class Background {
	tabStorage = {};

	constructor() {
		chrome.commands.onCommand.addListener((command) => {
			console.log(`Command: ${command}`);
			if (command === 'bookmark') {
				chrome.tabs
					.query({
						// lastFocusedWindow: true,
						active: true,
						currentWindow: true,
					})
					.then((tabs) => {
						let [tab, ...rest] = tabs;
						console.log(tab);
						console.log(tab.url);
						console.log(tab.title);
					});
			}
		});

		const networkFilters = {
			urls: ['https://www.youtube.com/youtubei/v1/live_chat/get_live_chat*'],
		};
		chrome.webRequest.onBeforeRequest.addListener((details) => {
			const { tabId, requestId, url } = details;
			if (!this.tabStorage.hasOwnProperty(tabId)) {
				return;
			}

			this.tabStorage[tabId].requests[requestId] = {
				requestId,
				url,
				startTime: details.timeStamp,
				status: 'pending',
			};
		}, networkFilters);

		chrome.webRequest.onCompleted.addListener((details) => {
			console.log(details);
		}, networkFilters);
	}
}

new Background();
