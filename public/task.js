// Function to add a new task to the database
function addTaskToDatabase() {
    var taskInput = document.getElementById('taskInput').value;
    var dueDate = document.getElementById('dueDate').value;
    

    if (taskInput !== '') {
        var taskData = {
            taskName: taskInput,
            dueDate: dueDate
        };

        // Send an HTTP POST request to your server to add the task
        fetch('/add-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to add task');
        })
        .then(data => {
            // Task added successfully, do something if needed
            console.log('Task added successfully:', data);
            // Clear input fields after adding task
            document.getElementById('taskInput').value = '';
            document.getElementById('dueDate').value = '';
        })
        .catch(error => {
            console.error('Error adding task:', error);
            // Handle error
        });
    }
}

// Function to add a new task - wtitten by Lars
function addTask() {
    var taskInput = document.getElementById('taskInput').value;
    var dueDate = document.getElementById('dueDate').value;
    var taskList = document.getElementById('taskList');

    if (taskInput !== '') {
        var li = document.createElement('li');
        li.className = 'task-list-item'; // Added class for styling
        var deleteButton = document.createElement('button');
        var finishButton = document.createElement('button');
        var timerSpan = document.createElement('span');
        var buttonsDiv = document.createElement('div'); // Container for buttons
        buttonsDiv.className = 'buttons'; // Added class for styling

        li.textContent = taskInput + (dueDate !== '' ? ' - Due: ' + dueDate : ''); // Include due date if available

        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = function() {
            if (confirm('Are you sure you want to delete this task?')) {
                deleteTask(li); // Call delete task function
            }
        };

        finishButton.textContent = 'Finish';
        finishButton.className = 'finish-btn';
        finishButton.onclick = function() {
            moveToArchive(li); // Move finished task to the archive
            deleteTask(li); // Call delete task function
        };

        buttonsDiv.appendChild(deleteButton);
        buttonsDiv.appendChild(finishButton);

        li.appendChild(timerSpan);
        li.appendChild(buttonsDiv); // Append buttons container

        taskList.appendChild(li);

        // Clear input fields after adding task(s)
        document.getElementById('taskInput').value = '';
        document.getElementById('dueDate').value = '';

        // Update timer every second
        updateTimers();
        setInterval(updateTimers, 1000);

        // Hide the empty message for active tasks
        document.getElementById('activeEmptyMessage').style.display = 'none';

        // Hide or show the task list container based on whether there are active tasks
        updateTaskListVisibility();
    }
}

// Function to delete a task
function deleteTask(taskItem) {
    taskItem.parentNode.removeChild(taskItem);
    updateEmptyMessage('active'); // Update empty message

    // Hide or show the task list container based on whether there are active tasks
    updateTaskListVisibility();
}

// Function to update empty message for active list
function updateEmptyMessage(listType) {
    var emptyMessage = document.getElementById(listType + 'EmptyMessage');
    var taskList = document.getElementById('taskList');
    if (taskList.children.length > 1) { // If there are tasks other than the empty message
        emptyMessage.style.display = 'none'; // Hide empty message
    } else {
        emptyMessage.style.display = 'block'; // Show empty message
    }
}

// Function to update task list visibility based on whether there are active tasks
function updateTaskListVisibility() {
    var taskListContainer = document.getElementById('taskListContainer');
    var taskList = document.getElementById('taskList');

    if (taskList.children.length > 1) { // If there are tasks other than the empty message
        taskListContainer.style.display = 'block'; // Show task list container
    } else {
        taskListContainer.style.display = 'none'; // Hide task list container
    }
}

// Function to update timers for all tasks
function updateTimers() {
    var tasks = document.querySelectorAll('#taskList li');
    tasks.forEach(function(task) {
        var dueDateStr = task.textContent.match(/Due: (\d{4}-\d{2}-\d{2})/);
        if (dueDateStr) {
            var dueDate = new Date(dueDateStr[1] + 'T23:59:59');
            var timeDiff = dueDate - new Date();

            var daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            var hoursDiff = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            var secondsDiff = Math.floor((timeDiff % (1000 * 60)) / 1000);

            var timerStr = '';

            if (timeDiff < 0) {
                timerStr = 'Overdue';
            } else {
                timerStr = 'Due in ';
                if (daysDiff > 0) timerStr += daysDiff + 'd ';
                if (hoursDiff > 0) timerStr += hoursDiff + 'h ';
                if (minutesDiff > 0) timerStr += minutesDiff + 'm ';
                timerStr += secondsDiff + 's';
            }

            task.querySelector('span').textContent = timerStr;
        }
    });
}

       // Function to move finished tasks to the archive
function moveToArchive(taskItem) {
    var taskList = document.getElementById('archiveList');
    var archivedTask = taskItem.cloneNode(true); // Clone the task item
    var buttonsDiv = archivedTask.querySelector('.buttons');
    buttonsDiv.remove(); // Remove buttons from the archived task
    var deleteButton = document.createElement('button');
    var restoreButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-btn';
    deleteButton.onclick = function() {
        if (confirm('Are you sure you want to delete this task permanently?')) {
            deleteTask(archivedTask); // Call delete task function
        }
    };
    restoreButton.textContent = 'Restore';
    restoreButton.className = 'restore-btn';
    restoreButton.onclick = function() {
        restoreTask(archivedTask); // Restore task to active list
        deleteTask(archivedTask); // Delete task from archive list
    };
    var buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons';
    buttonsContainer.appendChild(deleteButton);
    buttonsContainer.appendChild(restoreButton);
    archivedTask.appendChild(buttonsContainer); // Append buttons container to archived task
    taskList.appendChild(archivedTask); // Append the archived task to the archive list
}

// Function to restore a task from the archive to the input field
function restoreTask(taskItem) {
    var taskInput = document.getElementById('taskInput');
    var taskName = taskItem.textContent.split(' - Due:')[0]; // Extract only the task name
    var cleanedTaskName = taskName.replace('Delete', '').replace('Restore', '').trim(); // Remove 'Delete' and 'Restore' if present and trim any leading/trailing whitespace
    taskInput.value = cleanedTaskName; // Set the task name in the input field
}

// Function to toggle the visibility of the archive section
function toggleArchive() {
    var archiveSection = document.querySelector('.archive-section');
    if (window.getComputedStyle(archiveSection).display === 'none') {
        archiveSection.style.display = 'block'; // Show the archive
    } else {
        archiveSection.style.display = 'none'; // Toggle the archive visibility
    }
}