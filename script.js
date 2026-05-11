

function openCrads() {
    var elems = document.querySelectorAll(".elem");
    var fullElems = document.querySelectorAll(".fullElem");
    var fullElemsBack = document.querySelectorAll(".fullElem .back")

    elems.forEach((elem) => {
        elem.addEventListener("click", () => {
            fullElems[elem.id].style.display = "block";
        })
    })

    fullElemsBack.forEach((back) => {
        back.addEventListener("click", () => {
            fullElems[back.id].style.display = "none";
        })
    })
}

openCrads();

// ------------------------TODO LIST----------------------------

function TodoList() {
    let form = document.querySelector(".addTask form")

    let taskInput = document.querySelector(".addTask form input")
    let taskDetailsInput = document.querySelector(".addTask form textarea")
    let taskCheckbox = document.querySelector(".addTask form #check")

    let currentTask = [];

    if (localStorage.getItem('currentTask')) {
        currentTask = JSON.parse(localStorage.getItem('currentTask'));
    } else {
        console.error('task list is empty');
    }


    function renderTask() {

        let allTask = document.querySelector(".allTask");

        let sum = '';

        currentTask.forEach((elem, id) => {
            sum += `<div class="task">
                <h5>${elem.task}
                    ${elem.checked ? `<span class="imp">Imp</span>` : ``}
                </h5>
                <button id=${id}>Mark as complete</button>
            </div>`
        })

        allTask.innerHTML = sum;

        localStorage.setItem('currentTask', JSON.stringify(currentTask))

        let markAsCompleteBtn = document.querySelectorAll(".task button")
        markAsCompleteBtn.forEach((btn) => {
            btn.addEventListener("click", () => {
                currentTask.splice(btn.id, 1)
                renderTask();
            })
        })
    }
    renderTask();


    form.addEventListener("submit", (e) => {
        e.preventDefault();
        currentTask.push(
            {
                task: taskInput.value,
                details: taskDetailsInput.value,
                checked: taskCheckbox.checked,
            }
        )
        renderTask();
        form.reset();
    })
}

TodoList();


// --------------------------DAILY PLANNER-------------------------

function dailyPlanner() {
    var dayActivities = JSON.parse(localStorage.getItem('dayActivities')) || []
    var dayPlanner = document.querySelector(".day-planner")


    var hours = Array.from({ length: 24 }, (elem, idx) => {
        return `${0 + idx}:00 - ${1 + idx}:00`
    })


    var wholeDaySum = '';

    hours.forEach((elem, idx) => {
        var savedData = dayActivities[idx] || '';

        wholeDaySum += `<div class="day-planner-time">
                    <p>${elem}</p>
                    <input id=${idx} type="text" placeholder="..." value=${savedData}>
                </div>`
    })

    dayPlanner.innerHTML = wholeDaySum;
    var dayPlannerInput = document.querySelectorAll(".day-planner input")

    dayPlannerInput.forEach((elem) => {
        elem.addEventListener("input", () => {
            dayActivities[Number(elem.id)] = elem.value;
            localStorage.setItem('dayActivities', JSON.stringify(dayActivities));
        })
    })
}

dailyPlanner();


// ---------------------MOTIVATIONAL QUOTE------------------------------

function motivationalQuote() {
    var quote = document.querySelector(".motivation-2 h2")
    var author = document.querySelector(".motivation-3 h2")

    async function fetchQuote() {
        let response = await fetch('https://dummyjson.com/quotes/random')
        let data = await response.json()

        quote.innerHTML = data.quote;
        author.innerHTML = '-' + data.author;

    }
    fetchQuote();
}

motivationalQuote();


// ----------------------POMODORO TIMER------------------------------


