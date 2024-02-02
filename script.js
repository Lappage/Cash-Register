const form = document.getElementById("form");
const input = document.getElementById("cash");
const changeInDrawer = document.querySelector(".change");
const changeHTML = document.getElementById("change-owed");
const changeLabels = document.getElementById("change-labels");
const changeDiv = document.getElementById("cashback");
const priceDisplay = document.querySelector(".small-screen");
const stupidDiv = document.getElementById("change-due");
let currentStatus = ["STATUS", "OPEN"];
let price = 19.5;
let cid = [
  ["PENNY", 0.01],
  ["NICKEL", 0],
  ["DIME", 0],
  ["QUARTER", 0],
  ["ONE", 1],
  ["FIVE", 0],
  ["TEN", 0],
  ["TWENTY", 0],
  ["ONE HUNDRED", 0],
];

// let cid = [
//   ["PENNY", 1.01],
//   ["NICKEL", 2.05],
//   ["DIME", 3.1],
//   ["QUARTER", 4.25],
//   ["ONE", 90],
//   ["FIVE", 55],
//   ["TEN", 20],
//   ["TWENTY", 60],
//   ["ONE HUNDRED", 100],
// ];

let result = [
  ["ONE HUNDRED", 0],
  ["TWENTY", 0],
  ["TEN", 0],
  ["FIVE", 0],
  ["ONE", 0],
  ["QUARTER", 0],
  ["DIME", 0],
  ["NICKEL", 0],
  ["PENNY", 0],
];

const displayChange = () => {
  stupidDiv.innerHTML = `<p>${currentStatus[0]}: ${currentStatus[1]}</p>`;

  for (let i = 0; i < 9; i++) {
    if (result[i][1] !== 0) {
      stupidDiv.innerHTML += `<p>${result[i][0]}: $${result[i][1]}</p>`;
    }
  }

  changeInDrawer.innerHTML = `
<p>$${cid[0][1]}</p>
<p>$${cid[1][1]}</p>
<p>$${cid[2][1]}</p>
<p>$${cid[3][1]}</p>
<p>$${cid[4][1]}</p>
<p>$${cid[5][1]}</p>
<p>$${cid[6][1]}</p>
<p>$${cid[7][1]}</p>
<p>$${cid[8][1]}</p>
`;

  priceDisplay.innerHTML = `
<h5>Total: $${price}</h5>`;
};

const CalculateChange = () => {
  let cash = Number(input.value);
  let changeDue = cash - price;
  let reversedCIDArray = [...cid].reverse();
  let currencyTypes = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
  let totalCashInDraw = cid
    .map((total) => {
      return total[1];
    })
    .reduce((acc, curr) => {
      return parseFloat((acc + curr).toFixed(2));
    });

  if (!input.value.trim()) {
    alert("Please enter a value");
    return;
  }

  if (cash === price) {
    stupidDiv.innerHTML = ``;
    stupidDiv.innerHTML = `
    <h4 style="text-align: center;">No change due - customer paid with exact cash</h4>`;
    changeDiv.classList.remove("hidden");
    return;
  } else if (input.value < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  if (totalCashInDraw < changeDue) {
    stupidDiv.innerHTML = ``;
    stupidDiv.innerHTML = `
    <h4 style="text-align: center;">Status: INSUFFICIENT_FUNDS</h4>`;
    return;
  }

  if (totalCashInDraw === changeDue) {
    currentStatus[1] = "CLOSED";
    result = cid;
    displayChange();
    return;
  }

  for (let i = 0; i < reversedCIDArray.length; i++) {
    let count = 0;
    let total = reversedCIDArray[i][1];

    while (total > 0 && changeDue >= currencyTypes[i]) {
      total -= currencyTypes[i];
      changeDue = parseFloat((changeDue -= currencyTypes[i])).toFixed(2);
      count++;
    }

    result[i][1] = count * currencyTypes[i];
    reversedCIDArray[i][1] = parseFloat(total.toFixed(2));
  }

  if (changeDue > 0) {
    stupidDiv.innerHTML = `
    <h4 style="text-align: center;">Status: INSUFFICIENT_FUNDS</h4>`;
    return;
  }

  cid = [...reversedCIDArray].reverse();
  displayChange();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log();
  CalculateChange();
  form.reset();
});
