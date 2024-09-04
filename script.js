document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskDatetime = document.getElementById('task-datetime');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        const reminderDate = taskDatetime.value;

        if (taskText !== '') {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="task-text">${taskText}</span>
                <span class="task-datetime">${reminderDate ? new Date(reminderDate).toLocaleString() : ''}</span>
                <button class="remove-btn"><i class="fas fa-times"></i></button>
            `;
            
            const removeBtn = li.querySelector('.remove-btn');
            removeBtn.addEventListener('click', () => {
                li.classList.add('removing');
                setTimeout(() => {
                    clearInterval(li.timer);
                    taskList.removeChild(li);
                }, 300);
            });

            li.addEventListener('click', () => {
                li.classList.toggle('completed');
            });

            if (reminderDate) {
                setReminder(reminderDate, li);
            }

            taskList.appendChild(li);
            taskInput.value = '';
            taskDatetime.value = '';
        }
    }

    function setReminder(dateString, taskElement) {
        const reminderTime = new Date(dateString).getTime();
        const now = new Date().getTime();
        const timeDiff = reminderTime - now;

        if (timeDiff > 0) {
            taskElement.timer = setTimeout(() => {
                showNotification(taskElement.querySelector('.task-text').textContent);
            }, timeDiff);
        }
    }

    function showNotification(taskText) {
        if (Notification.permission === 'granted') {
            new Notification('Reminder!', {
                body: `It's time to: ${taskText}`
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Reminder!', {
                        body: `It's time to: ${taskText}`
                    });
                }
            });
        }
    }
});
