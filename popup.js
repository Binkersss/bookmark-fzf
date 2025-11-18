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

	filtered.forEach((bookmark, index) => {
		const div = document.createElement("div");
		div.className = "item";
		div.tabIndex = 0; // Make it focusable
		div.dataset.bookmarkId = bookmark.id;
		div.dataset.bookmarkUrl = bookmark.url;

		div.style.width = "750px";

		const link = document.createElement("a");
		link.href = "#";
		link.textContent = bookmark.title;
		link.onclick = (e) => {
			e.preventDefault();
			chrome.tabs.create({ url: bookmark.url });
		};

		link.style.width = "700px";
		link.style.whiteSpace = "nowrap";
		link.style.overflow = "hidden";
		link.style.textOverflow = "ellipsis";
		link.style.display = "inline-block";

		const deleteBtn = document.createElement("button");
		deleteBtn.textContent = "X";
		deleteBtn.onclick = async () => {
			await chrome.bookmarks.remove(bookmark.id);
			displayBookmarks(query);
		};

		div.appendChild(link);
		div.appendChild(deleteBtn);
		results.appendChild(div);

		// Focus first item initially
		if (index === 0) {
			div.focus();
		}
	});

}

function setupKeyboardNavigation(query) {
	const results = document.getElementById("results");

	results.addEventListener("keydown", async (e) => {
		const items = Array.from(results.querySelectorAll(".item"));
		const currentIndex = items.indexOf(document.activeElement);

		if (e.key === "ArrowDown") {
			e.preventDefault();
			const nextIndex = Math.min(currentIndex + 1, items.length - 1);
			items[nextIndex]?.focus();
		}
		else if (e.key === "ArrowUp") {
			e.preventDefault();
			const prevIndex = Math.max(currentIndex - 1, 0);
			items[prevIndex]?.focus();
		}
		else if (e.key === "Enter") {
			e.preventDefault();
			const activeItem = document.activeElement;
			const url = activeItem.dataset.bookmarkUrl;
			if (url) {
				chrome.tabs.create({ url });
			}
		}
		else if (e.key === "d" && e.altKey) {
			e.preventDefault();
			const activeItem = document.activeElement;
			const bookmarkId = activeItem.dataset.bookmarkId;
			if (bookmarkId) {
				await chrome.bookmarks.remove(bookmarkId);
				displayBookmarks(query);
			}
		}
	});
}


function setupKeyboardNavigation(query) {
	const results = document.getElementById("results");
	const search = document.getElementById("search");

	results.addEventListener("keydown", async (e) => {
		const items = Array.from(results.querySelectorAll(".item"));
		const currentIndex = items.indexOf(document.activeElement);

		if (e.key === "ArrowDown") {
			e.preventDefault();
			const nextIndex = Math.min(currentIndex + 1, items.length - 1);
			items[nextIndex]?.focus();
		}
		else if (e.key === "ArrowUp") {
			e.preventDefault();
			const prevIndex = Math.max(currentIndex - 1, 0);
			items[prevIndex]?.focus();
		}
		else if (e.key === "Enter") {
			e.preventDefault();
			const activeItem = document.activeElement;
			const url = activeItem.dataset.bookmarkUrl;
			if (url) {
				chrome.tabs.create({ url });
			}
		}
		else if (e.key === "d" && e.altKey) {
			e.preventDefault();
			const activeItem = document.activeElement;
			const bookmarkId = activeItem.dataset.bookmarkId;
			if (bookmarkId) {
				await chrome.bookmarks.remove(bookmarkId);
				displayBookmarks(query);
			}
		}
		else {
			search.focus();
		}
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

	setupKeyboardNavigation();
})();
