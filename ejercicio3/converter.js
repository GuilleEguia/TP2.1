class Currency {
  constructor(code, name) {
    this.code = code;
    this.name = name;
  }
}

class CurrencyConverter {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.currencies = [];
  }

  async getCurrencies() {
    try {
      const response = await fetch(`${this.apiUrl}/currencies`);
      const data = await response.json();
      console.log(data);
      Object.entries(data).forEach(([code, name]) => {
        this.currencies.push(new Currency(code, name));
      });
    } catch (error) {
      console.error(error);
    }
  }

  async convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    try {
      const response = await fetch(
        `${this.apiUrl}/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await response.json();
      console.log(data.rates);
      return data.rates[toCurrency];
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("conversion-form");
  const resultDiv = document.getElementById("result");
  const fromCurrencySelect = document.getElementById("from-currency");
  const toCurrencySelect = document.getElementById("to-currency");

  const converter = new CurrencyConverter("https://api.frankfurter.app");

  await converter.getCurrencies();
  populateCurrencies(fromCurrencySelect, converter.currencies);
  populateCurrencies(toCurrencySelect, converter.currencies);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    // const amount = parseFloat(document.getElementById("amount").value);
    // const fromCurrency = converter.currencies.find(
    //   (currency) => currency.code === fromCurrencySelect.value
    // );
    // const toCurrency = converter.currencies.find(
    //   (currency) => currency.code === toCurrencySelect.value
    // );

    const convertedAmount = await converter.convertCurrency(
      amount,
      fromCurrency,
      toCurrency
    );

    if (convertedAmount !== null && !isNaN(convertedAmount)) {
      resultDiv.textContent = `${amount} ${fromCurrency} son ${convertedAmount.toFixed(
        2
      )} ${toCurrency}`;
    } else {
      resultDiv.textContent = "Error al realizar la conversión.";
    }
  });

  function populateCurrencies(selectElement, currencies) {
    if (currencies) {
      currencies.forEach((currency) => {
        const option = document.createElement("option");
        option.value = currency.code;
        option.textContent = `${currency.code} - ${currency.name}`;
        selectElement.appendChild(option);
      });
    }
  }
});
