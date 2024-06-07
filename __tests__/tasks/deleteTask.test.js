// Test written by Dirkje J vd Poel
// Import the deleteTask function from task.js in the root directory
const { deleteTask } = require('../../task'); // Adjusted path

// Mock the DOM for testing
document.body.innerHTML = `
  <ul id="taskList">
    <li id="task1">Test task</li>
  </ul>
`;

// Mock the fetch function to simulate a server response
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
    })
);

// Define the test
test('deletes a task', async () => {
    // Get the task element
    const taskElement = document.getElementById('task1');
  
    // Call the function to test
    await deleteTask(taskElement);
  
    // Check that fetch was called with the correct arguments
    expect(fetch).toHaveBeenCalledWith('/delete-task', expect.anything());
  
    // Check that the task was removed from the task list in the DOM
    expect(document.getElementById('taskList').children.length).toBe(0);
});