const courseRowSelector = '.hierarchyLi.dataLi.tab_body_bg:not(.hierarchyHdr)';
const gradePointMap = {
	'A+': 10,
	'A': 10,
	'A-': 9,
	B: 8,
	'B-': 7,
	C: 6,
	'C-': 5,
	D: 4,
	FS: 0,
	FR: 0,
	F: 0,
	I: 0,
	' ': 0,
	'':0
};
var gradeArray=[];
const round = n => Math.round(n * 100) / 100;

const getColumnText = (node, column) =>
	node.querySelector(`.col${column}`).textContent.trim();

const isGraded = course =>
	course.electiveType.toLowerCase() !== 'additional activity' &&
	!course.code.startsWith('AA') &&
	!course.code.startsWith('EP');

const parseCourse = node => ({
	code: getColumnText(node, 1),
	credits: parseFloat(getColumnText(node, 3)),
	electiveType: getColumnText(node, 5),
	grade: getColumnText(node, 8),
	courseName: getColumnText(node, 2),
	courseDate: getColumnText(node, 9)
});

const parseSemester = semNode =>
	[...semNode.querySelectorAll(courseRowSelector)]
		.map(parseCourse)
		.filter(isGraded);

const parseSemesterList = semesterNodes =>
	semesterNodes.map(parseSemester).reverse();

const sanitizeSemesters = semesters => {
	let courseGrades = {};
	let coursesSeen = new Set();

	const storeFinalGrades = semester =>
		semester.forEach(course => {if(course.courseName!=="THESIS"){courseGrades[course.code] = course.grade}else{
			courseGrades[course.code+course.courseDate] = course.grade;
		}});

	semesters.forEach(storeFinalGrades);

	const mutateCoursesWithImprovements = (course) =>{
		if(course.courseName!=="THESIS"){
		return coursesSeen.has(course.code)
			? {}
			: coursesSeen.add(course.code) && {
					...course,
					grade: courseGrades[course.code],
			  }} else return course; }; // Update the grades of first attempt for a course and empty the 'improvement' attempts

	const sanitizeSemester = semester => {
		return semester
			.map(mutateCoursesWithImprovements)
			.filter(course => !!course.code);
	};

	return semesters.map(sanitizeSemester).reverse();
};

function calculateCGPA() {
	const semesterNodes = [...document.querySelectorAll('.subCnt')],
		sgpas = [];
	let totalCredit = 0,
		totalPoints = 0;

	courseGrades = {};
	const semesters = sanitizeSemesters(parseSemesterList(semesterNodes));

	// Print processed data for programmers to inspect
	console.log(semesters);

	semesters.forEach(semester => {
		const isComplete = semester.every(course => course.grade),
			semesterCredit = semester.reduce(
				(sum, course) => sum + (course.grade ? course.credits : 0),
				0,
			);
		let semesterPoints=0;	
		for(var i=0; i<semester.length; i++){
			if(semester[i].courseName==="THESIS"){
				gradeArray= semester[i].grade.split(' ');
				var thesisSum= gradeArray.reduce((sum,grade)=>sum+gradePointMap[grade]*6,0);
				semesterPoints+=thesisSum;
			}else{
				semesterPoints+=gradePointMap[semester[i].grade]*semester[i].credits;
			}
		}
		if (isComplete) {
			totalCredit += semesterCredit;
			totalPoints += semesterPoints;
		}
		sgpa = round(semesterPoints / semesterCredit);
		sgpas.unshift(sgpa);
	});
	const cgpa = round(totalPoints / totalCredit);

	const response = { cgpa, sgpas };
	console.log(response);
	return response;
}

browser.runtime.onMessage.addListener(async request => {
	if (request === 'grade-data') return calculateCGPA();
});
console.log(gradeArray);