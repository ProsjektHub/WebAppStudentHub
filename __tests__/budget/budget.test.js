//written by Dirkje J vd Poel
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
const { JSDOM } = require("jsdom");
const { fireEvent } = require("@testing-library/dom");

const dom = new JSDOM();
global.document = dom.window.document;
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

jest.useFakeTimers();

beforeEach(() => {
  // Set up our document body
  document.body.innerHTML = `
    <div id="status"></div>
    <div id="balance"></div>
    <div id="income"></div>
    <div id="expense"></div>
    <form id="transactionForm">
        <div>
            <label for="category"></label>
            <select id="type">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </select>
            <select id="category"></select>
        </div>
        <input id="description" type="text" />
        <input id="amount" type="number" />
        <button type="submit">Add transaction</button>
    </form>
    <ul id="transactionList"></ul>
  `;
});

// Test that adding a transaction updates the balance, income, and expense
test("Adding a transaction updates the balance, income, and expense", () => {
  require("../../JavaScript/budget_script.js");
  const form = document.getElementById("transactionForm");
  if (form) {
    document.getElementById("type").value = "income";
    document.getElementById("description").value = "Test income";
    document.getElementById("amount").value = "100";
    fireEvent(document, new Event("DOMContentLoaded"));
    fireEvent.submit(form);
    expect(document.getElementById("balance").textContent).toBe("$100.00");
    expect(document.getElementById("income").textContent).toBe("$100.00");
    expect(document.getElementById("expense").textContent).toBe("$0.00");
  } else {
    console.error("Form not found in the DOM");
  }
});

// Test that adding an expense transaction updates the balance, income, and expense
test("Adding an expense transaction updates the balance, income, and expense", () => {
  require("../../JavaScript/budget_script.js");
  const form = document.getElementById("transactionForm");
  if (form) {
    document.getElementById("type").value = "expense";
    document.getElementById("description").value = "Test expense";
    document.getElementById("amount").value = "50";
    fireEvent(document, new Event("DOMContentLoaded"));
    fireEvent.submit(form);
    expect(document.getElementById("balance").textContent).toBe("-$50.00");
    expect(document.getElementById("income").textContent).toBe("$0.00");
    expect(document.getElementById("expense").textContent).toBe("$50.00");
  } else {
    console.error("Form not found in the DOM");
  }
});