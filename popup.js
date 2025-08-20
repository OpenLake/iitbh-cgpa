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
	

	let creditsDisplay = `<br>Credits Summary<br>`;
	creditsDisplay += `<small>Format: Completed/Total Enrolled (Required)</small>`;
	creditsDisplay += `<br><small>+ indicates current semester credits (ongoing)</small><br><br>`;
	creditsDisplay += response.credsTypeCompleted.map((completedCreds, index) => {
		const totalEnrolled = response.credsTypeTotal ? response.credsTypeTotal[index] : completedCreds;
		const currentSemesterCreds = totalEnrolled - completedCreds;
		const required = courseType[index][1];
		
		let line = `${courseType[index][0]}: ${completedCreds}`;
		if (currentSemesterCreds > 0) {
			line += `+${currentSemesterCreds}`;
		}
		line += `/${totalEnrolled} (Req: ${required})`;
		
		return line;
	}).join('<br>');
	

	const totalCompleted = response.credsTypeCompleted.reduce((sum, creds) => sum + creds, 0);
	const totalEnrolled = response.credsTypeTotal ? 
		response.credsTypeTotal.reduce((sum, creds) => sum + creds, 0) : totalCompleted;
	const totalCurrent = totalEnrolled - totalCompleted;
	const totalRequired = courseType.reduce((sum, type) => sum + type[1], 0);
	
	let overallLine = `<br><strong>Overall: ${totalCompleted}`;
	if (totalCurrent > 0) {
		overallLine += `+${totalCurrent}`;
	}
	overallLine += `/${totalEnrolled} (Req: ${totalRequired})</strong>`;
	
	creditsDisplay += overallLine;
	
	
	credsDisplayElement.innerHTML = creditsDisplay;
}
