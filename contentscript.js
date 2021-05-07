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
	course.electiveType.toLowerCase() !== 'additional activity';

const parseCourseNode = node => ({
	name: getColumnText(node, 2),
	credits: parseFloat(getColumnText(node, 3)),
	electiveType: getColumnText(node, 5),
	grade: getColumnText(node, 8),
});

let courseGrade = {};
const fillCourseGradesMap = courses => courses.forEach(
	course => courseGrade[course.name] ?? (courseGrade[course.name] = course.grade)
); // Store latest grades for each course

const parseCourses = (semesters) => {
	const sems = [];
	semesters.forEach(semester => {
		const courses = parseSemesterNode(semester);
		fillCourseGradesMap(courses); // Store final(latest) grade for each course
		sems.push(courses);
	});
	sems.reverse();
	return sems;
}

const sanitizeCourses = (sems) => {
	let coursesSeen = new Set();
	let sems2 = [];
	sems.forEach(courses => {
		const sanitizedCourses = courses
			.map(course => coursesSeen.has(course.name) ? {} :
				(coursesSeen.add(course.name) && { ...course, grade: courseGrade[course.name] })
			) // Replace 
			.filter(course => !!course.name);
		sems2.push(sanitizedCourses);
	});
	return sems2;
}

const parseSemesterNode = node =>
	[
		...node.querySelectorAll(
			'.hierarchyLi.dataLi.tab_body_bg:not(.hierarchyHdr)',
		),
	]
		.map(parseCourseNode)
		.filter(isGraded);

function calculateCGPA() {
	const semesters = document.querySelectorAll('.subCnt'),
		sgpas = [];
	let totalCredit = 0,
		totalPoints = 0;

	courseGrade = {};
	const sems = parseCourses(semesters);
	console.log(courseGrade); // Must be populated by now
	const data = sanitizeCourses(sems);
	console.log(data); // This data will be used for calcuations
	data.forEach(courses => {
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
