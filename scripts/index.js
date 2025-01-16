const refDOM = {
  display: document.querySelector("#display"),
  buttons: document.querySelectorAll(".button"),
};

const operations = {
  add: () => data.x + data.y,
  subtract: () => data.x - data.y,
  multiply: () => data.x * data.y,
  divide: () => data.x / data.y,
  power: () => data.x ** data.y,
  root: () => data.y ** (1 / data.x),
  doOperation: () => {
    let result = null;

    if (data.operator === "+") {
      result = operations.add();
    } else if (data.operator === "-") {
      result = operations.subtract();
    } else if (data.operator === "\u00D7") {
      result = operations.multiply();
    } else if (data.operator === "\u00F7") {
      result = operations.divide();
    } else if (data.operator === "^") {
      result = operations.power();
    } else if (data.operator === "√") {
      result = operations.root();
    }

    if (String(result).includes(".") && String(result).length > 6) {
      data.input = String(result.toFixed(4));
    } else {
      data.input = String(result);
    }
  },
};

const data = {
  input: "",
  x: 0,
  y: 0,
  operator: null,
  separator: false,
};

for (let i = 0; i < refDOM.buttons.length; i++) {
  refDOM.buttons[i].addEventListener("click", (e) => clickHandler(e));
}

function clear() {
  data.input = "";
  data.x = 0;
  data.y = 0;
  data.operator = null;
  data.separator = false;
}

function firstClick(e) {
  if (e.target.textContent === "-") {
    data.input = "-";
  } else if (e.target.textContent === ".") {
    data.input = "0.";
    data.separator = true;
  }
}

function handleNumber(e) {
  if (data.input === "0") {
    data.input = e.target.textContent;
  } else if (data.input === "-0") {
    data.input = `-${e.target.textContent}`;
  } else {
    data.input += e.target.textContent;
  }
}

function inputSplitter(input) {
  let x = "";
  let y = "";

  for (let i = 0; i < input.length; i++) {
    if (i < input.indexOf(data.operator)) {
      x += input[i];
    } else if (i > input.indexOf(data.operator)) {
      y += input[i];
    }
  }

  if (x.includes(".") || y.includes(".")) {
    data.x = parseFloat(x);
    data.y = parseFloat(y);
  } else {
    data.x = parseInt(x);
    data.y = parseInt(y);
  }
}

function operatorParser(input) {
  let operator = null;

  if (input === "x√y") {
    operator = "√";
  } else if (input === "xy") {
    operator = "^";
  } else {
    operator = input;
  }

  return operator;
}

function handleAction(e) {
  if (data.input === "") {
    firstClick(e);
  } else {
    if (e.target.textContent === "AC") {
      clear();
    } else if (e.target.textContent === "\u2190") {
      if (data.input.slice(-1) === ".") {
        data.separator = false;
      } else if (data.input.slice(-1) === data.operator) {
        data.operator = null;

        if (data.input.includes(".")) {
          data.separator = true;
        }
      }

      data.input = data.input.slice(0, data.input.length - 1);
    } else if (e.target.textContent === "=") {
      if (
        data.input.slice(-1) !== data.operator &&
        data.input.slice(-1) !== "."
      ) {
        inputSplitter(data.input);
        operations.doOperation();
      } else {
        data.input = data.input.slice(0, data.input.length - 1);
      }

      if (data.input.includes(".")) {
        data.separator = true;
      } else {
        data.separator = false;
      }

      data.operator = null;
    } else if (e.target.textContent === ".") {
      if (!data.separator && !isNaN(parseInt(data.input.slice(-1)))) {
        data.input += e.target.textContent;
        data.separator = true;
      }
    } else {
      if (data.input !== "-" && data.input.slice(-1) !== ".") {
        const operator = operatorParser(e.target.textContent);

        if (data.operator === null) {
          data.operator = operator;
          data.input += data.operator;
        } else {
          if (data.input.slice(-1) === data.operator) {
            data.operator = operator;
            data.input = `${data.input.slice(0, data.input.length - 1)}${
              data.operator
            }`;
          } else {
            inputSplitter(data.input);
            operations.doOperation();
            data.operator = operator;
            data.input += data.operator;
          }
        }

        data.separator = false;
      }
    }
  }
}

function clickHandler(e) {
  if (!isNaN(parseInt(e.target.textContent))) {
    handleNumber(e);
  } else {
    handleAction(e);
  }

  refDOM.display.textContent = data.input;
}
