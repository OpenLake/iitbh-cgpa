function calculateCGPA() {
	let gradeNodes = document.querySelectorAll('span.col8.col[style="width:69px"');
	let creditNodes = document.querySelectorAll('span.col3.col[style="margin-left: 9px;"]');

	let grades = []; //albhabet grades
	let gradePoints = [];
	let credits = [];

	const gradePointMap = {
		'A+': 10,
		A: 10,
		'A-': 9,
		B: 8,
		'B-': 7,
		C: 6,
		'C-': 5,
		D: 4,
		FS: 0,
		FR: 0,
		I: 0,
		Satisfactory: 0,
		S: 0
	};

	gradeNodes.forEach(node => {
		grades.push(node.textContent.trim());
		gradePoints.push(gradePointMap[node.textContent.trim()]);
	});

	creditNodes.forEach(node => {
		credits.push(parseFloat(node.textContent.trim()));
	});

	let cgpa = 0;
	let creditSum = 0;

	gradePoints.forEach((gradePoint, i) => {
		cgpa += gradePoint * credits[i];
		if (grades[i].toLowerCase() !== 'satisfactory') {
			creditSum += credits[i];
		}
	});

	cgpa /= creditSum;

	return cgpa;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request === 'cgpa') {
		sendResponse({ cgpa: calculateCGPA() });
	}
});
