import updateModel from "../utils/updateModel.js";

export default function init(getData) {
  const input = document.querySelector("#input-downpayment");

  const settings = {
    numeral: true,
    numeralThousandsGroupStyle: "thousand",
    delimiter: " ",
  };

  const cleaveInput = new Cleave(input, settings);
  cleaveInput.setRawValue(getData().payment);

  input.addEventListener("input", () => {
    const value = +cleaveInput.getRawValue();

    // Check for min/max range first payment
    if (
      value < getData().getMinPayment() ||
      value > getData().getMaxPayment()
    ) {
      input.closest(".param__details").classList.add("param__details--error");
    }

    if (
      value >= getData().getMinPayment() &&
      value <= getData().getMaxPayment()
    ) {
      input
        .closest(".param__details")
        .classList.remove("param__details--error");
    }

    updateModel(input, {
      payment: value,
      onUpdate: "inputPayment",
    });
  });

  // If overflow min/max range - set the value to min/max
  input.addEventListener("change", () => {
    const value = +cleaveInput.getRawValue();

    if (value > getData().getMaxPayment()) {
      cleaveInput.setRawValue(getData().getMaxPayment());
      input
        .closest(".param__details")
        .classList.remove("param__details--error");
    }

    if (value < getData().getMinPayment()) {
      cleaveInput.setRawValue(getData().getMinPayment());
      input
        .closest(".param__details")
        .classList.remove("param__details--error");
    }

    updateModel(input, {
      payment: value,
      onUpdate: "inputPayment",
    });
  });

  return cleaveInput;
}
