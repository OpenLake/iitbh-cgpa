function calculateCGPA() {
	let sem = document.querySelectorAll('.subCnt');
	let result = {
		cgpa: 0,
		sgpas: [],
	};
	let totalCredit = 0;

	sem.forEach(semester => {
		let gradeNodes = semester.querySelectorAll('span.col8.col[style="width:69px"');
		let creditNodes = semester.querySelectorAll('span.col3.col[style="margin-left: 9px;"]');

		let grades = []; //albhabet grades
		let gradePoints = [];
		let credits = [];
		let semesterCredit = 0;
		let sgpa = 0;

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
			S: 0,
			'S S': 0,
			'': 0,
		};

		gradeNodes.forEach(node => {
			grades.push(node.textContent.trim());
			gradePoints.push(gradePointMap[node.textContent.trim()] || 0);
		});

		creditNodes.forEach(node => {
			credits.push(parseFloat(node.textContent.trim()));
		});

		gradePoints.forEach((gradePoint, i) => {
			result.cgpa += gradePoint * credits[i];
			sgpa += gradePoint * credits[i];
			if (!['satisfactory', '', 's', 's s', 's s s s'].includes(grades[i].toLowerCase())) {
				totalCredit += credits[i];
				semesterCredit += credits[i];
			}
		});
		sgpa /= semesterCredit;
		result.sgpas.unshift(sgpa ? Math.round(sgpa * 100) / 100 : 0);
	});
	result.cgpa = Math.round((result.cgpa / totalCredit) * 100) / 100;

	return result;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request === 'grade-data') {
		sendResponse(calculateCGPA());
	}
});
