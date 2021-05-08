const gradePointMap = {
	'A+': 10,
	'A': 10,
	'A-': 9,
	'B': 8,
	'B-': 7,
	'C': 6,
	'C-': 5,
	'D': 4,
	'FS': 0,
	'FR': 0,
	'I': 0,
	'': 0,
};

const round = n => Math.round(n * 100) / 100;

const getColumnText = (node, column) =>
	node.querySelector(`.col${column}`).textContent.trim();

const isGraded = course =>
	course.electiveType.toLowerCase() !== 'additional activity';

const asCourseObject = node => ({
	name: getColumnText(node, 2),
	credits: parseFloat(getColumnText(node, 3)),
	electiveType: getColumnText(node, 5),
	grade: getColumnText(node, 8),
});

let courseGrades = {};
let coursesSeen = new Set();
const storeFinalGrades = semester => (
	semester.forEach(course => courseGrades[course.name] = course.grade)
);


const parseSemestersFromDOM = (semesterNodes) => {
	const reversedSemesters = semesterNodes.map(parseSemesterCourseObjects).reverse();

	// Store latest(reversed the array to ensure this) grades for each course and return the semester array as it is
	reversedSemesters.forEach(storeFinalGrades);

	// Print courseGrades for other programmers to inspect 
	console.log(courseGrades);

	return reversedSemesters;
}

const mutateCoursesWithImprovements = (course) => (
	coursesSeen.has(course.name) ? {} :
		(coursesSeen.add(course.name) && { ...course, grade: courseGrades[course.name] })
); // Update the grades of first attempt for a course and empty the 'improvement' attempts

const sanitizeSemester = semester => {
	return semester.map(mutateCoursesWithImprovements).filter(course => !!course.name);
}

const sanitizeSemesters = (semesters) => {
	coursesSeen = new Set();
	return semesters.map(sanitizeSemester).reverse();
}

const parseSemesterCourseObjects = semNode =>
	[
		...semNode.querySelectorAll(
			'.hierarchyLi.dataLi.tab_body_bg:not(.hierarchyHdr)',
		),
	]
		.map(asCourseObject)
		.filter(isGraded);

function calculateCGPA() {
	const semesterNodes = Array.from(document.querySelectorAll('.subCnt')),
		sgpas = [];
	let totalCredit = 0,
		totalPoints = 0;

	courseGrades = {};
	const semesters = sanitizeSemesters(
		parseSemestersFromDOM(semesterNodes)
	);

	// Print processed data for programmers to inspect
	console.log(semesters);

	semesters.forEach(semester => {
		isComplete = semester.every(course => course.grade),
			semesterCredit = semester.reduce(
				(sum, course) => sum + (course.grade ? course.credits : 0),
				0,
			),
			semesterPoints = semester.reduce(
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
	sgpas.reverse();
	const cgpa = round(totalPoints / totalCredit);
	return { cgpa, sgpas };
}

browser.runtime.onMessage.addListener(async request => {
	if (request === 'grade-data') return calculateCGPA();
});
