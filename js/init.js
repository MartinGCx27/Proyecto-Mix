// FUNCTIONS
function getDayName(year, month, day) {
    temp_date = new Date(year + "-" + month + "-" + day);
    return temp_date.toLocaleString("spanish", { weekday: "short" });
}

/*
    f - Free (free to assign day)
    h - holiday
    w - weekend
    v - vacation
    t - transfer day
    i - inability
    d - disabled
*/
function calculateDayStatus(day, month, year) {
    let day_status = "f";
    let date_check = new Date(year + "-" + month + "-" + day);
    if (isValueInArray(disabled_days, day) !== -1) {
        day_status = "d";
    }
    if (LAW_DAYS[year][month] === day) {
        day_status = "h";
    }
    if (!(date_check.getDay() % 6)) {
        day_status = "w";
    }
    return day_status;
}

function randomizeMix() {
    // The indexes in both the inputs array and the divisions array must coincide
    let min = parseInt(MIN_MIX_INPUT.value);
    let max = parseInt(MAX_MIX_INPUT.value);
    let temp_arr = [];
    let rand_index;
    let rand_quantity;
    if ((min === 1) && (min === max)) {
        let assigned = [];
        rand_index = 0;
        for (let i = 0; i < DIVISIONS.length; i++) {
            temp_arr = [];
            while (rand_index === i || assigned.includes(DIVISIONS[rand_index])) {
                rand_index = Math.floor(Math.random() * 8);
            }
            temp_arr.push(DIVISIONS[rand_index]);
            assigned.push(DIVISIONS[rand_index]);
            MIX_DIV_INPUTS_ARR[i].selectpicker("val", temp_arr);
        }
    } else {
        for (let i = 0; i < DIVISIONS.length; i++) {
            temp_arr = [];
            rand_index = i;
            rand_quantity = randomIntFromInterval(min, max);
            while (temp_arr.length < rand_quantity) {
                while (rand_index === i) {
                    rand_index = Math.floor(Math.random() * 8);
                }
                if (Math.floor(Math.random() * 2) === 1) {
                    if (isValueInArray(temp_arr, DIVISIONS[rand_index]) === -1) {
                        temp_arr.push(DIVISIONS[rand_index]);
                    }
                    rand_index = i;
                }
            }
            MIX_DIV_INPUTS_ARR[i].selectpicker("val", temp_arr);
        }
    }
}

