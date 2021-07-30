// Tabulator formatters
Tabulator.prototype.extendModule("format", "formatters", {
    header_format: function (cell, formatterParams) {
        let cell_value = cell.getValue();
        if (isValueInArray(cell_value, "-") !== -1) {
            if (
                cell_value.split("-").pop() === "w" ||
                cell_value.split("-").pop() === "h"
            ) {
                cell.getElement().style.color = UNAVAILABLE_COLOR;
            } else if (cell_value.split("-").pop() === "d") {
                cell.getElement().style.color = PRESENTIAL_VISIT;
            }
            return (
                cell_value.split("-")[0].charAt(0).toUpperCase() +
                cell_value.split("-")[0].slice(1) +
                "\n" +
                cell_value.split("-")[1]
            );
        } else {
            return cell.getValue();
        }
    },
    cell_format: function (cell, formatterParams) {
        let day_value = cell.getValue();
        if (isValueInArray(day_value, "-") !== -1) {
            if (day_value.split("-").pop() === "Y") {
                cell.getElement().style.color = VULNERABILITY_COLOR;
            }
            return day_value.split("-")[0];
        } else if (day_value.includes("/")) {
            let div_value = day_value.split("/").pop();
            if (div_value === "0") {
                cell.getElement().style.backgroundColor = BAJIO_COLOR;
                cell.getElement().style.color = SECONDARY_COLOR;
            } else if (div_value === "1") {
                cell.getElement().style.backgroundColor = MNORTE_COLOR;
                cell.getElement().style.color = BASE_COLOR;
            } else if (div_value === "2") {
                cell.getElement().style.backgroundColor = MSUR_COLOR;
                cell.getElement().style.color = BASE_COLOR;
            } else if (div_value === "3") {
                cell.getElement().style.backgroundColor = NORESTE_COLOR;
                cell.getElement().style.color = BASE_COLOR;
            } else if (div_value === "4") {
                cell.getElement().style.backgroundColor = NOROESTE_COLOR;
                cell.getElement().style.color = BASE_COLOR;
            } else if (div_value === "5") {
                cell.getElement().style.backgroundColor = OCCIDENTE_COLOR;
                cell.getElement().style.color = SECONDARY_COLOR;
            } else if (div_value === "6") {
                cell.getElement().style.backgroundColor = SUR_COLOR;
                cell.getElement().style.color = BASE_COLOR;
            } else if (div_value === "7") {
                cell.getElement().style.backgroundColor = SURESTE_COLOR;
                cell.getElement().style.color = BASE_COLOR;
            }
        } else if (day_value.includes("_")) {
            cell.getElement().style.backgroundColor = PRESENTIAL_VISIT;
            cell.getElement().style.color = BASE_COLOR;
        } else {
            if (day_value === "f" || day_value === "l" || day_value === "r") {
                cell.getElement().style.backgroundColor = BASE_COLOR;
                cell.getElement().style.color = BASE_COLOR;
            } else if (day_value === "d") {
                cell.getElement().style.backgroundColor = PRESENTIAL_VISIT;
                cell.getElement().style.color = PRESENTIAL_VISIT;
            } else if (day_value === "w" || day_value === "h") {
                cell.getElement().style.backgroundColor = UNAVAILABLE_COLOR;
                cell.getElement().style.color = UNAVAILABLE_COLOR;
            } else if (day_value === "v") {
                cell.getElement().style.backgroundColor = VACATION_COLOR;
                cell.getElement().style.color = VACATION_COLOR;
            } else if (day_value === "t") {
                cell.getElement().style.backgroundColor = TRANSFER_COLOR;
                cell.getElement().style.color = TRANSFER_COLOR;
            } else if (day_value === "i") {
                cell.getElement().style.backgroundColor = INABILITY_COLOR;
                cell.getElement().style.color = INABILITY_COLOR;
            } else if (isNumeric(day_value)) {
                cell.getElement().style.backgroundColor = PRESENTIAL_VISIT;
                cell.getElement().style.color = BASE_COLOR;
            }
        }
        return cell.getValue();
    },
});

const BASE_COLOR = "#ffffff";
const SECONDARY_COLOR = "#000000";
const PRESENTIAL_VISIT = "#dd36e2";
const UNAVAILABLE_COLOR = "#747c92";
const VACATION_COLOR = "#1A64DB";
const VULNERABILITY_COLOR = "#fb3737";
const TRANSFER_COLOR = "#fbda37";
const INABILITY_COLOR = "#10d1c1";
const BAJIO_COLOR = "#A1E8AF";
const MNORTE_COLOR = "#767522";
const MSUR_COLOR = "#372772";
const NORESTE_COLOR = "#AF1B3F";
const NOROESTE_COLOR = "#DF9B6D";
const OCCIDENTE_COLOR = "#FFD9DA";
const SUR_COLOR = "#FC440F";
const SURESTE_COLOR = "#8C271E";
