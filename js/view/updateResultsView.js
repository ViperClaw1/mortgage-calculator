import {
  priceFormatter,
  priceFormatterDecimals,
} from "./../utils/formatter.js";

export default function updateResultsView(results) {
  document.querySelector("#total-percent").innerHTML = results.rate * 100 + "%";
  document.querySelector("#total-month-payment").innerHTML =
    priceFormatterDecimals.format(results.monthPayment);
  document.querySelector("#total-cost").innerHTML = priceFormatter.format(
    results.totalAmount
  );
  document.querySelector("#total-overpayment").innerHTML =
    priceFormatterDecimals.format(results.overPayment);
}
