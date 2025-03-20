import updateModel from "../utils/updateModel.js";

export default function init(getData) {
  const data = getData();
  const input = document.querySelector("#input-cost");

  const settings = {
    numeral: true,
    numeralThousandsGroupStyle: "thousand",
    delimiter: " ",
  };

  const cleaveInput = new Cleave(input, settings);
  // Set the initial value into the input cost by default
  cleaveInput.setRawValue(data.cost);

  input.addEventListener("input", () => {
    const value = +cleaveInput.getRawValue();

    // Check for min/max range and changing style for error
    if (value < data.minPrice || value > data.maxPrice) {
      input.closest(".param__details").classList.add("param__details--error");
    }

    if (value >= data.minPrice && value <= data.maxPrice) {
      input
        .closest(".param__details")
        .classList.remove("param__details--error");
    }

    updateModel(input, {
      cost: value,
      onUpdate: "inputCost",
    });
  });

  // If overflow min/max range - set the value to min/max
  input.addEventListener("change", () => {
    const value = +cleaveInput.getRawValue();

    if (value > data.maxPrice) {
      cleaveInput.setRawValue(data.maxPrice);
      input
        .closest(".param__details")
        .classList.remove("param__details--error");
    }

    if (value < data.minPrice) {
      cleaveInput.setRawValue(data.minPrice);
      input
        .closest(".param__details")
        .classList.remove("param__details--error");
    }

    updateModel(input, {
      cost: +cleaveInput.getRawValue(),
      onUpdate: "inputCost",
    });
  });

  return cleaveInput;
}
