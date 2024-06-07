// Code added by Dirkje J v.d. Poel
const { updateTaskStatus } = require('../../task');

describe('updateTaskStatus', () => {
    // Mock the fetch function to simulate a successful server response
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
        })
    );

    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        fetch.mockClear();
    });

    it('updates the task status in the DOM and makes a fetch call to the /update-task-status endpoint', async () => {
        // Set up our document body
        document.body.innerHTML =
            '<div id="taskList">' +
            '  <div id="task1" class="task">' +
            '    <button id="updateStatusButton">Update Status</button>' +
            '  </div>' +
            '</div>';

        const taskElement = document.getElementById('task1');
        const updateStatusButton = document.getElementById('updateStatusButton');

        updateStatusButton.onclick = function() {
            updateTaskStatus(taskElement); // Call updateTaskStatus function
        };

        // Simulate a click on the update status button
        updateStatusButton.click();

        // Check that the fetch function was called with the correct arguments
        expect(fetch).toHaveBeenCalledWith('/update-task-status', expect.anything());

        // Check that the task status was updated in the DOM
        // This will depend on how you implement the updateTaskStatus function
        // For example, you might add a 'completed' class to the task element
        expect(taskElement.classList.contains('completed')).toBe(true);
    });
});