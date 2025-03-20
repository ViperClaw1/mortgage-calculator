import updateModel from "../utils/updateModel.js";

export default function init(getData) {
  const slider = document.querySelector("#slider-cost");
  const data = getData();

  noUiSlider.create(slider, {
    start: data.cost,
    connect: "lower",
    tooltips: true,
    step: 100000,
    range: {
      min: data.minPrice,
      "1%": [400000, 100000], // начиная от 1%, ставим минималку в 400.000 с шагом в 100.000
      "50%": [10000000, 500000],
      max: data.maxPrice,
    },
    format: wNumb({
      decimals: 0,
      thousand: " ",
      suffix: "",
    }),
  });

  slider.noUiSlider.on("slide", () => {
    // Get slider value
    let sliderValue = slider.noUiSlider.get();
    sliderValue = sliderValue.split(".")[0];
    sliderValue = parseInt(String(sliderValue).replace(/ /g, ""));

    updateModel(slider, {
      cost: sliderValue,
      onUpdate: "costSlider",
    });
  });

  return slider;
}
