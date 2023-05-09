let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
const store = window.localStorage;
let selectedDate;

const day = document.querySelector(".calendar-dates");

const currdate = document.querySelector(".calendar-current-date");

const prenexIcons = document.querySelector(".calendar-navigation");

const calenderDates = document.querySelector(".calendar-dates");

const displayDateEle = document.querySelector(".display_date");

const attendanceContainerEle = document.querySelector(".attendance-container");

// Array of month names
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getFormattedDate = function (d) {
  return `${d.getDate()}-${months[d.getMonth()]}-${d.getFullYear()}`;
};

const showAttendanceOnCalender = function () {
  const presentArray = JSON.parse(store.getItem("present")) ?? [];
  const absentArray = JSON.parse(store.getItem("absent")) ?? [];

  const monthDates = document.querySelectorAll(".calender-date");
  monthDates.forEach(function (date) {
    if (!date.classList.contains("inactive")) {
      if (
        presentArray.includes(
          getFormattedDate(new Date(year, month, date.innerText))
        )
      ) {
        date.classList.add("present-tag");
      } else if (
        absentArray.includes(
          getFormattedDate(new Date(year, month, date.innerText))
        )
      ) {
        date.classList.add("absent-tag");
      }
    }
  });
};

const displaySelectedDate = function (e) {
  // show the date that is selected.
  selectedDate = e
    ? getFormattedDate(new Date(year, month, e.target.textContent))
    : getFormattedDate(new Date());
  // console.log(selectedDate);
  if (
    e?.target.classList.contains("calender-date") &&
    !e?.target.classList.contains("inactive")
  ) {
    displayDateEle.textContent = getFormattedDate(
      new Date(year, month, e.target.textContent)
    );
    return;
  }
  // else show the current date.
  displayDateEle.textContent = getFormattedDate(date);
};

// Function to generate the calendar
const manipulate = () => {
  // Get the first day of the month
  let dayone = new Date(year, month, 1).getDay();

  // Get the last date of the month
  let lastdate = new Date(year, month + 1, 0).getDate();

  // Get the day of the last date of the month
  let dayend = new Date(year, month, lastdate).getDay();

  // Get the last date of the previous month
  let monthlastdate = new Date(year, month, 0).getDate();

  // Variable to store the generated calendar HTML
  let lit = "";

  // Loop to add the last dates of the previous month
  for (let i = dayone; i > 0; i--) {
    lit += `<li class="inactive calender-date">${monthlastdate - i + 1}</li>`;
  }

  // Loop to add the dates of the current month
  for (let i = 1; i <= lastdate; i++) {
    // Check if the current date is today
    let isToday =
      i === date.getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
        ? "active"
        : "";
    lit += `<li class="${isToday} calender-date">${i}</li>`;
  }

  // Loop to add the first dates of the next month
  for (let i = dayend; i < 6; i++) {
    lit += `<li class="inactive calender-date">${i - dayend + 1}</li>`;
  }

  // Update the text of the current date element
  // with the formatted current month and year
  currdate.innerText = `${months[month]} ${year}`;

  // update the HTML of the dates element
  // with the generated calendar
  day.innerHTML = lit;
  displaySelectedDate();
};

manipulate();

// Attach a click event listener to each icon
prenexIcons.addEventListener("click", function (e) {
  month = e.target.id === "calender-prev" ? month - 1 : month + 1;
  // Check if the month is out of range
  if (month < 0 || month > 11) {
    // Set the date to the first day of the
    // month with the new year
    date = new Date(year, month, new Date().getDate());

    // Set the year to the new year
    year = date.getFullYear();

    // Set the month to the new month
    month = date.getMonth();
  } else {
    // Set the date to the current date
    date = new Date();
  }

  // Call the manipulate function to
  // update the calendar display
  manipulate();
  showAttendanceOnCalender();
});

const setAttendance = function (e) {
  const presentArray = JSON.parse(store.getItem("present")) ?? [];
  const absentArray = JSON.parse(store.getItem("absent")) ?? [];

  if (e.target.id === "present" || e.target.parentNode.id === "present") {
    if (
      !presentArray.includes(selectedDate) &&
      !absentArray.includes(selectedDate)
    ) {
      presentArray.push(selectedDate);
    }
    store.setItem("present", JSON.stringify(presentArray));
  } else if (e.target.id === "absent" || e.target.parentNode.id === "absent") {
    if (
      !presentArray.includes(selectedDate) &&
      !absentArray.includes(selectedDate)
    ) {
      absentArray.push(selectedDate);
    }
    store.setItem("absent", JSON.stringify(absentArray));
  }
  showAttendanceOnCalender();
};

attendanceContainerEle.addEventListener("click", setAttendance);
calenderDates.addEventListener("click", displaySelectedDate);
showAttendanceOnCalender();
