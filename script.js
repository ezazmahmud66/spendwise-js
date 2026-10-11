
/*
  SpendWise — Personal Expense Tracker
  Day 02 | Level 02: JavaScript Fundamentals
*/

// 1. Income Data
const salary = "15000";
const freelanceIncome = "5000";

// 2. Expense Data
const rent = "5000";
const food = "3000";
const transport = "1200";
const shopping = "1600";

// 3. Explicit Type Conversion
const totalIncome =
  Number(salary) + Number(freelanceIncome);

const totalExpense =
  Number(rent) +
  Number(food) +
  Number(transport) +
  Number(shopping);

// 4. Balance Calculation
let balance = totalIncome - totalExpense;

// 5. Comparison & Logical Operators
const isPositiveBalance = balance >= 0;
const isWithinIncome = totalExpense <= totalIncome;
const isValidData =
  Number.isFinite(totalIncome) &&
  Number.isFinite(totalExpense);

// 6. Truthy / Falsy & Ternary Operator
const status = !isValidData
  ? "Invalid financial data"
  : isPositiveBalance
    ? "Your balance is healthy"
    : "Warning: You are overspending";

// 7. Template Literals
const incomeText = `৳ ${totalIncome.toLocaleString("en-BD")}`;
const expenseText = `৳ ${totalExpense.toLocaleString("en-BD")}`;
const balanceText = `৳ ${balance.toLocaleString("en-BD", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})}`;

// 8. Console Output
console.log("===== SPENDWISE DAY 02 =====");
console.log(`Income: ${incomeText}`);
console.log(`Expense: ${expenseText}`);
console.log(`Balance: ${balanceText}`);
console.log(`Status: ${status}`);
console.log(`Within Income: ${isWithinIncome}`);
console.log(`Valid Data: ${isValidData}`);

// 9. Update Dashboard
document.getElementById("income").textContent = incomeText;
document.getElementById("expense").textContent = expenseText;
document.getElementById("balance").textContent = balanceText;
document.getElementById("balance-status").textContent = status;
