chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
	
	chrome.tabs.executeScript(tabs[0].id, {
		file: 'contentscript.js'
	},function()
	{
		chrome.tabs.sendMessage(tabs[0].id, 'cgpa', function(response) {
			if(response)
			document.getElementById('cgpa').textContent = `CGPA: ${response.cgpa}`;
			else{
				document.getElementById('cgpa').textContent = 'Some error occured';}
		});

	});
});
