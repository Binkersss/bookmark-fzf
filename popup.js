const FOLDER_NAME = "fzf-bookmarks"; // Change this to your desired folder name

let folderId = null;

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

// Display bookmarks
async function displayBookmarks(query = "") {
	const results = document.getElementById("results");
	results.innerHTML = "";

	if (!folderId) return;

	const children = await chrome.bookmarks.getChildren(folderId);

	const filtered = query
		? children.filter(b => fuzzyMatch(query, b.title))
		: children;

	filtered.forEach(bookmark => {
		const div = document.createElement("div");
		div.className = "item";

		const link = document.createElement("a");
		link.href = "#";
		link.textContent = bookmark.title;
		link.onclick = (e) => {
			e.preventDefault();
			chrome.tabs.create({ url: bookmark.url });
		};

		const deleteBtn = document.createElement("button");
		deleteBtn.textContent = "×";
		deleteBtn.onclick = async () => {
			await chrome.bookmarks.remove(bookmark.id);
			displayBookmarks(query);
		};

		div.appendChild(link);
		div.appendChild(deleteBtn);
		results.appendChild(div);
	});
}

// Add current tab to bookmarks
async function addCurrentTab() {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	if (!folderId) return;

	await chrome.bookmarks.create({
		parentId: folderId,
		title: tab.title,
		url: tab.url
	});

	displayBookmarks(document.getElementById("search").value);
}

// Initialize
(async () => {
	folderId = await getOrCreateFolder();
	displayBookmarks();

	document.getElementById("search").addEventListener("input", (e) => {
		displayBookmarks(e.target.value);
	});

	document.getElementById("add").addEventListener("click", addCurrentTab);
})();
