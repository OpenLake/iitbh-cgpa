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
	'': 0,
};

const round = n => Math.round(n * 100) / 100;

const getColumnText = (node, column) =>
	node.querySelector(`.col${column}`).textContent.trim();

const isGraded = course =>
	!['additional activity', 'thesis / candidacy'].includes(
		course.electiveType.toLowerCase(),
	);

const parseCourseNode = node => ({
	credits: parseFloat(getColumnText(node, 3)),
	electiveType: getColumnText(node, 5),
	grade: getColumnText(node, 8),
});

const parseSemesterNode = node =>
	[
		...node.querySelectorAll(
			'.hierarchyLi.dataLi.tab_body_bg:not(.hierarchyHdr)',
		),
	]
		.map(parseCourseNode)
		.filter(isGraded);

function calculateCGPA() {
	const sem = document.querySelectorAll('.subCnt'),
		sgpas = [];
	let totalCredit = 0,
		totalPoints = 0;

	sem.forEach(semester => {
		const courses = parseSemesterNode(semester),
			isComplete = courses.every(course => course.grade),
			semesterCredit = courses.reduce(
				(sum, course) => sum + (course.grade ? course.credits : 0),
				0,
			),
			semesterPoints = courses.reduce(
				(sum, course) => sum + gradePointMap[course.grade] * course.credits,
				0,
			),
			sgpa = round(semesterPoints / semesterCredit);

		if (isComplete) {
			totalCredit += semesterCredit;
			totalPoints += semesterPoints;
		}
		sgpas.unshift(sgpa);
	});

	const cgpa = round(totalPoints / totalCredit);
	return { cgpa, sgpas };
}

browser.runtime.onMessage.addListener(async request => {
	if (request === 'grade-data') return calculateCGPA();
});