// Header: Day name - Number -  Status
function generateMonthArrayAndHeader() {
    month_array = [];
    month_headers = [];
    month_headers.push("DIVISION");
    month_headers.push("NOMBRE CERTIFICADOR");
    for (let i = 5; i < vacations_data[0].length; i++) {
        let name = getDayName(year, month, i - 4);
        let day_status = calculateDayStatus(i - 4, month, year);
        month_headers.push(name + "-" + (i - 4) + "-" + day_status);
    }
    // Log
    let temp_arr = [];
    let presential_count = 0;
    for (let i = 0; i < vacations_data.length; i++) {
        // Vulnerability handling
        if (vacations_data[i][0] === "NO") {
            month_array.push([
                vacations_data[i][1],
                vacations_data[i][4] + "-" + "N",
            ]);
        } else if (vacations_data[i][0] === "SI") {
            month_array.push([
                vacations_data[i][1],
                vacations_data[i][4] + "-" + "Y",
            ]);
        }
        // Days status handling
        for (let j = 5; j < vacations_data[0].length; j++) {
            // Vacations, transfer day, etc
            if (
                vacations_data[i][j] === "t" ||
                vacations_data[i][j] === "i" ||
                vacations_data[i][j] === "v"
            ) {
                month_array[i].push(vacations_data[i][j]);
            } else if (
                // Vacations, manually blocked days, holidays weekends
                month_headers[j - 3].split("-").pop() === "h" ||
                month_headers[j - 3].split("-").pop() === "w" ||
                month_headers[j - 3].split("-").pop() === "d" ||
                month_headers[j - 3].split("-").pop() === "f"
            ) {
                // Manually blocked day handling for vulnerability
                if (month_headers[j - 3].split("-").pop() === "d") {
                    if (isNumeric(vacations_data[i][j])) {
                        if (first_month_done) {
                            let index = isValueInArray(cr_general_resp, parseInt(vacations_data[i][j]), 0);
                            if (index !== -1) {
                                let temp_div = DIVISIONS_CODE[cr_general_resp[index][1]];
                                month_array[i].push(vacations_data[i][j] + "_" + temp_div);
                            } else {
                                temp_arr.push(vacations_data[i][j]);
                                month_array[i].push(vacations_data[i][j]);
                            }
                        } else {
                            presential_count++;
                            let index = isValueInArray(cr_general, parseInt(vacations_data[i][j]), 0);
                            if (index !== -1) {
                                let temp_div = DIVISIONS_CODE[cr_general[index][1]];
                                month_array[i].push(vacations_data[i][j] + "_" + temp_div);
                                deleteByIndexFromArray(cr_general, index);
                            } else {
                                temp_arr.push(vacations_data[i][j]);
                                month_array[i].push(vacations_data[i][j]);
                            }
                        }
                    } else if (vacations_data[i][0] === "NO") {
                        month_array[i].push(month_headers[j - 3].split("-").pop());
                    } else if (vacations_data[i][0] === "SI") {
                        month_array[i].push("f");
                    }
                } else {
                    // day assignation
                    if (month_headers[j - 3].split("-").pop() === "f") {
                        if (isNumeric(vacations_data[i][j])) {
                            if (first_month_done) {
                                let index = isValueInArray(cr_general_resp, parseInt(vacations_data[i][j]), 0);
                                if (index !== -1) {
                                    let temp_div = DIVISIONS_CODE[cr_general_resp[index][1]];
                                    month_array[i].push(vacations_data[i][j] + "_" + temp_div);
                                } else {
                                    temp_arr.push(vacations_data[i][j]);
                                    month_array[i].push(vacations_data[i][j]);
                                }
                            } else {
                                presential_count++;
                                let index = isValueInArray(cr_general, parseInt(vacations_data[i][j]), 0);
                                if (index !== -1) {
                                    let temp_div = DIVISIONS_CODE[cr_general[index][1]];
                                    month_array[i].push(vacations_data[i][j] + "_" + temp_div);
                                    deleteByIndexFromArray(cr_general, index);
                                } else {
                                    temp_arr.push(vacations_data[i][j]);
                                    month_array[i].push(vacations_data[i][j]);
                                }
                            }
                        } else {
                            month_array[i].push(month_headers[j - 3].split("-").pop());
                        }
                    } else {
                        month_array[i].push(month_headers[j - 3].split("-").pop());
                    }
                }
            }
        }
    }
    console.log("PRESENCIALES TOTALES:");
    console.log(presential_count);
    console.log("PRESENCIALES NO ENCONTRADAS EN GENERAL:");
    console.log(temp_arr);
    month_array = month_array.sort((arr1, arr2) => {
        return arr1[0] > arr2[0] ? 1 : -1;
    });
    if (!first_month_done) {
        first_month_done = true;
    }
}

function calculateCapacityByDivision() {
    capacityByDivision = {
        BAJIO: 0,
        "METROPOLITANA NORTE": 0,
        "METROPOLITANA SUR": 0,
        NORESTE: 0,
        NOROESTE: 0,
        OCCIDENTE: 0,
        SUR: 0,
        SURESTE: 0,
    };
    for (let j = 0; j < month_array.length; j++) {
        for (let k = 0; k < month_array[0].length; k++) {
            if (month_array[j][k] === "f") {
                capacityByDivision[month_array[j][0]] =
                    capacityByDivision[month_array[j][0]] + 1;
            }
        }
    }
}

function calculateCapacityAccordinToMix() {
    for (let i = 0; i < DIVISIONS.length; i++) {
        remoteCapacityByDivision[DIVISIONS[i]] = Math.round(
            capacityByDivision[DIVISIONS[i]] * (mix_percent / 100)
        );
        localCapacityByDivision[DIVISIONS[i]] =
            capacityByDivision[DIVISIONS[i]] - remoteCapacityByDivision[DIVISIONS[i]];
    }
}

