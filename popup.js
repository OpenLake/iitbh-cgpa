function onError(error) {
	console.error(error);
}

browser.tabs
	.query({
		currentWindow: true,
		active: true,
	})
	.then(sendMessageToTabs)
	.catch(onError);

function sendMessageToTabs(tabs) {
	browser.tabs.sendMessage(tabs[0].id, 'grade-data').then(render);
}

function render(response) {
	const displayElement = document.querySelector('#cgpas');

	if (!response) {
		displayElement.textContent = 'Something went wrong';
		return;
	}


	displayElement.innerHTML =
		`CGPA: ${response.cgpa}<br><br>SGPAs<br>` +
		response.sgpas
			.map((sgpa, index) => `Sem ${response.sgpas.length - index}: ${sgpa}`)
			.join('<br>');
}
