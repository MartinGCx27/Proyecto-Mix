// ARRAYS
function isValueInArray(arr, value, index = -1) {
    if (index === -1) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === value) {
                return i;
            }
        }
    } else {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][index] === value) {
                return i;
            }
        }
    }
    return -1;
}

function deleteByIndexFromArray(arr, index) {
    arr.splice(index, 1);
    return arr;
}

// Works only on sorted arrays
function getStartAndEndIndex(arr, value, index = -1) {
    let start = -1;
    let end = -1;
    if (index === -1) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === value) {
                if (start === -1) {
                    start = i;
                }
                end = i;
            }
        }
    } else {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][index] === value) {
                if (start === -1) {
                    start = i;
                }
                end = i;
            }
        }
    }
    return [start, end];
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

// CALENDAR
function getNumberOFDaysByMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

const LAW_DAYS = {
    2021: {
        1: 1,
        2: 1,
        3: 15,
        5: 1,
        9: 16,
        11: 15,
        12: 25,
    },
    2022: {
        1: 1,
        2: 7,
        3: 21,
        5: 1,
        9: 16,
        11: 21,
        12: 25,
    },
    2023: {
        1: 1,
        12: 25,
    },
};

// GENERAL

function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function downloadAsCSV(data, filename) {
    let csv = Papa.unparse(data);
    let cvsData = new Blob([csv], { type: "text.csv/charset=utf-8" });
    let csvURL = null;
    if (navigator.msSaveBlob) {
        csvURL = navigator.msSaveBlob(cvsData, filename + ".csv");
    } else {
        csvURL = window.URL.createObjectURL(cvsData);
    }
    let tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", filename + ".csv");
    tempLink.click();
}

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}