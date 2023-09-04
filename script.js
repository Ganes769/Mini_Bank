'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (mov, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? mov.slice().sort((a, b) => a - b) : mov;
  movs.forEach((element, i) => {
    const type = element > 0 ? `deposit` : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">4 month age</div>
    <div class="movements__value">${element}</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// computing username:

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (user) {
        return user[0];
      })
      .join('');
  });
};
createUsername(accounts);
// console.log(accounts);

// const arr = [1, 3, 4, 5, 6, 0, -1, -5];
// const newa = arr.map(function (arr) {
//   return arr * 80;
// });
// // console.log(newa);
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov);
  labelBalance.textContent = `${acc.balance} EUR`;
};

const calcDisplaySummery = function (acc) {
  const inbalance = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur);
  labelSumIn.textContent = `${inbalance}`;
  const outbalance = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur);
  labelSumOut.textContent = `${Math.abs(outbalance)}`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => mov * acc.interestRate)
    .reduce((acc, cur) => acc + cur);
  labelSumInterest.textContent = `${interest}`;
};

//login functionality:
let curentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  curentAccount = accounts.find(
    acc => acc.username == inputLoginUsername.value
  );
  if (curentAccount.pin == Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginUsername.blur();
    labelWelcome.textContent = `Welcom,Back ${curentAccount.owner} `;

    displayMovements(curentAccount.movements);
    calcDisplayBalance(curentAccount);
    calcDisplaySummery(curentAccount);
  }
});

//Transfering Money:
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = inputTransferAmount.value;
  const recieverAccc = accounts.find(
    acc => acc.username == inputTransferTo.value
  );

  if (
    amount > 0 &&
    curentAccount.balance > amount &&
    recieverAccc.username !== curentAccount.username
  ) {
    curentAccount.movements.push(-amount);
    recieverAccc.movements.push(amount);
  }
  displayMovements(curentAccount.movements);
  calcDisplayBalance(curentAccount);
  calcDisplaySummery(curentAccount);
});

//Request loan:
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (loanAmount > 0) {
    const requestLoan = function (acc) {
      console.log(acc);
      acc.movements.push(loanAmount);
      console.log(acc.movements);
    };
    requestLoan(curentAccount);
    displayMovements(curentAccount.movements);
    calcDisplayBalance(curentAccount);
    calcDisplaySummery(curentAccount);
  }
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value == curentAccount.username &&
    inputClosePin.value == curentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username == curentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(curentAccount.movements, true);
});
//Implementing Dates:
const now = new Date();
const day = now.getDay();
const month = now.getMonth();
const year = now.getFullYear();
labelDate.textContent = `As of ${day}/${month}/${year}`;
