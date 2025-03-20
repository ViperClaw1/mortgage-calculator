export default function updateMinPayment(data) {
  document.querySelector("#percents-from").innerText =
    data.minPaymentPercents * 100 + "%";
}
