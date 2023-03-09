// Derived from https://github.com/marcusolsson/grafana-plugin-support

import { DisplayValue } from "@grafana/data";

export const measureText = (
  text: string,
  size: string
): TextMetrics | undefined => {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.font = `${size} sans-serif`;
    return ctx.measureText(text);
  }
  return undefined;
};

export const getFormattedDisplayValue = (
  displayValue?: DisplayValue
): string => {
  return displayValue
    ? `${displayValue.prefix ?? ""}${displayValue.text}${
        displayValue.suffix ?? ""
      }`
    : "";
};
