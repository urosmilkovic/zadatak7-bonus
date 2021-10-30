const modalElement = document.querySelector(".modal");
const crossElement = document.querySelector(".cross");
const displayElement = document.querySelector(".display");
const pointerElement = document.querySelector(".pointer");
const timerElements = document.querySelectorAll(".timer");
const progressElement = document.querySelector(".time-progres");
const progressCircleElement = document.querySelector(".time-progres circle");
const arrowUpElements = document.querySelectorAll(".arrow-up");
const arrowDownElements = document.querySelectorAll(".arrow-down");
const applyElement = document.querySelector(".ap-button");
const timeInputElements = document.querySelectorAll(".time-breaks input");
const circleElements = document.querySelectorAll(".theme-circle");
const fontElements = document.querySelectorAll(".font-circle");

var timerInterval = null;

const state = {
  timers: [1500000, 300000, 900000],
  activeTimer: 0,
  currentTimer: 1500000,
  playState: 0,
  themes: ["p-theme", "s-theme", "t-theme"],
  fonts: ["p-body", "s-body", "t-body"],
  font: 0,
  theme: 0,
};

const changeTheme = (id) => {
  state.theme = id;
  state.themes.forEach((x) => document.body.classList.remove(x));
  document.body.classList.add(state.themes[state.theme]);
};

circleElements.forEach((x, y) => {
  x.addEventListener("click", () => {
    changeTheme(y);
    circleElements.forEach((a) => {
      console.log(a);
      a.querySelector("div").classList.remove("c-active");
    });
    x.querySelector("div").classList.add("c-active");
  });
});
fontElements.forEach((x, y) => {
  x.addEventListener("click", () => {
    changeFont(y);
    fontElements.forEach((a) => {
      console.log(a);
      a.classList.remove("f-active");
    });
    x.classList.add("f-active");
  });
});

const changeFont = (id) => {
  state.font = id;
  state.fonts.forEach((x) => document.body.classList.remove(x));
  document.body.classList.add(state.fonts[state.font]);
};

document.querySelector(".setting").addEventListener("click", () => {
  modalElement.classList.add("modal-active");
});
[modalElement, crossElement].forEach((x) =>
  x.addEventListener("click", () => {
    modalElement.classList.remove("modal-active");
  })
);

document
  .querySelector(".modal-content")
  .addEventListener("click", (e) => e.stopPropagation());

const secondsToTime = (x) => {
  const seconds = Math.floor(Math.floor(x % 60000) / 1000);
  const minutes = Math.floor(x / 60000);
  return `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
};

const renderTimer = () => {
  displayElement.textContent = secondsToTime(state.currentTimer);
  const radius = progressCircleElement.getAttribute("r");
  const percent = (state.currentTimer / state.timers[state.activeTimer]) * 100;
  const roundCircum = 2 * radius * Math.PI;
  const roundDraw = (percent * roundCircum) / 100;
  progressElement.style.setProperty("stroke-dasharray", `${roundDraw} 9999`);
};

const renderPointer = () => {
  pointerElement.textContent = ["start", "pause", "restart"][state.playState];
};

timerElements.forEach((x, y) => {
  x.addEventListener("click", (e) => {
    timerElements.forEach((x) => x.classList.remove("active-timer"));
    e.target.classList.add("active-timer");
    state.activeTimer = y;
    state.currentTimer = state.timers[y];

    if (timerInterval) clearInterval(timerInterval);
    state.playState = 0;
    renderPointer();
    renderTimer();
  });
});

pointerElement.addEventListener("click", () => {
  if (state.playState === 0) {
    state.playState = 1;
    renderPointer();
    timerInterval = setInterval(() => {
      if (state.currentTimer <= 0) {
        if (timerInterval) clearInterval(timerInterval);
        state.playState = 2;
        renderPointer();
        return;
      }
      state.currentTimer = state.currentTimer - 10;
      renderTimer();
    }, 10);
  } else if (state.playState === 1) {
    state.playState = 0;
    renderPointer();
    if (timerInterval) clearInterval(timerInterval);
  } else if (state.playState === 2) {
    state.playState = 0;
    state.currentTimer = state.timers[state.activeTimer];
    renderPointer();
    renderTimer();
  }
});

arrowUpElements.forEach((x) => {
  x.addEventListener("click", (e) => {
    const inputEl = x.parentElement.querySelector("input");
    inputEl.setAttribute("value", Number(inputEl.value) + 1);
  });
});

arrowDownElements.forEach((x) => {
  x.addEventListener("click", (e) => {
    const inputEl = x.parentElement.querySelector("input");
    inputEl.setAttribute("value", Number(inputEl.value) - 1);
  });
});

applyElement.addEventListener("click", () => {
  state.timers = [...timeInputElements].map(
    (x) => Number(x.getAttribute("value")) * 60000
  );
  state.playState = 0;
  state.activeTimer = 0;
  state.currentTimer = state.timers[state.activeTimer];
  if (timerInterval) clearInterval(timerInterval);
  renderPointer();
  renderTimer();
  modalElement.classList.remove("modal-active");
  timerElements.forEach((x) => x.classList.remove("active-timer"));
  timerElements[0].classList.add("active-timer");
});

// INITIAL
renderTimer();
