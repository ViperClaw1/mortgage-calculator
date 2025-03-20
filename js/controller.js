import * as Model from "./model.js";
import updateResultsView from "./view/updateResultsView.js";
import programs from "./view/radioProgram.js";
import updateMinPayment from "./view/utils.js";

import costInput from "./view/costInput.js";
import costRange from "./view/costRange.js";

import paymentInput from "./view/paymentInput.js";
import paymentRange from "./view/paymentRange.js";

import timeInput from "./view/timeInput.js";
import timeRange from "./view/timeRange.js";

window.onload = function () {
  const getData = Model.getData;

  // Init programs
  programs(getData);

  // Init cost input
  const cleaveCost = costInput(getData);
  const sliderCost = costRange(getData);

  // Init payment input
  const cleavePayment = paymentInput(getData);
  const sliderPayment = paymentRange(getData);

  // Init time
  const cleaveTime = timeInput(getData);
  const sliderTime = timeRange(getData);

  // launch mortgage recalculation
  Model.setData({});
  const results = Model.getResults();
  updateResultsView(results);

  document.addEventListener("updateForm", (e) => {
    Model.setData(e.detail);

    const data = Model.getData();
    const results = Model.getResults();

    // Update all form view based on model
    updateFormAndSliders(data);

    // Update results block
    updateResultsView(results);
  });

  function updateFormAndSliders(data) {
    // Update radio buttons
    if (data.onUpdate === "radioProgram") {
      updateMinPayment(data);

      // Update payment slider
      sliderPayment.noUiSlider.updateOptions({
        range: {
          min: data.minPaymentPercents * 100,
          max: data.maxPaymentPercents * 100,
        },
      });
    }

    // costInput
    // if update came not from input - update slider
    if (data.onUpdate !== "inputCost") {
      cleaveCost.setRawValue(data.cost);
    }

    // costSlider
    // if update came not from slider - update input
    if (data.onUpdate !== "costSlider") {
      sliderCost.noUiSlider.set(data.cost);
    }

    // paymentInput
    if (data.onUpdate !== "inputPayment") {
      cleavePayment.setRawValue(data.payment);
    }

    // paymentRange
    if (data.onUpdate !== "paymentSlider") {
      sliderPayment.noUiSlider.set(data.paymentPercents * 100);
    }

    // timeRange
    if (data.onUpdate !== "timeSlider") {
      sliderTime.noUiSlider.set(data.time);
    }

    // timeInput
    if (data.onUpdate !== "inputTime") {
      cleaveTime.setRawValue(data.time);
    }
  }

  // Order form
  const openFormBtn = document.querySelector("#openFormBtn");
  const orderForm = document.querySelector("#orderForm");
  const submitFormBtn = document.querySelector("#submitFormBtn");

  openFormBtn.addEventListener("click", () => {
    orderForm.classList.remove("none");
    openFormBtn.classList.add("none");
  });

  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Collect data from form before disabling
    const formData = new FormData(orderForm);
    // console.log(formData.get("name"));
    // console.log(formData.get("email"));
    // console.log(formData.get("phone"));

    // Disable for button and inputs
    submitFormBtn.setAttribute("disabled", true);
    submitFormBtn.innerText = "Заявка отправляется...";

    orderForm.querySelectorAll("input").forEach((input) => {
      input.setAttribute("disabled", true);
    });

    // Send fetch request to server
    fetchData();
    async function fetchData() {
      const data = Model.getData();
      const results = Model.getResults();

      const url = checkOnUrl(document.location.href);
      function checkOnUrl(url) {
        let urlArrayDot = url.split(".");
        if (urlArrayDot[urlArrayDot.length - 1] === "html") {
          urlArrayDot.pop();
          let newUrl = urlArrayDot.join(".");
          let urlArraySlash = newUrl.split("/");
          urlArraySlash.pop();
          newUrl = urlArraySlash.join("/") + "/";
          return newUrl;
        }
        return url;
      }

      const response = await fetch(url + "mail.php", {
        method: "POST",
        headers: {
          "Content-type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          form: {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
          },
          data,
          results,
        }),
      });

      const result = await response.text();
      console.log(result);

      submitFormBtn.removeAttribute("disabled", true);
      submitFormBtn.innerText = "Отправить заявку";

      orderForm.querySelectorAll("input").forEach((input) => {
        input.removeAttribute("disabled", true);
      });

      // clear inputs
      orderForm.reset();
      orderForm.classList.add("none");

      // based on response from server show success/error message
      if (result === "SUCCESS") {
        document.querySelector("#success").classList.remove("none");
      } else {
        document.querySelector("#error").classList.remove("none");
      }

      openFormBtn.classList.remove("none");
    }
  });
};
