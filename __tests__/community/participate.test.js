// Test written by Dirkje J vd Poel
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

const { JSDOM } = require("jsdom");
const dom = new JSDOM();
global.document = dom.window.document;

jest.useFakeTimers();

// Add a mock HTML structure to the document
beforeEach(() => {
    const mockHtml = `
        <div>
            <h3>Event Name</h3>
            <div class="event-date">Event Date</div>
            <div class="event-location">Event Location</div>
            <button class="participate-btn">Participate</button>
        </div>
        <div id="confirmation-message" style="display: none;"></div>
    `;
    document.body.innerHTML = mockHtml;
});

// Test that clicking a participate button updates the confirmation message and displays it
test("Clicking a participate button updates the confirmation message and displays it", () => {
    require("../../lightbox.js");
    const { fireEvent } = require("@testing-library/dom");
    fireEvent(document, new Event("DOMContentLoaded"));
    const button = document.querySelector(".participate-btn");
    if (button) {
        fireEvent.click(button);
        const confirmationMessage = document.getElementById("confirmation-message");
        expect(confirmationMessage.textContent).toBe(`You have successfully signed up for "Event Name" on Event Date at Event Location.`);
        expect(confirmationMessage.style.display).toBe("block");
    } else {
        console.error('Button not found in the DOM');
    }
});

// Test that the confirmation message is hidden after 10 seconds
test("Confirmation message is hidden after 10 seconds", () => {
    require("../../lightbox.js");
    const { fireEvent } = require("@testing-library/dom");
    fireEvent(document, new Event("DOMContentLoaded"));
    const button = document.querySelector(".participate-btn");
    if (button) {
        fireEvent.click(button);
        const confirmationMessage = document.getElementById("confirmation-message");
        jest.advanceTimersByTime(10000);
        expect(confirmationMessage.style.display).toBe("none");
    } else {
        console.error('Button not found in the DOM');
    }
});