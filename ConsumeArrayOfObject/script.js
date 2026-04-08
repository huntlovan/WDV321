// JavaScript Document
/*
  This file will:

  - Create a Javascript array containing a list of javascript objects, with each record including another array
  - Convert the Javascript object into a JSON string
  - Store the JSON string into local storage

  Goal: Provide an example of how to create an array of javascript objects
  Goal: Provide an example of how to consume a JSON string in JS

  Use the following data for this:

    student_id = 332443
    student_gpa = 3.6
    student_courses = ["WDV101","WDV131","WDV105"]

    student_id = 545467
    student_gpa = 2.7
    student_courses = ["WDV101","WDV131","WDV105","WDV221","WDV205"]

    student_id = 128574
    student_gpa = 3.4
    student_courses = ["WDV101","WDV131","WDV105","WDV221","WDV205","WDV341"]

    student_id = 750056
    student_gpa = 1.85
    student_courses = ["WDV101","WDV131","WDV105","WDV221","WDV205"]
*/

const STORAGE_KEY = "studentsJSON";

const starterStudents = [
  {
    student_id: 332443,
    student_gpa: 3.6,
    student_courses: ["WDV101", "WDV131", "WDV105"]
  },
  {
    student_id: 545467,
    student_gpa: 2.7,
    student_courses: ["WDV101", "WDV131", "WDV105", "WDV221", "WDV205"]
  },
  {
    student_id: 128574,
    student_gpa: 3.4,
    student_courses: ["WDV101", "WDV131", "WDV105", "WDV221", "WDV205", "WDV341"]
  },
  {
    student_id: 750056,
    student_gpa: 1.85,
    student_courses: ["WDV101", "WDV131", "WDV105", "WDV221", "WDV205"]
  }
];

function saveStudents(students) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function getStudents() {
  const studentsJSON = localStorage.getItem(STORAGE_KEY);

  if (!studentsJSON) {
    saveStudents(starterStudents);
    return [...starterStudents];
  }

  try {
    const students = JSON.parse(studentsJSON);
    return Array.isArray(students) ? students : [];
  } catch (error) {
    saveStudents(starterStudents);
    return [...starterStudents];
  }
}

function renderStudents(students) {
  const cardsContainer = document.getElementById("studentCards");
  cardsContainer.innerHTML = "";

  students.forEach(function (student) {
    const card = document.createElement("div");
    card.className = "studentCard";

    const idHeading = document.createElement("h3");
    idHeading.textContent = "Student ID: " + student.student_id;

    const gpaParagraph = document.createElement("p");
    gpaParagraph.textContent = "Student GPA: " + student.student_gpa;

    const courseLabel = document.createElement("p");
    courseLabel.textContent = "Student Courses:";

    const coursesList = document.createElement("ul");

    student.student_courses.forEach(function (course) {
      const courseItem = document.createElement("li");
      courseItem.textContent = course;
      coursesList.appendChild(courseItem);
    });

    card.appendChild(idHeading);
    card.appendChild(gpaParagraph);
    card.appendChild(courseLabel);
    card.appendChild(coursesList);

    cardsContainer.appendChild(card);
  });
}

function addStudent(event) {
  event.preventDefault();

  const idInput = document.getElementById("studentId");
  const gpaInput = document.getElementById("studentGpa");
  const coursesInput = document.getElementById("studentCourses");

  const newStudent = {
    student_id: Number(idInput.value),
    student_gpa: Number(gpaInput.value),
    student_courses: coursesInput.value
      .split(",")
      .map(function (course) {
        return course.trim();
      })
      .filter(function (course) {
        return course.length > 0;
      })
  };

  const students = getStudents();
  students.push(newStudent);
  saveStudents(students);
  renderStudents(students);

  event.target.reset();
}

document.addEventListener("DOMContentLoaded", function () {
  const students = getStudents();
  renderStudents(students);

  const form = document.getElementById("addStudentForm");
  form.addEventListener("submit", addStudent);
});
