import updateModel from "../utils/updateModel.js";

export default function init(getData) {
  const data = getData();
  const input = document.querySelector("#input-term");

  const settings = {
    numeral: true,
    numeralThousandsGroupStyle: "thousand",
    delimiter: " ",
  };

  const cleaveInput = new Cleave(input, settings);
  cleaveInput.setRawValue(data.time);

  input.addEventListener("input", () => {
    const value = +cleaveInput.getRawValue();

    // Check for min/max range and changing style for error
    if (value < data.minYear || value > data.maxYear) {
      input.closest(".param__details").classList.add("param__details--error");
    }

    if (value >= data.minYear && value <= data.maxYear) {
      input
        .closest(".param__details")
        .classList.remove("param__details--error");
    }

    updateModel(input, {
      time: value,
      onUpdate: "inputTime",
    });
  });

  // If overflow min/max range - set the value to min/max
  input.addEventListener("change", () => {
    const value = +cleaveInput.getRawValue();

    if (value > data.maxYear) {
      cleaveInput.setRawValue(data.maxYear);
      input
        .closest(".param__details")
        .classList.remove("param__details--error");
    }

    if (value < data.minYear) {
      cleaveInput.setRawValue(data.minYear);
      input
        .closest(".param__details")
        .classList.remove("param__details--error");
    }

    updateModel(input, {
      time: +cleaveInput.getRawValue(),
      onUpdate: "inputTime",
    });
  });

  return cleaveInput;
}