function generateTableData() {
    cols_data = [];
    for (let i = 0; i < month_headers.length; i++) {
        cols_data.push({});
        cols_data[i]["formatter"] = "cell_format";
        cols_data[i]["titleFormatter"] = "header_format";
        cols_data[i]["title"] = month_headers[i];
        // cols_data[i]["accessorDownload"] = dateHeaderFormat;
        if (i === 0) {
            cols_data[i]["field"] = "DIVISION";
        } else if (i === 1) {
            cols_data[i]["field"] = "NOMBRE CERTIFICADOR";
        } else {
            cols_data[i]["field"] = (i - 1).toString();
        }
    }
    table_data = [];
    for (let i = 0; i < month_array.length; i++) {
        table_data.push({});
        for (let j = 0; j < month_array[0].length; j++) {
            if (j === 0) {
                table_data[i]["DIVISION"] = month_array[i][j];
            } else if (j === 1) {
                table_data[i]["NOMBRE CERTIFICADOR"] = month_array[i][j];
            } else {
                table_data[i][(j - 1).toString()] = month_array[i][j];
            }
        }
    }
}

function createTable() {
    table = new Tabulator("#table", {
        locale: true,
        resizableColumns: false,
        headerSort: false,
        data: table_data,
        columns: cols_data,
        layout: "fitData",
        maxHeight: 437,
    });
}

function getTotalCapacity() {
    let total = 0;
    for (let i = 0; i < DIVISIONS.length; i++) {
        total += capacityByDivision[DIVISIONS[i]];
    }
    return total;
}

function fillRemoteAndLocal() {
    let total_cap_copy = { ...capacityByDivision };
    let local_cap_copy = { ...localCapacityByDivision };
    let remote_cap_copy = { ...remoteCapacityByDivision };
    for (let j = 0; j < month_array[0].length; j++) {
        for (let i = 0; i < month_array.length; i++) {
            if (month_array[i][j] === "f") {
                // Checar estado pasado
                let k = j;
                let status;
                while (k >= 0) {
                    if (k === 0) {
                        status = "l";
                    } else if (month_array[i][k] === "l") {
                        status = "r";
                        break;
                    } else if (month_array[i][k] === "r") {
                        status = "l";
                        break;
                    }
                    k--;
                }
                // Check if there's local or remote capacity
                if (status === "l") {
                    if (local_cap_copy[month_array[i][0]] > 0) {
                        month_array[i][j] = status;
                        local_cap_copy[month_array[i][0]] -= 1;
                    } else if (remote_cap_copy[month_array[i][0]] > 0) {
                        month_array[i][j] = "r";
                        remote_cap_copy[month_array[i][0]] -= 1;
                    }
                } else if (status === "r") {
                    if (remote_cap_copy[month_array[i][0]] > 0) {
                        month_array[i][j] = status;
                        remote_cap_copy[month_array[i][0]] -= 1;
                    } else if (local_cap_copy[month_array[i][0]] > 0) {
                        month_array[i][j] = "l";
                        local_cap_copy[month_array[i][0]] -= 1;
                    }
                }
            }
        }
    }
}

function assignation(cert_index, cr_list, div_index, day_index) {
    // Getting indexes of current division in local crs
    let ind_arr = getStartAndEndIndex(cr_list, DIVISIONS[div_index], 1);
    let start_ind = ind_arr[0];
    let end_ind = ind_arr[1];
    // Getting a random cr from locals cr from the current division
    let cr_ind = randomIntFromInterval(start_ind, end_ind);
    // Assigning cr to the month array and deleting the cr from the current list
    month_array[cert_index][day_index] = cr_list[cr_ind][0] + "/" + div_index;
    deleteByIndexFromArray(cr_list, cr_ind);
}

function assignLocal(copy_local, copy_prio, copy_general, certInd, div_ind, i) {
    // Checking in the local only crs
    if (isValueInArray(copy_local, DIVISIONS[div_ind], 1) !== -1) {
        assignation(certInd, copy_local, div_ind, i);
        return true;
    }
    // Checking in the priority crs
    else if (isValueInArray(copy_prio, DIVISIONS[div_ind], 1) !== -1) {
        assignation(certInd, copy_prio, div_ind, i);
        return true;
    }
    // Checking in the general crs list
    else if (isValueInArray(copy_general, DIVISIONS[div_ind], 1) !== -1) {
        assignation(certInd, copy_general, div_ind, i);
        return true;
    }
    return false;
}

