function fuzzyMatch(query, text) {
	query = query.toLowerCase();
	text = text.toLowerCase();

	let qi = 0;
	for (let i = 0; i < text.length && qi < query.length; i++) {
		if (text[i] === query[qi]) qi++;
	}
	return qi === query.length;
}

