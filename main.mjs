import { readFileSync, writeFileSync } from "fs";

function convArrToObj(array) {
  var thisEleObj = new Object();
  if (typeof array == "object") {
    for (var i in array) {
      var thisEle = convArrToObj(array[i]);
      thisEleObj[i] = thisEle;
    }
  } else {
    thisEleObj = array;
  }
  return thisEleObj;
}

function getBalance(revenueData, expenseData) {
  const balance = [];
  for (let i = 0; i < revenueData.length; i++) {
    const revenue = revenueData[i];
    const month = revenue.startDate;
    if (!balance[month]) {
      balance[month] = {
        amount: 0,
        startDate: month,
      };
    }
    balance[month].amount += revenue.amount;
  }
  for (let i = 0; i < expenseData.length; i++) {
    const expense = expenseData[i];
    const month = expense.startDate;
    if (!balance[month]) {
      balance[month] = {
        amount: 0,
        startDate: month,
      };
    }
    balance[month].amount -= expense.amount;
  }

  const res = Object.values(balance);

  var oldJSONStringify = JSON.stringify;
  JSON.stringify = function (balance) {
    if (oldJSONStringify(balance) == "[]")
      return oldJSONStringify(convArrToObj(balance));
    else return oldJSONStringify(balance);
  };

  const output = JSON.stringify(res);

  return output;
}

function main() {
  const input = readFileSync("input.json", "utf8");
  const jsonData = JSON.parse(input);

  const revenueData = jsonData.revenueData;
  const expenseData = jsonData.expenseData;

  const balance = getBalance(revenueData, expenseData);

  console.log("balance: " + balance);

  writeFileSync("output.json", balance, "utf8");
}

main();