function pomodoroTimer() {
    let timer = document.querySelector(".pomo-timer h1");
    let timerInterval = null;
    let startBtn = document.querySelector(".pomo-timer .start");
    let resetBtn = document.querySelector(".pomo-timer .reset");
    let pauseBtn = document.querySelector(".pomo-timer .pause");
    let session = document.querySelector(".pomo-fullpage .session");
    let isWorkSession = true;

    let totalSeconds = 25 * 60;

    function updateTimer() {
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        timer.innerHTML = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

    function startTimer() {
        clearInterval(timerInterval);

        if (isWorkSession) {
            timerInterval = setInterval(() => {
                if (totalSeconds > 0) {
                    totalSeconds--;
                    updateTimer();
                } else {
                    isWorkSession = false;
                    clearInterval(timerInterval);
                    timer.innerHTML = "05:00";
                    session.innerHTML = "Break";
                    session.style.backgroundColor = "var(--blue)";
                    totalSeconds = 5 * 60;
                }
            }, 1000)
        } else {
            timerInterval = setInterval(() => {
                if (totalSeconds > 0) {
                    totalSeconds--;
                    updateTimer();
                } else {
                    isWorkSession = true;
                    clearInterval(timerInterval);
                    timer.innerHTML = "25:00";
                    session.innerHTML = "Work Session";
                    session.style.backgroundColor = "var(--green)";
                    totalSeconds = 25 * 60;
                }
            }, 1000)
        }
    }

    function pauseTimer() {
        clearInterval(timerInterval);
    }

    function resetTimer() {
        totalSeconds = 25 * 60;
        clearInterval(timerInterval);
        updateTimer();
    }

    startBtn.addEventListener("click", startTimer);
    pauseBtn.addEventListener("click", pauseTimer);
    resetBtn.addEventListener("click", resetTimer)

    // the pause timer restarts from that last time because the value of totalseconds which already was deducted gets continued from that number only
}

pomodoroTimer();


// ------------------------Weather Widget----------------------------

function weatherWidget() {
    apiKey = '5fd9759914674e2894c121738260204'
    city = 'varanasi'
    let data = null;

    let header1Time = document.querySelector('.header1 h1');
    let header1Date = document.querySelector('.header1 h2');

    let header2Temp = document.querySelector('.header2 h2');
    let header2Condition = document.querySelector('.header2 h4');
    let header2Humidity = document.querySelector('.header2 .humid');
    let header2Precip = document.querySelector('.header2 .precip');
    let header2Wind = document.querySelector('.header2 .wind');

    async function weatherAPICall() {
        let response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)

        data = await response.json();

        header2Temp.innerHTML = `${data.current.temp_c}°C`;
        header2Condition.innerHTML = data.current.condition.text;
        header2Humidity.innerHTML = `Humidity: ${data.current.humidity}%`;
        header2Precip.innerHTML = `Precipitation: ${data.current.precip_mm}%`;
        header2Wind.innerHTML = `Wind: ${data.current.wind_kph} KpH`;
    }
    weatherAPICall();


    function dateTime() {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        let date = new Date();
        let dayOfWeek = daysOfWeek[date.getDay()]
        let minutes = String(date.getMinutes()).padStart(2, '0')
        let hours = String(date.getHours()).padStart(2, '0');

        if (hours > 12) {
            header1Time.innerHTML = `${dayOfWeek} ${String(hours).padStart('2', '0')}:${String(minutes).padStart('2', '0')}PM`;
        } else {
            header1Time.innerHTML = `${dayOfWeek} ${String(hours).padStart('2', '0')}:${String(minutes).padStart('2', '0')}AM`;
        }


        function dateOfTheYear() {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            let data = new Date();
            let date = String(data.getDate()).padStart(2, '0');
            let month = months[data.getMonth()];
            let year = data.getFullYear();

            header1Date.innerHTML = `${date} ${month} ${year}`;
        }
        dateOfTheYear();
    }
    setInterval(() => {
        dateTime();
    }, 1000)
}

weatherWidget();


// ------------------------Change Theme----------------------------

function changeTheme() {
    let theme = document.querySelector(".theme");
    let rootElement = document.documentElement;
    let flag = 0;

    theme.addEventListener("click", () => {
        if (flag == 0) {
            rootElement.style.setProperty('--pri', '#D2C1B6');
            rootElement.style.setProperty('--sec', '#1B3C53');
            rootElement.style.setProperty('--tri1', '#456882');
            rootElement.style.setProperty('--tri2', '#234C6A');
            flag = 1;
        } else if (flag == 1) {
            rootElement.style.setProperty('--pri', '#F5D2D2');
            rootElement.style.setProperty('--sec', '#F8F7BA');
            rootElement.style.setProperty('--tri1', '#BDE3C3');
            rootElement.style.setProperty('--tri2', '#A3CCDA');
            flag = 2;
        } else if (flag == 2) {
            rootElement.style.setProperty('--pri', '#EFF5D2');
            rootElement.style.setProperty('--sec', '#556B2F');
            rootElement.style.setProperty('--tri1', '#C6D870');
            rootElement.style.setProperty('--tri2', '#8FA31E');
            flag = 3;
        } else {
            rootElement.style.setProperty('--pri', '#F8F4E1');
            rootElement.style.setProperty('--sec', '#3e1a01');
            rootElement.style.setProperty('--tri1', '#FEBA17');
            rootElement.style.setProperty('--tri2', '#74512D');
            flag = 0;
        }
    })
}

changeTheme();