function assignRemote(copy_prio, copy_general, certInd, div_ind, i) {
    // Getting the array of division assigned to certifiers division
    let div_mix_assignees = MIX_DIVS_ARR[div_ind];
    // Array of asignees ids
    let asignees_arr = [];
    // Code of remote division
    let rem_ind;
    // Random div from the asignees
    while (true) {
        let asignee_ind = randomIntFromInterval(0, div_mix_assignees.length - 1);
        while (
            asignees_arr.includes(asignee_ind) &&
            asignees_arr.length < div_mix_assignees.length
        ) {
            asignee_ind = randomIntFromInterval(0, div_mix_assignees.length - 1);
        }
        asignees_arr.push(asignee_ind);
        rem_ind = DIVISIONS_CODE[div_mix_assignees[asignee_ind]];
        if (
            isValueInArray(copy_prio, DIVISIONS[rem_ind], 1) !== -1 ||
            isValueInArray(copy_general, DIVISIONS[rem_ind], 1) !== -1
        ) {
            break;
        }
        if (asignees_arr.length === div_mix_assignees.length) {
            return false;
        }
    }
    if (isValueInArray(copy_prio, DIVISIONS[rem_ind], 1) !== -1) {
        assignation(certInd, copy_prio, rem_ind, i);
        return true;
    } else if (isValueInArray(copy_general, DIVISIONS[rem_ind], 1) !== -1) {
        assignation(certInd, copy_general, rem_ind, i);
        return true;
    }
    return false;
}

