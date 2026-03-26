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

(() => {
  "use strict";

  const STORAGE_KEY = "wdv321_students";

  function getDefaultStudents() {
    return [
      {
        student_id: 332443,
        student_gpa: 3.6,
        student_courses: ["WDV101", "WDV131", "WDV105"],
      },
      {
        student_id: 545467,
        student_gpa: 2.7,
        student_courses: ["WDV101", "WDV131", "WDV105", "WDV221", "WDV205"],
      },
      {
        student_id: 128574,
        student_gpa: 3.4,
        student_courses: [
          "WDV101",
          "WDV131",
          "WDV105",
          "WDV221",
          "WDV205",
          "WDV341",
        ],
      },
      {
        student_id: 750056,
        student_gpa: 1.85,
        student_courses: ["WDV101", "WDV131", "WDV105", "WDV221", "WDV205"],
      },
    ];
  }

  function ensureStudentsInLocalStorage() {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return;

    const students = getDefaultStudents();

    // Convert JS array/object into a JSON string
    const jsonString = JSON.stringify(students);

    // Store JSON string into local storage
    localStorage.setItem(STORAGE_KEY, jsonString);
  }

  function getStudentsFromLocalStorage() {
    const jsonString = localStorage.getItem(STORAGE_KEY);
    if (!jsonString) return [];
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function renderStudentIntoCard(cardEl, student) {
    if (!cardEl || !student) return;

    const idEl = cardEl.querySelector("h3");
    if (idEl) idEl.textContent = `Student ID: ${student.student_id}`;

    const pEls = cardEl.querySelectorAll("p");
    if (pEls[0]) pEls[0].textContent = `Student GPA: ${student.student_gpa}`;

    const ul = cardEl.querySelector("ul");
    if (ul) {
      ul.innerHTML = "";
      for (const course of student.student_courses || []) {
        const li = document.createElement("li");
        li.textContent = course;
        ul.appendChild(li);
      }
    }
  }

  function renderStudentCards(students) {
    const templateCard = document.querySelector(".studentCard");
    if (!templateCard) return;

    // Use the existing card for the first student, clone for the rest.
    let lastCard = templateCard;

    students.forEach((student, index) => {
      const card = index === 0 ? templateCard : templateCard.cloneNode(true);
      renderStudentIntoCard(card, student);

      if (index > 0) {
        lastCard.parentNode.insertBefore(card, lastCard.nextSibling);
        lastCard = card;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    ensureStudentsInLocalStorage();
    const students = getStudentsFromLocalStorage();
    renderStudentCards(students);
  });
})();

