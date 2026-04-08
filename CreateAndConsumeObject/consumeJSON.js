// JavaScript Document
/*
  This file will:
  - Create a Javascript object
  - Convert the Javascript object into a JSON object
  - Store the JSON object into local storage

  Goal: Provide an example of how to create JSON objects in Javascript
  Goal: Provide an example of how to consume JSON objects in Javascript

  Use the following data for your JSON object

    student_id = 332443
    student_gpa = 3.6
    student_courses = ["WDV101","WDV131","WDV105"]

*/

function createAndStoreStudentJson() {
  var studentObject = {
    student_id: 332443,
    student_gpa: 3.6,
    student_courses: ["WDV101", "WDV131", "WDV105"]
  };

  var studentJson = JSON.stringify(studentObject);
  localStorage.setItem("studentJSON", studentJson);
}

function findStudentObjectInStorage() {
  var candidateKeys = ["student", "studentData", "studentObject", "studentJSON", "student_info"];
  var i;

  for (i = 0; i < candidateKeys.length; i += 1) {
    var rawByKnownKey = localStorage.getItem(candidateKeys[i]);
    if (!rawByKnownKey) {
      continue;
    }

    try {
      var parsedKnown = JSON.parse(rawByKnownKey);
      if (parsedKnown && typeof parsedKnown === "object") {
        return parsedKnown;
      }
    } catch (error) {
      // Skip values that are not valid JSON.
    }
  }

  for (i = 0; i < localStorage.length; i += 1) {
    var key = localStorage.key(i);
    var raw = localStorage.getItem(key);

    if (!raw) {
      continue;
    }

    try {
      var parsed = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed === "object" &&
        "student_id" in parsed &&
        "student_gpa" in parsed &&
        "student_courses" in parsed
      ) {
        return parsed;
      }
    } catch (error) {
      // Ignore keys that do not contain JSON.
    }
  }

  return null;
}

function renderStudentCard(student) {
  var studentIdEl = document.getElementById("studentId");
  var studentGpaEl = document.getElementById("studentGpa");
  var studentCoursesEl = document.getElementById("studentCourses");

  if (!studentIdEl || !studentGpaEl || !studentCoursesEl) {
    return;
  }

  studentIdEl.textContent = "Student ID: " + (student.student_id || "N/A");
  studentGpaEl.textContent = "Student GPA: " + (student.student_gpa || "N/A");

  studentCoursesEl.innerHTML = "";
  if (Array.isArray(student.student_courses)) {
    student.student_courses.forEach(function (course) {
      var listItem = document.createElement("li");
      listItem.textContent = course;
      studentCoursesEl.appendChild(listItem);
    });
  }
}

function renderFallbackMessage() {
  var studentIdEl = document.getElementById("studentId");
  var studentGpaEl = document.getElementById("studentGpa");
  var studentCoursesEl = document.getElementById("studentCourses");

  if (!studentIdEl || !studentGpaEl || !studentCoursesEl) {
    return;
  }

  studentIdEl.textContent = "Student ID: N/A";
  studentGpaEl.textContent = "Student GPA: N/A";
  studentCoursesEl.innerHTML = "";

  var fallbackItem = document.createElement("li");
  fallbackItem.textContent = "No student data found in local storage.";
  studentCoursesEl.appendChild(fallbackItem);
}

window.addEventListener("DOMContentLoaded", function () {
  createAndStoreStudentJson();

  var studentObject = findStudentObjectInStorage();

  if (studentObject) {
    renderStudentCard(studentObject);
  } else {
    renderFallbackMessage();
  }
});

