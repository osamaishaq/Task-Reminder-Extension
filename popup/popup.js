let tasks = [];

const startTimerBtn = document.getElementById("start-timer-btn")
startTimerBtn.addEventListener("click", () => {
    chrome.storage.local.get(["isRunning"], (res) => {
        chrome.storage.local.set({
            isRunning: !res.isRunning,
        }, () => {
            startTimerBtn.textContent = !res.isRunning ? "Pause Timer" : "Start Timer"
        })
    })
    
})


const updateTime = () => {
    chrome.storage.local.get(["timer"], (res) => {
        const timeElement = document.getElementById("time");
        const minutes = `${25 - Math.ceil(res.timer / 60)}`.padStart(2,'0')
        let seconds = "00";
        if(res.timer % 60 != 0){
            seconds = `${60 - res.timer % 60}`.padStart(2,"0")
        }
        
        timeElement.textContent = `${minutes}:${seconds}`
    })
}

//updating Time on Every Second 
updateTime();
setInterval(updateTime, 1000)

const resetTaskBtn = document.getElementById("reset-timer-btn")
resetTaskBtn.addEventListener("click", () => {
    chrome.storage.local.set({
        timer: 0,
        isRunning: false
    }, () => {
        startTimerBtn.textContent = "Start Timer"
    })
})

const addTaskBtn = document.getElementById("add-task-btn")
addTaskBtn.addEventListener("click", () => addTask())

chrome.storage.sync.get(["tasks"], (res) => {
    tasks = res.tasks ? res.tasks : []
    renderTasks()
})

const saveTasks = () => {
    chrome.storage.sync.set({
        tasks,
    })
}

const renderTask = (taskNum) => {
    const taskRow = document.createElement('div')

    const text = document.createElement("input")
    text.type = "text"
    text.placeholder = "Enter a task.."
    text.value = tasks[taskNum]
    text.addEventListener("change", () => {
        tasks[taskNum] = text.value
        saveTasks();
        //console.log("tasks ==> ",tasks)
       
    })

    const deleteBtn =  document.createElement("input")
    deleteBtn.type = "button"
    deleteBtn.value = "x"
    deleteBtn.addEventListener("click", () => {
        deleteTask(taskNum)
    })

    taskRow.appendChild(text)
    taskRow.appendChild(deleteBtn)

    const taskContainer =  document.getElementById("task-container")
    taskContainer.appendChild(taskRow)
}

const renderTasks = () => {
    const taskContainer = document.getElementById("task-container")
    taskContainer.textContent = ""
    tasks.forEach((tastText, taskNum) => {
        renderTask(taskNum)
    })
}

const addTask = () => {
    const taskNum = tasks.length
    tasks.push("")
    renderTask(taskNum)
    saveTasks()
}

const deleteTask = (taskNum) => {
    tasks.splice(taskNum, 1)
    renderTasks()
    saveTasks()
}