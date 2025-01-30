import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskDatetime = document.getElementById('task-datetime');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const authContainer = document.getElementById('auth-container');
    const todoContainer = document.getElementById('todo-container');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageContainer = document.getElementById('message');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');

    // Firebase Auth
    const auth = getAuth();

    // Event listeners
    registerBtn.addEventListener('click', register);
    loginBtn.addEventListener('click', login);
    logoutBtn.addEventListener('click', logout);
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Firebase Auth state listener
    onAuthStateChanged(auth, (user) => {
        if (user) {
            authContainer.style.display = 'none';
            todoContainer.style.display = 'block';
            messageContainer.innerText = `Welcome, ${user.email}`;
        } else {
            authContainer.style.display = 'block';
            todoContainer.style.display = 'none';
            messageContainer.innerText = '';
        }
    });

    // Register function
    function register() {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (email && password) {
            createUserWithEmailAndPassword(auth, email, password)
                .then(() => {
                    messageContainer.innerText = 'Registered successfully!';
                })
                .catch(error => {
                    messageContainer.innerText = error.message;
                });
        } else {
            messageContainer.innerText = 'Please fill in both email and password.';
        }
    }

    // Login function
    function login() {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (email && password) {
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    // The UI will automatically update due to onAuthStateChanged
                })
                .catch(error => {
                    messageContainer.innerText = error.message;
                });
        } else {
            messageContainer.innerText = 'Please fill in both email and password.';
        }
    }

    // Logout function
    function logout() {
        signOut(auth)
            .then(() => {
                // The UI will automatically update due to onAuthStateChanged
            })
            .catch(error => {
                messageContainer.innerText = error.message;
            });
    }

    // Add task function
    function addTask() {
        const taskText = taskInput.value.trim();
        const reminderDate = taskDatetime.value;

        if (taskText === '') {
            alert("Please enter a task!");
            return;
        }

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

    // Set reminder for a task
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

    // Show notification for task reminder
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
        } else {
            alert("Notifications are disabled. Please enable them in your browser settings.");
        }
    }
});
