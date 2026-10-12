
/*
  SpendWise — Day 05
  Level 5: Arrays & Strings
  Features: Add, Delete, Search, Filter,
            Balance, Budget, Category Analysis
*/

// ========================================
// STEP 1: INITIAL TRANSACTION DATA
// ========================================

let transactions = [
  {
    id: 1,
    title: "Monthly Salary",
    amount: 15000,
    type: "income",
    category: "Salary"
  },
  {
    id: 2,
    title: "Freelance Work",
    amount: 5000,
    type: "income",
    category: "Freelance"
  },
  {
    id: 3,
    title: "House Rent",
    amount: 5000,
    type: "expense",
    category: "Housing"
  },
  {
    id: 4,
    title: "Groceries",
    amount: 3000,
    type: "expense",
    category: "Food"
  },
  {
    id: 5,
    title: "Bus Transport",
    amount: 1200,
    type: "expense",
    category: "Transport"
  },
  {
    id: 6,
    title: "Shopping",
    amount: 1600,
    type: "expense",
    category: "Shopping"
  }
];

const monthlyBudget = 12000;
let nextId = 7;

const allowedCategories = [
  "Food", "Housing", "Transport", "Shopping",
  "Health", "Salary", "Freelance", "Other"
];

// ========================================
// STEP 2: HELPER FUNCTIONS
// ========================================