function mixAlgo() {
    // Will store the prevously selected certs
    let selectedCert = [];
    let total_capacity = getTotalCapacity();
    // Copying input arrays
    let copy_general = cr_general.map(function (arr) {
        return arr.slice();
    });
    let copy_local = cr_local.map(function (arr) {
        return arr.slice();
    });
    let copy_prio = cr_prio.map(function (arr) {
        return arr.slice();
    });
    // Copying capacities
    let copy_capacities = { ...capacityByDivision };
    let copy_capacities_local = { ...localCapacityByDivision };
    let copy_capacities_remote = { ...remoteCapacityByDivision };

    console.log("STATS PRE:");
    console.log("Total Capacity: ", total_capacity);
    console.log("General: ", copy_general.length);
    console.log("Locales: ", copy_local.length);
    console.log("Prio: ", copy_prio.length);
    console.log("CAPACIDADES: ");
    console.log(capacityByDivision);
    console.log(localCapacityByDivision);
    console.log(remoteCapacityByDivision);

    for (let j = 0; j < month_array[0].length; j++) {
        while (selectedCert.length < month_array.length) {
            // Random certifier
            let certInd = randomIntFromInterval(0, month_array.length - 1);
            // Check if he wasnt selected before
            while (selectedCert.includes(month_array[certInd][1])) {
                certInd = randomIntFromInterval(0, month_array.length - 1);
            }
            selectedCert.push(month_array[certInd][1]);
            // Getting cert division index
            let div_ind = DIVISIONS_CODE[month_array[certInd][0]];
            // Getting nearest available day
            let i = 2;
            while (i < month_array[0].length) {
                if (
                    month_array[certInd][i] === "l" ||
                    month_array[certInd][i] === "r"
                ) {
                    break;
                }
                i++;
            }
            if (i < month_array[0].length) {
                // Local day case
                if (month_array[certInd][i] === "l") {
                    if (
                        assignLocal(
                            copy_local,
                            copy_prio,
                            copy_general,
                            certInd,
                            div_ind,
                            i
                        )
                    ) {
                        copy_capacities[DIVISIONS[div_ind]] -= 1;
                        copy_capacities_local[DIVISIONS[div_ind]] -= 1;
                        total_capacity--;
                    } else if (
                        assignRemote(copy_prio, copy_general, certInd, div_ind, i)
                    ) {
                        copy_capacities[DIVISIONS[div_ind]] -= 1;
                        copy_capacities_local[DIVISIONS[div_ind]] -= 1;
                        total_capacity--;
                    }
                } else if (month_array[certInd][i] === "r") {
                    // Remote case day
                    if (assignRemote(copy_prio, copy_general, certInd, div_ind, i)) {
                        copy_capacities[DIVISIONS[div_ind]] -= 1;
                        copy_capacities_remote[DIVISIONS[div_ind]] -= 1;
                        total_capacity--;
                    } else if (
                        assignLocal(
                            copy_local,
                            copy_prio,
                            copy_general,
                            certInd,
                            div_ind,
                            i
                        )
                    ) {
                        copy_capacities[DIVISIONS[div_ind]] -= 1;
                        copy_capacities_remote[DIVISIONS[div_ind]] -= 1;
                        total_capacity--;
                    }
                }
            }
        }
        selectedCert = [];
    }
    // Local case only
    if (copy_local.length > 0) {
        console.log("LLENANDO LOCALES ONLY");
        let loc_div = ["NOROESTE", "SURESTE"];
        for (let k = 0; k < loc_div.length; k++) {
            let loc_div_ind = DIVISIONS_CODE[loc_div[k]];
            if (isValueInArray(copy_local, loc_div[k], [1]) !== -1) {
                // Check if all local capacities were occupied already
                for (let i = 0; i < month_array.length; i++) {
                    if (month_array[i][0] === loc_div[k]) {
                        for (let j = 0; j < month_array[0].length; j++) {
                            if (month_array[i][j] === "l" || month_array[i][j] === "r") {
                                if (copy_local.length > 0) {
                                    if (month_array[i][j] === "l") {
                                        copy_capacities[loc_div[k]] -= 1;
                                        copy_capacities_local[loc_div[k]] -= 1;
                                    } else if (month_array[i][j] === "r") {
                                        copy_capacities[loc_div[k]] -= 1;
                                        copy_capacities_remote[loc_div[k]] -= 1;
                                    }
                                    assignation(i, copy_local, loc_div_ind, j);
                                    total_capacity--;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    // Filling the rest of the free days totally random
    if (copy_prio.length > 0 || copy_general.length > 0) {
        console.log("TOTALLY RANDOM ASSIGN");
        let selectedCert = [];
        for (let j = 0; j < month_array[0].length; j++) {
            while (selectedCert.length < month_array.length) {
                // Random certifier
                let certInd = randomIntFromInterval(0, month_array.length - 1);
                // Check if he wasnt selected before
                while (selectedCert.includes(month_array[certInd][1])) {
                    certInd = randomIntFromInterval(0, month_array.length - 1);
                }
                selectedCert.push(month_array[certInd][1]);
                // Getting cert division index
                let div_ind = DIVISIONS_CODE[month_array[certInd][0]];
                // Getting nearest available day
                let i = 2;
                while (i < month_array[0].length) {
                    if (
                        month_array[certInd][i] === "l" ||
                        month_array[certInd][i] === "r"
                    ) {
                        break;
                    }
                    i++;
                }
                if (i < month_array[0].length) {
                    let rand_ind;
                    // Local day case
                    if (copy_prio.length > 0) {
                        rand_ind = randomIntFromInterval(0, copy_prio.length - 1);
                        if (month_array[certInd][i] === "l") {
                            copy_capacities[month_array[certInd][0]] -= 1;
                            copy_capacities_local[month_array[certInd][0]] -= 1;
                        } else if (month_array[certInd][i] === "r") {
                            copy_capacities[month_array[certInd][0]] -= 1;
                            copy_capacities_remote[month_array[certInd][0]] -= 1;
                        }
                        month_array[certInd][i] =
                            copy_prio[rand_ind][0] +
                            "/" +
                            DIVISIONS_CODE[copy_prio[rand_ind][1]];
                        deleteByIndexFromArray(copy_prio, rand_ind);
                        total_capacity--;
                    } else if (copy_general.length > 0) {
                        rand_ind = randomIntFromInterval(0, copy_general.length - 1);
                        if (month_array[certInd][i] === "l") {
                            copy_capacities[month_array[certInd][0]] -= 1;
                            copy_capacities_local[month_array[certInd][0]] -= 1;
                        } else if (month_array[certInd][i] === "r") {
                            copy_capacities[month_array[certInd][0]] -= 1;
                            copy_capacities_remote[month_array[certInd][0]] -= 1;
                        }
                        month_array[certInd][i] =
                            copy_general[rand_ind][0] +
                            "/" +
                            DIVISIONS_CODE[copy_general[rand_ind][1]];
                        deleteByIndexFromArray(copy_general, rand_ind);
                        total_capacity--;
                    }
                }
            }
            selectedCert = [];
        }
    }
    console.log("Total Capacity POST: ", total_capacity);
    console.log("General POST: ", copy_general.length);
    console.log("Locales POST: ", copy_local.length);
    console.log("Prio POST: ", copy_prio.length);
    console.log(
        "Total Capacity ASIGNADOS: ",
        getTotalCapacity() - total_capacity
    );
    console.log("General ASIGNADOS: ", cr_general.length - copy_general.length);
    console.log("Locales ASIGNADOS: ", cr_local.length - copy_local.length);
    console.log("Prio ASIGNADOS: ", cr_prio.length - copy_prio.length);
    console.log("CAPACIDADES POST: ");
    console.log(copy_capacities);
    console.log(copy_capacities_local);
    console.log(copy_capacities_remote);
    console.log(" ");
    downloadPostAlgoFiles(copy_general);

}

function downloadCalendar() {
    let html_table = table.getHtml();
    let html_div = document.getElementById("html-table");
    html_div.innerHTML = html_table;
    fnExcelReport();
}

function downloadPostAlgoFiles(copy_general) {
    if (copy_general.length > 0) {
        downloadAsCSV(copy_general, "Prioritarias");
    }
}

function getDayData(day) {
    day_arr = day.split("-");
    return [day_arr[0].charAt(0).toUpperCase() + day_arr[0].slice(1) + " " + day_arr[1], day_arr[2]];
}

function renderStatisticsTable(data, weeks, certs_by_week) {
    console.log(data)
    console.log(weeks)
    console.log(certs_by_week)


    let calendar_title = document.getElementById("calendar-title");
    calendar_title.innerHTML = "Calendario Mix:";
    STATS_TABLE_DIV.innerHTML = "";
    stat_table = document.createElement('table');
    stat_table.className = "table table-striped table-bordered";
    // Visited CRs by Week
    let table_data = [[]];
    table_data[0].push("DIVISON");
    for (let i = 0; i < weeks.length; i++) {
        table_data[0].push(weeks[i][2]);
    }
    table_data[0].push("TOTAL DIVISION");
    for (let i = 0; i < 8; i++) {
        table_data.push([]);
        table_data[i + 1].push(DIVISIONS[i]);
        for (let j = 0; j < data[0].length; j++) {
            table_data[i + 1].push(data[i][j]);
        }
    }
    table_data.push(["TOTAL SEMANAL:"]);
    for (let i = 1; i < table_data[0].length; i++) {
        let sum = 0;
        for (let j = 1; j < table_data.length - 1; j++) {
            sum += table_data[j][i];
        }
        table_data[table_data.length - 1].push(sum);
    }
    let temp_row;
    let temp_el;
    for (let i = 0; i < table_data.length; i++) {
        temp_row = document.createElement('tr');
        for (let j = 0; j < table_data[0].length; j++) {
            if (i === 0) {
                temp_el = document.createElement('th');
                temp_el.className = "thead-light";
            } else {
                temp_el = document.createElement('td');
            }
            temp_el.innerHTML = table_data[i][j];
            temp_row.appendChild(temp_el);
        }
        stat_table.appendChild(temp_row);
    }
    let temp_p = document.createElement("p");
    temp_p.className = "bold-p";
    temp_p.innerHTML = "Certificaciones hechas por cada división por semana:";
    STATS_TABLE_DIV.appendChild(temp_p);
    STATS_TABLE_DIV.appendChild(stat_table);

    // Certifications of a division by week
    stat_table3 = document.createElement("table");
    stat_table3.className = "table table-striped table-bordered";
    // Getting the table ready with each week as a column
    table_data2 = [[]];
    table_data2[0].push("DIVISON");
    for (let i = 0; i < weeks.length; i++) {
        table_data2[0].push(weeks[i][2]);
    }
    table_data2[0].push("TOTAL DIVISION");
    for (let i = 0; i < 8; i++) {
        table_data2.push([]);
        table_data2[i + 1].push(DIVISIONS[i]);
        for (let j = 0; j < certs_by_week[0].length; j++) {
            table_data2[i + 1].push(certs_by_week[i][j]);
        }
    }
    table_data2.push(["TOTAL SEMANAL:"]);
    for (let i = 1; i < table_data2[0].length; i++) {
        let sum = 0;
        for (let j = 1; j < table_data2.length - 1; j++) {
            sum += table_data2[j][i];
        }
        table_data2[table_data2.length - 1].push(sum);
    }
    temp_row;
    temp_el;
    for (let i = 0; i < table_data2.length; i++) {
        temp_row = document.createElement('tr');
        for (let j = 0; j < table_data2[0].length; j++) {
            if (i === 0) {
                temp_el = document.createElement('th');
                temp_el.className = "thead-light";
            } else {
                temp_el = document.createElement('td');
            }
            temp_el.innerHTML = table_data2[i][j];
            temp_row.appendChild(temp_el);
        }
        stat_table3.appendChild(temp_row);
    }

    temp_p = document.createElement("p");
    temp_p.className = "bold-p";
    temp_p.innerHTML = "CRs certificados de cada división por semana:";
    STATS_TABLE_DIV.appendChild(temp_p);
    STATS_TABLE_DIV.appendChild(stat_table3);


    // Percentage of visits by division in a month
    stat_table2 = document.createElement('table');
    stat_table2.className = "table table-striped table-bordered";

    let percent_table = [[" ", "BAJIO", "METROPOLITANA NORTE", "METROPOLITANA SUR", "NORESTE", "NOROESTE", "OCCIDENTE", "SUR", "SURESTE"],
    ["BAJIO"],
    ["METROPOLITANA NORTE"],
    ["METROPOLITANA SUR"],
    ["NORESTE"],
    ["NOROESTE"],
    ["OCCIDENTE"],
    ["SUR"],
    ["SURESTE"]];

    for (let i = 1; i < percent_table.length; i++) {
        for (let j = 0; j < 8; j++) {
            percent_table[i].push(0);
        }
    }

    for (let i = 1; i < percent_table.length; i++) {
        let indexes = getStartAndEndIndex(month_array, percent_table[i][0], 0);
        let start = indexes[0];
        let end = indexes[1];
        for (let j = start; j <= end; j++) {
            for (let k = 0; k < month_array[0].length; k++) {
                if (month_array[j][k].includes("/")) {
                    let div_code = parseInt(month_array[j][k].split("/")[1]);
                    percent_table[i][div_code + 1] += 1;
                }
            }
        }
    }

    for (let i = 1; i < percent_table.length; i++) {
        for (let j = 1; j < percent_table[0].length; j++) {
            if (percent_table[i][j] !== 0) {
                percent_table[i][j] = ((percent_table[i][j] / table_data[i][table_data[i].length - 1]) * 100).toFixed(2) + "%" + " (" + percent_table[i][j] + ")";
            }
        }
    }

    temp_row;
    temp_el;
    for (let i = 0; i < percent_table.length; i++) {
        temp_row = document.createElement('tr');
        for (let j = 0; j < percent_table[0].length; j++) {
            if (i === 0) {
                temp_el = document.createElement('th');
                temp_el.className = "thead-light";
            } else {
                temp_el = document.createElement('td');
                if (i > 0) {
                    if (j === i) {
                        temp_el.className = "main-table-element";
                    }
                }
            }
            temp_el.innerHTML = percent_table[i][j];
            temp_row.appendChild(temp_el);
        }
        stat_table2.appendChild(temp_row);
    }
    temp_p = document.createElement("p");
    temp_p.className = "bold-p";
    temp_p.innerHTML = "Desglose porcentual de certificaciones realizadas por división:";
    STATS_TABLE_DIV.appendChild(temp_p);
    STATS_TABLE_DIV.appendChild(stat_table2);
}

function generateStatistics() {
    let weeks = [];
    let week_name = "";
    let week_start = -1;
    let week_end = -1;
    // Getting the weeks on the month_array
    for (let i = 2; i < cols_data.length; i++) {
        let day_arr = getDayData(cols_data[i]["title"]);
        let day_name = day_arr[0];
        let day_status = day_arr[1];
        if ((day_status === "w" || day_status === "h") || i === (cols_data.length - 1)) {
            if (week_name.length > 0) {
                if (i === (cols_data.length - 1)) {
                    week_name += " - " + getDayData(cols_data[i]["title"])[0];
                    week_end = i;
                } else {
                    week_name += " - " + getDayData(cols_data[i - 1]["title"])[0];
                    week_end = i - 1;
                }
                weeks.push([week_start, week_end, week_name]);
                week_name = "";
                week_start = -1;
                week_end = -1;
            }
        } else {
            if (week_name.length === 0) {
                week_name = day_name;
                week_start = i;
            }
        }
    }

    weeks_summary = [];
    for (let i = 0; i < DIVISIONS.length; i++) {
        let indexes = getStartAndEndIndex(month_array, DIVISIONS[i], 0);
        let start = indexes[0];
        let end = indexes[1];
        let div_count = 0;
        let week_count = 0;
        weeks_summary.push([]);
        for (let j = 0; j < weeks.length; j++) {
            for (let k = weeks[j][0]; k <= weeks[j][1]; k++) {
                for (let m = start; m <= end; m++) {
                    if (month_array[m][k].includes("/")) {
                        div_count++;
                        week_count++;
                    }
                }
            }
            weeks_summary[i].push(week_count);
            week_count = 0;
        }
        weeks_summary[i].push(div_count);
    }

    certs_by_week = [];
    for (let i = 0; i < DIVISIONS.length; i++) {
        let div_count = 0;
        let week_count = 0;
        certs_by_week.push([]);
        for (let j = 0; j < weeks.length; j++) {
            for (let k = weeks[j][0]; k <= weeks[j][1]; k++) {
                for (let m = 0; m < month_array.length; m++) {
                    if (month_array[m][k].includes("/")) {
                        if (month_array[m][k].charAt(month_array[m][k].length - 1) === DIVISIONS_CODE[DIVISIONS[i]].toString()) {
                            div_count++;
                            week_count++;
                        }
                    }
                }
            }
            certs_by_week[i].push(week_count);
            week_count = 0;
        }
        certs_by_week[i].push(div_count);
    }
    renderStatisticsTable(weeks_summary, weeks, certs_by_week);
}

function schedule() {
    generateMonthArrayAndHeader();
    calculateCapacityByDivision();
    calculateCapacityAccordinToMix();
    fillRemoteAndLocal();
    mixAlgo();
    generateTableData();
    generateStatistics();
    createTable();
    downloadCalendar();
}
// TEST
// MIX_PERCENT_INPUT.value = 50;
// DISABLED_DAYS_INPUT.value = "28 20 15 5";
// END OF TEST

// GENERATE BUTTON EVENT LISTENER
START_BTN.addEventListener("click", () => {
    if (isAllSet()) {
        mix_percent = parseInt(MIX_PERCENT_INPUT.value);
        // Verificar porcentaje del mix
        if (mix_percent < 0 || mix_percent > 100) {
            alert("ERROR: Porcentaje para mix incorrecto.");
            return false;
        }
        // Días deshabilitados
        if (DISABLED_DAYS_INPUT.value.length > 0) {
            disabled_days = DISABLED_DAYS_INPUT.value.split(" ");
            for (let i = 0; i < disabled_days.length; i++) {
                disabled_days[i] = parseInt(disabled_days[i]);
                if (disabled_days[i] <= 0) {
                    VACATIONS_INPUT.value = "";
                    alert(
                        "ERROR: Fecha de presencial elegida incorrecta, verifique por favor."
                    );
                    return false;
                }
                if (disabled_days[i] > getNumberOFDaysByMonth(year, month)) {
                    VACATIONS_INPUT.value = "";
                    alert(
                        "ERROR: El número de días del mes seleccionado es menor a una fecha de presencial elegida."
                    );
                    return false;
                }
            }
        }
        // Verificar si es random el mix
        if (is_rand_toggled) {
            if (MIN_MIX_INPUT.value.length <= 0 || MAX_MIX_INPUT.value.length <= 0) {
                alert("ERROR: Indica un máximo y mínimo de mix");
                return false;
            }
            let min = parseInt(MIN_MIX_INPUT.value);
            let max = parseInt(MAX_MIX_INPUT.value);
            if (min > max) {
                alert("ERROR: Mínimo es mayor que máximo en mix");
                return false;
            }
            randomizeMix();
            for (let i = 0; i < MIX_DIV_INPUTS_ARR.length; i++) {
                MIX_DIVS_ARR[i] = MIX_DIV_INPUTS_ARR[i].val();
            }
        } else {
            for (let i = 0; i < MIX_DIV_INPUTS_ARR.length; i++) {
                if (MIX_DIV_INPUTS_ARR[i].val() === null) {
                    alert("Llena todas las divisiones con al menos un mix");
                    return false;
                }
                MIX_DIVS_ARR[i] = MIX_DIV_INPUTS_ARR[i].val();
                if (MIX_DIVS_ARR[i].length <= 0) {
                    alert("Llena todas las divisiones con al menos un mix");
                    return false;
                }
            }
        }
        schedule();
    }
});
