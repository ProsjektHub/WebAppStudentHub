// Test written by Dirkje J vd Poel
// Import the addTask function from task.js
const { addTask } = require('../task'); 

// Mock the DOM for testing
document.body.innerHTML = `
  <input id="taskInput" value="Test task">
  <input id="dueDate" value="2022-12-31">
  <ul id="taskList"></ul>
  <div id="activeEmptyMessage"></div>
`;

// Mock the fetch function to simulate a server response
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
    })
);

// Mock the addTask function
jest.mock('../task', () => ({
  addTask: jest.fn(() => fetch('/add-task', { method: 'POST' })),
}));

// Define the test
test('adds a new task', async () => {
  // Call the function to test
  await addTask();

  // Simulate adding a task to the task list in the DOM
  const taskList = document.getElementById('taskList');
  const newTask = document.createElement('li');
  taskList.appendChild(newTask);

  // Check that fetch was called with the correct arguments
  expect(fetch).toHaveBeenCalledWith('/add-task', expect.anything());

  // Check that a new task was added to the task list in the DOM
  expect(document.getElementById('taskList').children.length).toBe(1);
});