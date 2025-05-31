//get tasks from localstorage
function getTasks() {
    const tasksJson = localStorage.getItem('tasks');
    console.log(tasksJson);
    if (tasksJson) {
        return JSON.parse(tasksJson);
    }
    return [];
}

var active_task_body = document.getElementById("active-task-body");
var pending_task_body = document.getElementById("pending-task-body");
var closed_task_body = document.getElementById("closed-task-body");


//load tasks from localstorage to tbodies
function loadTasks() {
    const tasks = getTasks();

    //clear body datas
    active_task_body.innerHTML = '';
    pending_task_body.innerHTML = '';
    closed_task_body.innerHTML = '';

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>
                   <i class="bi bi-record-circle-fill"></i><span>${task.title}</span>
                </td>
                <td>
                   <span>${task.startdate}</span>
                </td>
                <td>
                   <span>${task.enddate}</span>
                </td>`;



        if (task.status == 0) {
            row.innerHTML = row.innerHTML + `<td>
                                    <span class="btn-task active-task">active</span>
                                </td>`;

        }
        if (task.status == 1) {
            row.innerHTML = row.innerHTML + `<td>
                                    <span class="btn-task pending-task">pending</span>
                                </td>`;

        }
        if (task.status == 2) {
            row.innerHTML = row.innerHTML + `<td>
                                    <span class="btn-task closed-task">closed</span>
                                </td>`;

        }
        row.innerHTML = row.innerHTML + `<td>
            <a class="edit-task" data-id="${task.id}">
                <i class="bi bi-pencil-square"></i>
            </a>
        </td>`;
        if (task.status == 0) {
            active_task_body.appendChild(row);

        }
        if (task.status == 1) {
            pending_task_body.appendChild(row);

        }
        if (task.status == 2) {
            closed_task_body.appendChild(row);

        }
    });
    attachEventListenersToEdit();
}

loadTasks();

var task_modal = document.getElementById("task-modal");
var modalTitle = document.getElementById("modalTitle");
var task_id = document.getElementById("id");
var taskName = document.getElementById("tname");
var startdate = document.getElementById("sdate");
var enddate = document.getElementById("edate");
var task_status = document.getElementById("status");
var status_panel = document.getElementById("status-panel");

//poen modal for new or edit task
function openModal(type, task = null) {
    if (type === 'add') {
        modalTitle.textContent = 'New Task';
        task_id.value = '';
        taskName.value = '';
        startdate.value = '';
        enddate.value = '';
        task_status.value = '0';
        status_panel.style.display = 'none';
    } else if (type === 'edit' && task) {
        modalTitle.textContent = 'Update Task';
        task_id.value = task.id;
        taskName.value = task.title;

        startdate.value = task.startdate;

        enddate.value = task.enddate;

        task_status.value = task.status;
        status_panel.style.display = 'block';
    }
    task_modal.style.display = 'block';
}

//close modal
function closeModal() {
    task_modal.style.display = "none";
}


var btn = document.getElementById("add-task");

btn.onclick = function () {
    openModal('add');
}

var closeBtn = document.getElementById("close-task");

closeBtn.onclick = function () {
    closeModal();
}


//close modal when click on background
window.onclick = function (event) {
    if (event.target == task_modal) {
        task_modal.style.display = "none";
    }
}

var active_filter_btn = document.getElementById("active-task");
var pending_filter_btn = document.getElementById("pending-task");
var closed_filter_btn = document.getElementById("closed-task");
var active_task_section = document.getElementsByClassName("active-task-section")[0];
var pending_task_section = document.getElementsByClassName("pending-task-section")[0];
var closed_task_section = document.getElementsByClassName("closed-task-section")[0];

active_filter_btn.onclick = function () {
    active_task_section.style.display = "block";
    pending_task_section.style.display = "none";
    closed_task_section.style.display = "none";
}
pending_filter_btn.onclick = function () {
    active_task_section.style.display = "none";
    pending_task_section.style.display = "block";
    closed_task_section.style.display = "none";
}
closed_filter_btn.onclick = function () {
    active_task_section.style.display = "none";
    pending_task_section.style.display = "none";
    closed_task_section.style.display = "block";
}


//save updated list task to localstorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//save task in modal
function saveTask() {
    const id = task_id.value;
    const title = taskName.value.trim();
    const sdate = startdate.value.trim();
    const edate = enddate.value.trim();
    const status = task_status.value.trim();

    if (title === '') {
        alert('please enter Title');
        taskTitleInput.focus();
        return;
    }
    if (sdate === '') {
        alert('please enter Start Date');
        taskStartDateInput.focus();
        return;
    }
    if (edate === '') {
        alert('please enter End Date');
        taskEndDateInput.focus();
        return;
    }

    let tasks = getTasks();
    if (id) {
        tasks = tasks.map(task => {
            if (task.id === parseInt(id)) {
                return { ...task, title: title, startdate: sdate, enddate: edate, status: status };
            }
            else
                return task;
        });
    } else {
        const newTask = {
            id: Date.now(),
            title: title,
            startdate: sdate,
            enddate: edate,
            status: status
        };
        tasks.push(newTask);
    }

    saveTasks(tasks);
    loadTasks();
    closeModal();
}

var save_task_btn = document.getElementById("save-task");
save_task_btn.onclick = function () {
    saveTask();
}

//edit task event
function editTask(id) {
    const tasks = getTasks();
    const taskToEdit = tasks.find(task => task.id === parseInt(id));
    if (taskToEdit) {
        openModal('edit', taskToEdit);
    }
}
function attachEventListenersToEdit() {
    document.querySelectorAll('.edit-task').forEach(button => {
        button.addEventListener('click', (event) => {
            const taskId = event.target.parentElement.getAttribute("data-id");
            editTask(taskId);
        });
    });
}