const formatMoney = amount =>
  `৳ ${amount.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

// Convert text to lowercase for searching
const normalizeText = text =>
  text.trim().toLowerCase();

// ========================================
// STEP 3: FINANCIAL CALCULATIONS
// ========================================

// reduce(): Calculate total by type
function calculateTotal(type) {
  return transactions
    .filter(transaction => transaction.type === type)
    .reduce((total, transaction) => {
      return total + transaction.amount;
    }, 0);
}

function calculateIncome() {
  return calculateTotal("income");
}

function calculateExpense() {
  return calculateTotal("expense");
}

function calculateBalance() {
  return calculateIncome() - calculateExpense();
}

// ========================================
// STEP 4: BUDGET ANALYSIS
// ========================================

function checkBudget() {
  const expense = calculateExpense();
  const remaining = monthlyBudget - expense;
  const percentage = (expense / monthlyBudget) * 100;

  let status = "Within Budget";
  let statusClass = "status-good";

  if (expense > monthlyBudget) {
    status = "Over Budget";
    statusClass = "status-danger";
  } else if (expense === monthlyBudget) {
    status = "Budget Fully Used";
    statusClass = "status-warning";
  }

  return {
    status,
    statusClass,
    remaining,
    percentage
  };
}

// ========================================
// STEP 5: CATEGORY ANALYSIS
// ========================================

function analyzeCategories() {
  const expenseTransactions = transactions.filter(
    transaction => transaction.type === "expense"
  );

  // Extract unique category names
  const categoryNames = [
    ...new Set(
      expenseTransactions.map(
        transaction => transaction.category
      )
    )
  ];

  // Calculate total for each category
  const categoryTotals = categoryNames.map(category => {
    const total = expenseTransactions
      .filter(transaction => {
        return transaction.category === category;
      })
      .reduce((sum, transaction) => {
        return sum + transaction.amount;
      }, 0);

    return {
      name: category,
      amount: total
    };
  });

  // Sort highest first
  categoryTotals.sort((a, b) => b.amount - a.amount);

  // find(): Get first positive expense category
  const highest = categoryTotals.find(
    category => category.amount > 0
  );

  return {
    items: categoryTotals,
    highest: highest || null
  };
}

// ========================================
// STEP 6: TRANSACTION VALIDATION
// ========================================

function validateTransaction(title, amount, type, category) {
  if (!title || !title.trim()) {
    return "Please enter a transaction title.";
  }

  if (title.trim().length > 80) {
    return "Title must be 80 characters or fewer.";
  }

  if (!Number.isFinite(amount) ||
      amount <= 0 ||
      amount > 1000000000) {
    return "Enter a valid amount between 0.01 and 1,000,000,000.";
  }

  if (!Number.isInteger(Math.round(amount * 100))) {
    return "Invalid amount.";
  }

  if (Math.round(amount * 100) / 100 !== amount) {
    return "Only 2 decimal places are allowed.";
  }

  if (type !== "income" && type !== "expense") {
    return "Invalid transaction type.";
  }

  if (!allowedCategories.includes(category)) {
    return "Invalid category.";
  }

  return "";
}

// ========================================
// STEP 7: ADD TRANSACTION — push()
// ========================================

function addTransaction(title, amount, type, category) {
  const error = validateTransaction(
    title, amount, type, category
  );

  if (error) {
    return error;
  }

  const newTransaction = {
    id: nextId,
    title: title.trim(),
    amount: amount,
    type: type,
    category: category
  };

  transactions.push(newTransaction);
  nextId++;

  renderDashboard();

  return "";
}

// ========================================
// STEP 8: DELETE TRANSACTION — filter()
// ========================================

function deleteTransaction(id) {
  const exists = transactions.some(
    transaction => transaction.id === id
  );

  if (!exists) {
    return;
  }

  transactions = transactions.filter(
    transaction => transaction.id !== id
  );

  renderDashboard();
}

// ========================================
// STEP 9: SEARCH & FILTER
// ========================================

function getFilteredTransactions() {
  const searchText = normalizeText(
    document.getElementById("search-input").value
  );

  const selectedType =
    document.getElementById("filter-type").value;

  const selectedCategory =
    document.getElementById("filter-category").value;

  return transactions.filter(transaction => {
    // Search by title or category
    const matchesSearch =
      normalizeText(transaction.title).includes(searchText) ||
      normalizeText(transaction.category).includes(searchText);

    // Filter by income / expense
    const matchesType =
      selectedType === "all" ||
      transaction.type === selectedType;

    // Filter by category
    const matchesCategory =
      selectedCategory === "all" ||
      transaction.category === selectedCategory;

    return matchesSearch &&
           matchesType &&
           matchesCategory;
  });
}

// ========================================
// STEP 10: RENDER FINANCIAL SUMMARY
// ========================================

function renderSummary() {
  const income = calculateIncome();
  const expense = calculateExpense();
  const balance = calculateBalance();

  document.getElementById("income").textContent =
    formatMoney(income);

  document.getElementById("expense").textContent =
    formatMoney(expense);

  document.getElementById("balance").textContent =
    formatMoney(balance);

  document.getElementById("balance-status").textContent =
    balance >= 0
      ? "Your balance is healthy"
      : "Warning: You are overspending";
}

// ========================================
// STEP 11: RENDER BUDGET
// ========================================

function renderBudget() {
  const budget = checkBudget();
  const expense = calculateExpense();

  document.getElementById("budget-limit").textContent =
    formatMoney(monthlyBudget);

  document.getElementById("budget-spent").textContent =
    formatMoney(expense);

  const statusElement =
    document.getElementById("budget-status");

  statusElement.textContent = budget.status;
  statusElement.className = budget.statusClass;

  document.getElementById("budget-remaining").textContent =
    budget.remaining >= 0
      ? `Remaining: ${formatMoney(budget.remaining)}`
      : `Exceeded by: ${formatMoney(Math.abs(budget.remaining))}`;

  const progress =
    document.getElementById("budget-progress");

  progress.style.width =
    `${Math.min(Math.max(budget.percentage, 0), 100)}%`;

  progress.style.backgroundColor =
    budget.status === "Over Budget"
      ? "#dc2626"
      : budget.status === "Budget Fully Used"
        ? "#d97706"
        : "#168765";
}

// ========================================
// STEP 12: RENDER CATEGORY ANALYSIS
// ========================================

function renderCategories() {
  const analysis = analyzeCategories();
  const expenseTotal = calculateExpense();

  const container =
    document.getElementById("category-list");

  container.replaceChildren();

  if (analysis.items.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No expense data available.";
    container.appendChild(message);
  }

  analysis.items.forEach(category => {
    const item = document.createElement("div");
    item.className = "category-item";

    const info = document.createElement("div");
    info.className = "category-info";

    const name = document.createElement("span");
    name.textContent = category.name;

    const amount = document.createElement("span");
    amount.textContent = formatMoney(category.amount);

    info.appendChild(name);
    info.appendChild(amount);

    const bar = document.createElement("div");
    bar.className = "category-bar";

    const fill = document.createElement("div");
    fill.className = "category-fill";

    const percentage = expenseTotal > 0
      ? (category.amount / expenseTotal) * 100
      : 0;

    fill.style.width = `${percentage}%`;

    bar.appendChild(fill);
    item.appendChild(info);
    item.appendChild(bar);
    container.appendChild(item);
  });

  const topCategory =
    document.getElementById("top-category");

  if (analysis.highest) {
    topCategory.textContent =
      `Highest Expense: ${analysis.highest.name} — ` +
      formatMoney(analysis.highest.amount);
  } else {
    topCategory.textContent = "Highest Expense: None";
  }
}

// ========================================
// STEP 13: RENDER TRANSACTION LIST
// ========================================

function renderTransactions() {
  const filtered = getFilteredTransactions();

  const container =
    document.getElementById("transaction-list");

  container.replaceChildren();

  document.getElementById("transaction-count").textContent =
    `${filtered.length} of ${transactions.length} Transactions`;

  if (filtered.length === 0) {
    const message = document.createElement("p");
    message.className = "empty-state";
    message.textContent = "No matching transactions found.";
    container.appendChild(message);
    return;
  }

  filtered.forEach(transaction => {
    const item = document.createElement("div");
    item.className = "transaction-item";

    // Left: title and category
    const details = document.createElement("div");
    details.className = "transaction-details";

    const title = document.createElement("h4");
    title.textContent = transaction.title;

    const subtitle = document.createElement("p");
    subtitle.textContent =
      `${transaction.category} • ${transaction.type}`;

    details.appendChild(title);
    details.appendChild(subtitle);

    // Right: amount and delete button
    const right = document.createElement("div");
    right.className = "transaction-right";

    const amount = document.createElement("span");
    amount.className =
      "transaction-amount " +
      (transaction.type === "income"
        ? "amount-income"
        : "amount-expense");

    const prefix = transaction.type === "income" ? "+" : "−";

    amount.textContent =
      `${prefix} ${formatMoney(transaction.amount)}`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";

    deleteButton.setAttribute(
      "aria-label",
      `Delete transaction: ${transaction.title}`
    );

    deleteButton.addEventListener("click", () => {
      deleteTransaction(transaction.id);
    });

    right.appendChild(amount);
    right.appendChild(deleteButton);

    item.appendChild(details);
    item.appendChild(right);

    container.appendChild(item);
  });
}

// ========================================
// STEP 14: UPDATE COMPLETE DASHBOARD
// ========================================

function renderDashboard() {
  renderSummary();
  renderBudget();
  renderCategories();
  renderTransactions();
}

// ========================================
// STEP 15: FORM SUBMIT EVENT
// ========================================

const transactionForm =
  document.getElementById("transaction-form");

transactionForm.addEventListener("submit", event => {
  event.preventDefault();

  const title =
    document.getElementById("title").value;

  const amount =
    Number(document.getElementById("amount").value);

  const type =
    document.getElementById("type").value;

  const category =
    document.getElementById("category").value;

  const error = addTransaction(
    title, amount, type, category
  );

  const message =
    document.getElementById("form-message");

  if (error) {
    message.textContent = error;
    message.className = "status-danger";
    return;
  }

  message.textContent = "Transaction added successfully!";
  message.className = "status-good";

  transactionForm.reset();
});

// ========================================
// STEP 16: SEARCH & FILTER EVENTS
// ========================================

document.getElementById("search-input")
  .addEventListener("input", renderTransactions);

document.getElementById("filter-type")
  .addEventListener("change", renderTransactions);

document.getElementById("filter-category")
  .addEventListener("change", renderTransactions);

// ========================================
// STEP 17: INITIALIZE APPLICATION
// ========================================

renderDashboard();

console.log("===== SPENDWISE DAY 05 =====");
console.log("Initial Transactions:", transactions.length);
console.log("Income:", calculateIncome());
console.log("Expense:", calculateExpense());
console.log("Balance:", calculateBalance());
console.log("SpendWise is ready!");
