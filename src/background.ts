export class Background {
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
	}
}

new Background();
