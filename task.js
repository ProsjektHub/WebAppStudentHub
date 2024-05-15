// Function to add a new task
function addTask() {
    // Get task details from the input fields
    const taskName = document.getElementById('taskInput').value;
    const dueDate = document.getElementById('dueDate').value;

    // Create a task object
    const task = {
        taskName: taskName,
        dueDate: dueDate
    };

    // Send an AJAX POST request to the backend to add the task to the database
    fetch('/add-task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add task');
        }
        return response.json();
    })
    .then(data => {
        console.log('Task added successfully to the database:', data);
       

        // add the task to the page
        var taskList = document.getElementById('taskList');

        if (taskName !== '') {
            var li = document.createElement('li');
            li.className = 'task-list-item'; // Added class for styling
            var deleteButton = document.createElement('button');
            var finishButton = document.createElement('button');
            var timerSpan = document.createElement('span');
            var buttonsDiv = document.createElement('div'); // Container for buttons
            buttonsDiv.className = 'buttons'; // Added class for styling

            li.textContent = taskName + (dueDate !== '' ? ' - Due: ' + dueDate : ''); // Include due date if available

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
    })
    .catch(error => {
        console.error('Error adding task:', error);
        // Optionally, you can show an error message to the user
    });
}

// Code added by Dirkje J v.d. Poel
// This line exports the addTask function so that it can be imported and tested in other files.
module.exports = { addTask };

// Code added by Dirkje J v.d. Poel
// This function is needed for the updateTimers call in the addTask function.
// It's currently empty and needs to be filled with the correct logic to update timers.
function updateTimers() {
  // Implement the logic for updating timers here
}
// Code added by Dirkje J v.d. Poel
// This function is needed for the updateTaskListVisibility call in the addTask function.
// It's currently empty and needs to be filled with the correct logic to update the visibility of the task list.
function updateTaskListVisibility() {
    // Implement the logic for updating the visibility of the task list here
  }