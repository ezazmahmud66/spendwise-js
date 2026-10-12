
/*
  SpendWise — Day 04
  Level 4: Functions & Scope
  Vanilla JavaScript
*/

// ========================================
// STEP 1: SAMPLE DATA
// ========================================

const incomeSources = [15000, 5000];

const categories = [
  "Rent",
  "Food",
  "Transport",
  "Shopping"
];

const expenses = [
  5000,
  3000,
  1200,
  1600
];

const monthlyBudget = 12000;


// ========================================
// STEP 2: HELPER FUNCTIONS
// ========================================

// Arrow Function: Currency Formatting
const formatMoney = (amount) => {
  return `৳ ${amount.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

// Reusable Sum Function
function calculateTotal(amounts) {
  let total = 0;

  for (const amount of amounts) {
    if (!Number.isFinite(amount) || amount < 0) {
      continue;
    }

    total += amount;
  }

  return total;
}


// ========================================
// STEP 3: FINANCIAL CALCULATIONS
// ========================================

function calculateIncome(incomes) {
  return calculateTotal(incomes);
}

function calculateExpense(expenseList) {
  return calculateTotal(expenseList);
}

function calculateBalance(income, expense) {
  return income - expense;
}


// ========================================
// STEP 4: BUDGET CHECKING
// ========================================

function checkBudget(expense, budget) {
  let status = "";
  let statusClass = "";

  if (expense > budget) {
    status = "Over Budget";
    statusClass = "status-danger";

  } else if (expense === budget) {
    status = "Budget Fully Used";
    statusClass = "status-warning";

  } else {
    status = "Within Budget";
    statusClass = "status-good";
  }

  const remaining = budget - expense;

  const percentage = budget > 0
    ? (expense / budget) * 100
    : 0;

  return {
    status: status,
    statusClass: statusClass,
    remaining: remaining,
    percentage: percentage
  };
}


// ========================================
// STEP 5: EXPENSE CATEGORY ANALYSIS
// ========================================

function getCategoryLabel(category) {
  switch (category) {
    case "Rent":
      return "Housing";

    case "Food":
      return "Food & Dining";

    case "Transport":
      return "Transportation";

    case "Shopping":
      return "Shopping";

    default:
      return "Others";
  }
}

function analyzeCategories(names, amounts) {
  const result = [];

  let highestAmount = 0;
  let highestCategory = "None";

  for (let i = 0; i < amounts.length; i++) {
    const amount = amounts[i];

    if (!Number.isFinite(amount) || amount < 0) {
      continue;
    }

    const label = getCategoryLabel(names[i]);

    result.push({
      name: label,
      amount: amount
    });

    if (amount > highestAmount) {
      highestAmount = amount;
      highestCategory = label;
    }
  }

  return {
    items: result,
    highestAmount: highestAmount,
    highestCategory: highestCategory
  };
}


// ========================================
// STEP 6: CLOSURE EXAMPLE
// ========================================

// Private Savings State
function createSavingsTracker(initialSavings = 0) {
  let savings = initialSavings;

  return function(amount = 0) {
    if (!Number.isFinite(amount) || amount < 0) {
      return savings;
    }

    savings += amount;
    return savings;
  };
}

const trackSavings = createSavingsTracker();


// ========================================
// STEP 7: CALLBACK FUNCTION
// ========================================

function processFinancialData(callback) {
  const income = calculateIncome(incomeSources);
  const expense = calculateExpense(expenses);
  const balance = calculateBalance(income, expense);

  const budget = checkBudget(expense, monthlyBudget);

  const categoryAnalysis = analyzeCategories(
    categories,
    expenses
  );

  const data = {
    income: income,
    expense: expense,
    balance: balance,
    budget: budget,
    categoryAnalysis: categoryAnalysis
  };

  callback(data);
}


// ========================================
// STEP 8: UI RENDERING
// ========================================

function renderDashboard(data) {
  // Node.js has no document object
  if (typeof document === "undefined") {
    return;
  }

  const incomeElement = document.getElementById("income");
  const expenseElement = document.getElementById("expense");
  const balanceElement = document.getElementById("balance");

  incomeElement.textContent = formatMoney(data.income);
  expenseElement.textContent = formatMoney(data.expense);
  balanceElement.textContent = formatMoney(data.balance);

  const balanceStatus = document.getElementById(
    "balance-status"
  );

  balanceStatus.textContent = data.balance >= 0
    ? "Your balance is healthy"
    : "Warning: You are overspending";

  // Budget Information
  document.getElementById("budget-limit").textContent =
    formatMoney(monthlyBudget);

  document.getElementById("budget-spent").textContent =
    formatMoney(data.expense);

  const budgetStatus = document.getElementById(
    "budget-status"
  );

  budgetStatus.textContent = data.budget.status;
  budgetStatus.className = data.budget.statusClass;

  const remainingElement = document.getElementById(
    "budget-remaining"
  );

  remainingElement.textContent = data.budget.remaining >= 0
    ? `Remaining: ${formatMoney(data.budget.remaining)}`
    : `Exceeded by: ${formatMoney(Math.abs(data.budget.remaining))}`;

  // Budget Progress Bar
  const progress = document.getElementById(
    "budget-progress"
  );

  const progressWidth = Math.min(
    Math.max(data.budget.percentage, 0),
    100
  );

  progress.style.width = `${progressWidth}%`;

  progress.style.backgroundColor =
    data.budget.status === "Over Budget"
      ? "#dc2626"
      : data.budget.status === "Budget Fully Used"
        ? "#d97706"
        : "#168765";

  // Category Analysis
  const categoryList = document.getElementById(
    "category-list"
  );

  categoryList.replaceChildren();

  for (const category of data.categoryAnalysis.items) {
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

    const percentage = data.expense > 0
      ? (category.amount / data.expense) * 100
      : 0;

    fill.style.width = `${percentage}%`;

    bar.appendChild(fill);
    item.appendChild(info);
    item.appendChild(bar);

    categoryList.appendChild(item);
  }

  if (data.categoryAnalysis.items.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No valid expenses available.";
    categoryList.appendChild(emptyMessage);
  }

  // Highest Expense
  document.getElementById("top-category").textContent =
    `Highest Expense: ${data.categoryAnalysis.highestCategory} — ${formatMoney(data.categoryAnalysis.highestAmount)}`;
}


// ========================================
// STEP 9: CONSOLE REPORT
// ========================================

function printFinancialReport(data) {
  console.log("===== SPENDWISE DAY 04 =====");

  console.log(`Income: ${formatMoney(data.income)}`);
  console.log(`Expense: ${formatMoney(data.expense)}`);
  console.log(`Balance: ${formatMoney(data.balance)}`);

  console.log(`Budget Status: ${data.budget.status}`);

  console.log(
    `Budget Used: ${data.budget.percentage.toFixed(2)}%`
  );

  console.log(
    `Highest Category: ${data.categoryAnalysis.highestCategory}`
  );
}


// ========================================
// STEP 10: RUN THE APPLICATION
// ========================================

// Callback 1: Render Dashboard
processFinancialData(renderDashboard);

// Callback 2: Print Console Report
processFinancialData(printFinancialReport);

// Closure Demonstration
console.log("===== SAVINGS TRACKER =====");
console.log(formatMoney(trackSavings(500)));
console.log(formatMoney(trackSavings(1000)));
console.log(formatMoney(trackSavings(1500)));
