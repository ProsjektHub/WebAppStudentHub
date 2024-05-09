const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Add new properties for categories for expense and income
const categories = [
  { name: 'Rent', type: 'expense' },
  { name: 'Groceries', type: 'expense' },
  { name: 'Entertainment', type: 'expense' },
  { name: 'Others', type: 'expense' },
  { name: 'Salary', type: 'income' },
  { name: 'Sales', type: 'income' },
  { name: 'Crypto', type: 'income' },
  { name: 'Shares', type: 'income' },
];

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  signDisplay: 'always',
});

const list = document.getElementById('transactionList');
const form = document.getElementById('transactionForm');
const status = document.getElementById('status');
const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
// IBF - endret følgende linje for farge kun i expense tracker seksjonen
const balanceElement = document.getElementById('expenseTrackerSection');

// fireworks effect element
const fireworksContainer = document.getElementById('fireworks-container');

form.addEventListener('submit', addTransaction);

function updateTotal() {
  const incomeTotal = transactions.filter((trx) => trx.type === 'income').reduce((total, trx) => total + trx.amount, 0);

  const expenseTotal = transactions
    .filter((trx) => trx.type === 'expense')
    .reduce((total, trx) => total + trx.amount, 0);

  const balanceTotal = incomeTotal - expenseTotal;
  balanceElement.style.backgroundColor = balanceTotal === 0 ? 'blue' : balanceTotal > 0 ? 'green' : 'red';

  balance.textContent = formatter.format(balanceTotal);
  income.textContent = formatter.format(incomeTotal);
  expense.textContent = formatter.format(expenseTotal * -1);
}

function renderList() {
  list.innerHTML = '';

  status.textContent = '';
  if (transactions.length === 0) {
    status.textContent = 'No transactions.';
    return;
  }

  transactions.forEach(({ id, name, amount, date, type, category }) => {
    const sign = 'income' === type ? 1 : -1;

    const li = document.createElement('li');

    li.innerHTML = `
      <div class="name">
        <h4>${name}</h4>
        <p>${new Date(date).toLocaleDateString()}</p>
      </div>

      <div class="amount ${type}">
        <span>${formatter.format(amount * sign)}</span>
         <p class="category-transaction">${category}</p>

      </div>

    
      <div class="action">
<svg fill="#ffffff" height="24px" width="24px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 508 508" xml:space="preserve" stroke="#ffffff"  onclick="deleteTransaction(${id})"><g id="SVGRepo_bgCarrier" stroke-width="0" ></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M204.5,408.2l-18.9-250.5c-0.6-7.8-7.4-13.6-15.1-13c-7.8,0.6-13.6,7.4-13,15.1l18.9,250.5c0.6,7.4,6.3,13.7,15.1,13 C199.3,422.7,205.1,415.9,204.5,408.2z"></path> </g> </g> <g> <g> <path d="M337.5,144.7c-7.8-0.6-14.5,5.2-15.1,13l-18.9,250.5c-0.6,7.7,5.2,14.5,13,15.1c8.9,0.7,14.6-5.6,15.1-13l18.9-250.5 C351.1,152,345.3,145.3,337.5,144.7z"></path> </g> </g> <g> <g> <path d="M455.1,60h-136V35.3c0-19.5-15.8-35.3-35.3-35.3h-59.6c-19.5,0-35.3,15.8-35.3,35.3V60h-136c-7.8,0-14.1,6.3-14.1,14.1 s6.3,14.1,14.1,14.1h14.2l27.8,367.6c2.2,29.3,26.9,52.2,56.3,52.2h205.6c29.4,0,54.1-22.9,56.3-52.2l27.8-367.6h14.2 c7.8,0,14.1-6.3,14.1-14.1S462.9,60,455.1,60z M224.2,28.2h59.6c3.9,0,7.1,3.2,7.1,7.1V60h-73.7V35.3h-0.1 C217.1,31.4,220.3,28.2,224.2,28.2z M384.9,453.7c-1.1,14.6-13.5,26.1-28.1,26.1H151.2c-14.7,0-27-11.5-28.1-26.1L95.4,88.2h317.1 L384.9,453.7z"></path> </g> </g> </g></svg>
      </div>
    `;

    list.appendChild(li);
  });
}

function renderForm() {
  const form = document.getElementById('transactionForm');

  // get the select element
  const select = document.getElementById('category');
  select.innerHTML = ''; // Clear existing options, so that you can add new ones after rerender.
  const selectedType = document.getElementById('type').checked ? 'income' : 'expense';
  //filter categories according to selected income or expense
  const filteredCategories = categories.filter((category) => category.type === selectedType);
  console.log('selectedType: ', selectedType);
  console.log('filteredCategories: ', filteredCategories);
  // Add options for each category given in categories array we defined up, for expense and income
  filteredCategories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.name; // Use category name as value
    option.textContent = category.name;
    select.appendChild(option);
  });

  // Add the select element to the form
  const categoryLabel = document.querySelector("form label[for='category']"); // Find the category label
  const categoryDiv = categoryLabel.parentElement; // Get the parent div
  categoryDiv.insertBefore(select, categoryLabel.nextSibling); // Insert before the label's next sibling
}

renderList();
updateTotal();
renderForm();

// event listener to update checkbox category elements every time type changes between expense and income
const typeCheckbox = document.getElementById('type');
typeCheckbox.addEventListener('change', renderForm);

function deleteTransaction(id) {
  const index = transactions.findIndex((trx) => trx.id === id);
  transactions.splice(index, 1);

  updateTotal();
  renderForm();
  saveTransactions();
  renderList();
}

function addTransaction(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const transactionType = formData.get('type') === 'on' ? 'income' : 'expense';

  transactions.push({
    id: transactions.length + 1,
    name: formData.get('name'),
    amount: parseFloat(formData.get('amount')),
    date: new Date(formData.get('date')),
    type: 'on' === formData.get('type') ? 'income' : 'expense',
    // Add category from a select element
    category: formData.get('category'),
  });

  this.reset();

  updateTotal();
  saveTransactions();
  renderForm();
  renderList();
  // Play animations based on transaction type (expense og income)
  const listItem = list.querySelector(`li:last-child`); // Get the newly added list item
  if (transactionType === 'expense') {
    listItem.classList.add('expense-animation');
  } else {
    fireworksContainer.style.display = 'block';
    // call createConfetti function
    createConfetti(70); // Example: create 70 confetti pieces

    // Remove confetti after animation
    setTimeout(() => {
      fireworksContainer.style.display = 'none';
    }, 2000);
  }
}

function saveTransactions() {
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// confetti function
function createConfetti(amount, colors = ['#f0f0f0', '#90EE90', '#FFCCCB']) {
  const container = document.getElementById('fireworks-container');
  container.style.display = 'block';

  for (let i = 0; i < amount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-50px'; // Start confetti above the viewport

    const size = Math.random() * 10 + 5; // Random size between 5px and 15px
    confetti.style.width = size + 'px';
    confetti.style.height = size + 'px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]; // Random color
    confetti.style.borderRadius = '50%';

    container.appendChild(confetti);

    // Animate confetti movement
    confetti.animate(
      [
        { transform: 'translateY(0)', opacity: 1 },
        { transform: `translateY(${window.innerHeight}px)`, opacity: 0 },
      ],
      {
        duration: Math.random() * 2000 + 1000, // Random duration between 1s and 3s
        easing: 'ease-in-out',
      }
    );
  }

  // Remove confetti after animation
  setTimeout(() => {
    container.style.display = 'none';
    container.innerHTML = ''; // Clear confetti elements
  }, 2000); // Wait 2 seconds after animation finishes
}
