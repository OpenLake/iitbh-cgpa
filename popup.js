chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
	chrome.tabs.sendMessage(tabs[0].id, 'cgpa', function(response) {
		document.getElementById('cgpa').textContent = `CGPA: ${response.cgpa}`;
	});
	chrome.tabs.executeScript(tabs[0].id, {
		file: 'contentscript.js'
	});
});
