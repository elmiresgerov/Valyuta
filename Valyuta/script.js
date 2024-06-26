let currencyButtons1 = document.querySelectorAll(".currency-first button");
let currencyButtons2 = document.querySelectorAll(".currency-second button");

document
  .querySelector(".currency-first button.right-rub")
  .classList.add("selected");
document
  .querySelector(".currency-second button.left-usd")
  .classList.add("selected");

currencyButtons1.forEach(function (button) {
  button.addEventListener("click", function () {
    currencyButtons1.forEach(function (btn) {
      btn.classList.remove("selected");
    });
    button.classList.add("selected");
    updateExchangeRate();
  });
});

currencyButtons2.forEach(function (button) {
  button.addEventListener("click", function () {
    currencyButtons2.forEach(function (btn) {
      btn.classList.remove("selected");
    });
    button.classList.add("selected");
    updateConvertedAmount(
      "amount-one",
      "amount-two",
      ".currency-first button.selected",
      ".currency-second button.selected",
      ".rate2"
    );
  });
});

document.getElementById("amount-one").addEventListener("input", function () {
  updateConvertedAmount(
    "amount-one",
    "amount-two",
    ".currency-first button.selected",
    ".currency-second button.selected",
    ".rate2"
  );
});

document.getElementById("amount-two").addEventListener("input", function () {
  updateConvertedAmount(
    "amount-two",
    "amount-one",
    ".currency-second button.selected",
    ".currency-first button.selected",
    ".rate"
  );
});

updateExchangeRate();

function updateExchangeRate() {
  let toCurrency = document.querySelector(
    ".currency-second button.selected"
  ).textContent;
  let fromCurrency = document.querySelector(
    ".currency-first button.selected"
  ).textContent;

  let apiKey = "dea2e6123933d630b4b61bee";
  let apiUrl = `https://open.er-api.com/v6/latest/${fromCurrency}?apikey=${apiKey}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      let exchangeRate = data.rates[toCurrency];
      let rateElement = document.querySelector(".rate");
      let rateElement2 = document.querySelector(".rate2");
      rateElement2.textContent = `1 ${toCurrency} = ${exchangeRate} ${fromCurrency}`;
      rateElement.textContent = `1 ${fromCurrency} = ${exchangeRate} ${toCurrency}`;

      updateConvertedAmount(
        "amount-one",
        "amount-two",
        ".currency-first button.selected",
        ".currency-second button.selected",
        ".rate2"
      );
    })
    .catch((error) => {
      console.error("Error fetching exchange rates:", error);
      document.querySelector(".error-message").textContent =
        "Something went wrong. Please check your internet connection and try again.";
    });
}

function updateConvertedAmount(
  fromInputId,
  toInputId,
  fromCurrencySelector,
  toCurrencySelector,
  rateElementSelector
) {
  let amountFrom = document.getElementById(fromInputId).value;
  let toCurrency = document.querySelector(toCurrencySelector).textContent;
  let fromCurrency = document.querySelector(fromCurrencySelector).textContent;

  let apiKey = "dea2e6123933d630b4b61bee";
  let apiUrl = `https://open.er-api.com/v6/latest/${fromCurrency}?apikey=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      let exchangeRate = data.rates[toCurrency];
      let convertedAmount = (isNaN(amountFrom) ? 0 : amountFrom) * exchangeRate;
      let toInputElement = document.getElementById(toInputId);
      toInputElement.value = convertedAmount.toFixed(4);

      if (toInputElement.value == 0.0) {
        toInputElement.value = "";
      }

      document.querySelector(
        rateElementSelector
      ).textContent = `1 ${fromCurrency} = ${exchangeRate.toFixed(
        4
      )} ${toCurrency}`;
    })
    .catch((error) => console.error("Error fetching exchange rates:", error));
}
