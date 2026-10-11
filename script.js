
/*
  SpendWise — Personal Expense Tracker
  Day 03 | Level 03
  Topic: Conditions & Loops
*/

// STEP 1: Income Data
const salary = "15000";
const freelanceIncome = "5000";

const totalIncome =
  Number(salary) + Number(freelanceIncome);

// STEP 2: Expense Data
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

// STEP 3: Total Expense — for...of
let totalExpense = 0;

for (const amount of expenses) {
  // Skip invalid/negative expense
  if (!Number.isFinite(amount) || amount < 0) {
    continue;
  }

  totalExpense += amount;
}

// STEP 4: Balance Calculation
const balance = totalIncome - totalExpense;

const financialStatus = balance >= 0
  ? "Your balance is healthy"
  : "Warning: You are overspending";

// STEP 5: Monthly Budget Checking
const monthlyBudget = 12000;
const remainingBudget = monthlyBudget - totalExpense;
const budgetPercentage =
  (totalExpense / monthlyBudget) * 100;

let budgetStatus = "";

if (totalExpense > monthlyBudget) {
  budgetStatus = "Over Budget";
} else if (totalExpense === monthlyBudget) {
  budgetStatus = "Budget Fully Used";
} else {
  budgetStatus = "Within Budget";
}

// STEP 6: Expense Category Analysis
let highestExpense = 0;
let highestCategory = "";

for (let i = 0; i < expenses.length; i++) {

  const amount = expenses[i];

  if (!Number.isFinite(amount) || amount < 0) {
    continue;
  }

  // Check category using switch
  let categoryLabel = "";

  switch (categories[i]) {
    case "Rent":
      categoryLabel = "Housing";
      break;

    case "Food":
      categoryLabel = "Food & Dining";
      break;

    case "Transport":
      categoryLabel = "Transportation";
      break;

    case "Shopping":
      categoryLabel = "Shopping";
      break;

    default:
      categoryLabel = "Others";
  }

  // Find highest expense category
  if (amount > highestExpense) {
    highestExpense = amount;
    highestCategory = categoryLabel;
  }

  // Create category UI
  const item = document.createElement("div");
  item.className = "category-item";

  const info = document.createElement("div");
  info.className = "category-info";

  const name = document.createElement("span");
  name.textContent = categoryLabel;

  const value = document.createElement("span");
  value.textContent = `৳ ${amount.toLocaleString("en-BD")}`;

  info.appendChild(name);
  info.appendChild(value);

  const bar = document.createElement("div");
  bar.className = "category-bar";

  const fill = document.createElement("div");
  fill.className = "category-fill";

  const percentage = totalExpense > 0
    ? (amount / totalExpense) * 100
    : 0;

  fill.style.width = `${percentage}%`;

  bar.appendChild(fill);
  item.appendChild(info);
  item.appendChild(bar);

  document.getElementById("category-list")
    .appendChild(item);
}

// STEP 7: Find First Large Expense — break
let firstLargeExpense = "None";

for (let i = 0; i < expenses.length; i++) {
  if (expenses[i] > 4000) {
    firstLargeExpense = categories[i];
    break;
  }
}

// STEP 8: Display Dashboard Values
document.getElementById("income").textContent =
  `৳ ${totalIncome.toLocaleString("en-BD")}`;

document.getElementById("expense").textContent =
  `৳ ${totalExpense.toLocaleString("en-BD")}`;

document.getElementById("balance").textContent =
  `৳ ${balance.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

document.getElementById("balance-status").textContent =
  financialStatus;

// STEP 9: Display Budget Values
document.getElementById("budget-limit").textContent =
  `৳ ${monthlyBudget.toLocaleString("en-BD")}`;

document.getElementById("budget-spent").textContent =
  `৳ ${totalExpense.toLocaleString("en-BD")}`;

document.getElementById("budget-status").textContent =
  budgetStatus;

document.getElementById("budget-remaining").textContent =
  remainingBudget >= 0
    ? `Remaining: ৳ ${remainingBudget.toLocaleString("en-BD")}`
    : `Exceeded by: ৳ ${Math.abs(remainingBudget).toLocaleString("en-BD")}`;

// Cap progress width at 100%
const progressWidth = Math.min(
  Math.max(budgetPercentage, 0),
  100
);

document.getElementById("budget-progress").style.width =
  `${progressWidth}%`;

// Set progress/status colors
if (totalExpense > monthlyBudget) {
  document.getElementById("budget-progress")
    .style.backgroundColor = "#dc2626";

  document.getElementById("budget-status")
    .className = "status-danger";

} else if (totalExpense === monthlyBudget) {
  document.getElementById("budget-progress")
    .style.backgroundColor = "#d97706";

  document.getElementById("budget-status")
    .className = "status-warning";

} else {
  document.getElementById("budget-status")
    .className = "status-good";
}

// STEP 10: Display Highest Category
document.getElementById("top-category").textContent =
  `Highest Expense: ${highestCategory || "None"} — ৳ ${highestExpense.toLocaleString("en-BD")}`;

// Remove initial placeholder
const placeholder = document.querySelector(
  "#category-list > p"
);

if (placeholder) {
  placeholder.remove();
}

// STEP 11: Console Debugging
console.log("===== SPENDWISE DAY 03 =====");
console.log(`Total Income: ${totalIncome}`);
console.log(`Total Expense: ${totalExpense}`);
console.log(`Balance: ${balance}`);
console.log(`Budget Status: ${budgetStatus}`);
console.log(`Budget Used: ${budgetPercentage}%`);
console.log(`Highest Category: ${highestCategory}`);
console.log(`First Expense > 4000: ${firstLargeExpense}`);
