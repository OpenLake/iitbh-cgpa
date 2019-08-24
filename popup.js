chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
	chrome.tabs.executeScript(
		tabs[0].id,
		{
			file: 'contentscript.js'
		},
		function() {
			chrome.tabs.sendMessage(tabs[0].id, 'grade-data', function(response) {
				if (response) {
					let displayElement = document.querySelector('#cgpas');
					displayElement.innerHTML =
						`CGPA: ${response.cgpa}<br>` +
						response.sgpas.reduce(
							(result, num, index) => `${result}Sem ${index + 1}: ${num}<br>`,
							''
						);
					console.log(response);
				} else {
					document.getElementById('cgpas').textContent = 'Some error occured';
				}
			});
		}
	);
});
