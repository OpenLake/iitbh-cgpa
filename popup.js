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
			.map((sgpa, index) => `Sem ${index + 1}: ${sgpa}`)
			.join('<br>');

	const credsDisplayElement=document.querySelector('.creditsComp');
	var courseType=new Array(5);
	courseType[0]="IC";
	courseType[1]="PC";
	courseType[2]="DE";
	courseType[3]="OE";
	courseType[4]="CALA";

	credsDisplayElement.innerHTML=response.credsTypeCompleted.map((creds,index)=>`${courseType[index]}:${creds}`).join('<br>');
}
