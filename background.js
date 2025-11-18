const FOLDER_NAME = "fzf-bookmarks"; // Must match popup.js

// Get or create the bookmark folder
async function getOrCreateFolder() {
	const bookmarks = await chrome.bookmarks.getTree();

	function findFolder(nodes) {
		for (let node of nodes) {
			if (node.title === FOLDER_NAME && !node.url) {
				return node.id;
			}
			if (node.children) {
				const found = findFolder(node.children);
				if (found) return found;
			}
		}
		return null;
	}

	let id = findFolder(bookmarks);

	if (!id) {
		const folder = await chrome.bookmarks.create({
			title: FOLDER_NAME
		});
		id = folder.id;
	}

	return id;
}

// Handle keyboard shortcut command
chrome.commands.onCommand.addListener(async (command) => {
	if (command === "add-current-tab") {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		const folderId = await getOrCreateFolder();

		await chrome.bookmarks.create({
			parentId: folderId,
			title: tab.title,
			url: tab.url
		});
	}
});
