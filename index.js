// General blocks of calculator
const outputBlock = document.querySelector('.calculator__output');
const resultBlock = document.querySelector('.calculator__result');
const helpersBlock = document.querySelector('.calculator__buttons_top');
const operationsBlock = document.querySelector('.calculator__buttons_right');
const numbersBlock = document.querySelector('.calculator__numbers');
const historyBlock = document.querySelector('.calculator__history');
const recordsBlock = document.querySelector('.calculator__records');

// Buttons of calculator
const helpersButtons = helpersBlock.querySelectorAll('.calculator__button');
const operationsButtons = operationsBlock.querySelectorAll(
  '.calculator__button:not([data-operation="="])',
);
const numbersButtons = numbersBlock.querySelectorAll(
  '.calculator__button:not([data-number="."])',
);
const calculateButton = operationsBlock.querySelector(
  '.calculator__button[data-operation="="]',
);
const floatButton = numbersBlock.querySelector(
  '.calculator__button[data-number="."]',
);
const hideHistoryButton = historyBlock.querySelector(
  '.calculator__history-hide',
);

// History
const calculationsHistory = [];
function addRecord(state) {
  const record = `${state.firstNumber} ${state.operation} ${state.secondNumber} = ${state.result}`;

  calculationsHistory.push(record);

  const recordBlock = document.createElement('li');
  recordBlock.innerText = record;
  recordBlock.classList.add('calculator__record');

  recordsBlock.appendChild(recordBlock);
}

// State
const initialState = { result: null, operation: null, number: null };
let state = { ...initialState };
function resetState() {
  state = { ...initialState };
}

// Results block
function setResult(value) {
  resultBlock.innerText = value;
}

// Helpers
const isFloat = (n) => n % 1 !== 0;

// Handlers
function historyToggleHandler() {
  historyToggleProcess();
}
function operationHandler(event) {
  const operation = event.currentTarget.attributes['data-operation'].value;
  operationProcess(operation);
}
function helperHandler(event) {
  const helper = event.currentTarget.attributes['data-helper'].value;
  helperProcess(helper);
}
function numberHandler(event) {
  const number = event.currentTarget.attributes['data-number'].value;
  numberProcess(number);
}
function operationHandler(event) {
  const operation = event.currentTarget.attributes['data-operation'].value;
  operationProcess(operation);
}
function floatHandler() {
  floatProcess();
}
function calculateHandler() {
  calculateProcess();
}
function keypressHandler(event) {
  const key = event.key.toUpperCase();

  switch (key) {
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '0':
      numberProcess(key);
      break;
    case 'H':
    case 'C':
    case '`':
      helperProcess(key);
      break;
    case '.':
      floatHandler();
      break;
    case '=':
      calculateHandler();
      break;
    case '/':
    case '*':
    case '-':
    case '+':
      operationProcess(key);
      break;
  }
}

// Listeners
helpersButtons.forEach((button) =>
  button.addEventListener('click', helperHandler),
);
operationsButtons.forEach((button) =>
  button.addEventListener('click', operationHandler),
);
numbersButtons.forEach((button) =>
  button.addEventListener('click', numberHandler),
);
calculateButton.addEventListener('click', calculateHandler);
outputBlock.addEventListener('click', historyToggleHandler);
hideHistoryButton.addEventListener('click', historyToggleHandler);
floatButton.addEventListener('click', floatHandler);
window.addEventListener('keypress', keypressHandler);

// Availability checks
function canProcessOperation() {
  if (state.result === 'Infinity') {
    return false;
  }

  return true;
}
function canProcessFloat() {
  if (state.result === null && state.number === null) {
    return false;
  }

  if (state.result !== null && state.result.includes('.')) {
    return false;
  }

  if (state.number !== null && state.number.includes('.')) {
    return false;
  }

  return true;
}
function canProcessCalculations() {
  if (
    state.operation == null ||
    state.number === null ||
    state.result === null
  ) {
    return false;
  }

  if (state.number === 'Infinity' || state.result === 'Infinity') {
    return false;
  }

  return true;
}

// Processors
function historyToggleProcess() {
  historyBlock.classList.toggle('calculator__history_visible');
}
function operationProcess(operation) {
  if (!canProcessOperation()) {
    return;
  }

  if (state.operation) {
    calculateHandler();
    state.number = null;
    state.operation = operation;
  } else {
    state.operation = operation;
    setResult('');
  }
}
function helperProcess(helper) {
  switch (helper) {
    case 'H':
      historyToggleProcess();
      break;
    case 'C':
      resetState();
      setResult(state.number);
      break;
    case '`':
      if (state.number !== null) {
        state.number = String(-Number(state.number));
        setResult(state.number);
      } else if (state.result !== null) {
        state.result = String(-Number(state.result));
        setResult(state.result);
      }
      break;
  }
}
function numberProcess(number) {
  let operatingNumber = !state.operation ? state.result : state.number;

  if (operatingNumber === null || operatingNumber === 'Infinity') {
    operatingNumber = number;
  } else {
    operatingNumber += number;
  }

  if (!state.operation) {
    state.result = operatingNumber;
  } else {
    state.number = operatingNumber;
  }

  setResult(operatingNumber);
}
function floatProcess() {
  if (!canProcessFloat()) {
    return;
  }

  if (state.result !== null && state.number !== null) {
    state.number += '.';
    setResult(state.number);
  } else {
    state.result += '.';
    setResult(state.result);
  }
}
function calculateProcess() {
  if (!canProcessCalculations()) {
    return;
  }

  let result = 0;

  switch (state.operation) {
    case '/':
      if (state.number === '0') {
        result = 'Infinity';
      } else {
        result = Number(state.result) / Number(state.number);
      }
      break;
    case '*':
      result = Number(state.result) * Number(state.number);
      break;
    case '-':
      result = Number(state.result) - Number(state.number);
      break;
    case '+':
      result = Number(state.result) + Number(state.number);
      break;
  }

  addRecord({
    firstNumber: state.result,
    secondNumber: state.number,
    result,
    operation: state.operation,
  });

  state.result =
    result !== 'Infinity' && isFloat(result)
      ? String(result).split('.')[1].length > 5
        ? result.toFixed(5)
        : String(result)
      : String(result);
  state.number = null;
  state.operation = null;
  setResult(state.result);
}
