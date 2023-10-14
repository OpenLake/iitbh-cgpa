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
	courseType[0]=["IC",60];
	courseType[1]=["PC",60];
	courseType[2]=["DE",60];
	courseType[3]=["OE",30];
	courseType[4]=["CALA",30];
	
	credsDisplayElement.innerHTML=`Enrolled Credits<br>`+response.credsTypeCompleted.map((creds,index)=>`${courseType[index][0]}:${creds}/${courseType[index][1]}`).join('<br>');
}
