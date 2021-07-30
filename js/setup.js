// CONSTANTS AND HTML INPUTS
const CR_DB_INPUT = document.getElementById("cr-db-input");
const STATS_TABLE_DIV = document.getElementById("statistics");
const CR_NO_CERT_INPUT = document.getElementById("cr-no-cert-input");
const CR_PRIORITY_INPUT = document.getElementById("cr-priority-input");
const CR_LOCAL_INPUT = document.getElementById("cr-local-input");
const MIX_PERCENT_INPUT = document.getElementById("mix-percent-input");
const DISABLED_DAYS_INPUT = document.getElementById("disabled-days-input");
const START_BTN = document.getElementById("start-btn");
const MIX_MONTH = document.getElementById("mix-month");
const MIX_BAJIO_INPUT = $("#mix-bajio-input");
const MIX_MTRONORTE_INPUT = $("#mix-mtronorte-input");
const MIX_MTROSUR_INPUT = $("#mix-mtrosur-input");
const MIX_NORESTE_INPUT = $("#mix-noreste-input");
const MIX_NOROESTE_INPUT = $("#mix-noroeste-input");
const MIX_OCCIDENTE_INPUT = $("#mix-occidente-input");
const MIX_SUR_INPUT = $("#mix-sur-input");
const MIX_SURESTE_INPUT = $("#mix-sureste-input");
const VACATIONS_INPUT = document.getElementById("vacations-input");
const MIN_MIX_INPUT = document.getElementById("min-rand");
const MAX_MIX_INPUT = document.getElementById("max-rand");
const RANDOM_TOGGLE_INPUT = document.getElementById("toggle-random");
const TODAY_DATE = new Date();
const DIV_INPUTS_IDS = ["mix-bajio-input", "mix-mtronorte-input", "mix-mtrosur-input", "mix-noreste-input", "mix-noroeste-input", "mix-occidente-input", "mix-sur-input", "mix-sureste-input"];
const MIX_DIV_INPUTS_ARR = [
    MIX_BAJIO_INPUT,
    MIX_MTRONORTE_INPUT,
    MIX_MTROSUR_INPUT,
    MIX_NORESTE_INPUT,
    MIX_NOROESTE_INPUT,
    MIX_OCCIDENTE_INPUT,
    MIX_SUR_INPUT,
    MIX_SURESTE_INPUT,
];
const DIVISIONS = [
    "BAJIO",
    "METROPOLITANA NORTE",
    "METROPOLITANA SUR",
    "NORESTE",
    "NOROESTE",
    "OCCIDENTE",
    "SUR",
    "SURESTE"
];
const DIVISIONS_CODE = {
    BAJIO: 0,
    "METROPOLITANA NORTE": 1,
    "METROPOLITANA SUR": 2,
    NORESTE: 3,
    NOROESTE: 4,
    OCCIDENTE: 5,
    SUR: 6,
    SURESTE: 7
};

// FUNCTIONS
function isAllSet() {
    if (cr_general.length <= 0) {
        alert("ERROR: Carga la base de datos de CRs");
        return false;
    } else if (cr_local.length <= 0) {
        alert("ERROR: Carga la lista de CRs locales");
        return false;
    } else if (vacations_data.length <= 0) {
        alert("ERROR: Carga la información del mes del mix");
        return false;
    }
    return true;
}

function resetInputs() {
    cr_general = [];
    cr_prio = [];
    cr_no_cert = [];
    cr_local = [];
    mix_percent = 0;
    disabled_days = [];
}

// GLOBAL VARIABLES
let cr_general = [];
let cr_prio = [];
let cr_no_cert = [];
let cr_local = [];
let disabled_days = [];
let vacations_data = [];
let month_array = [];
let month_headers = [];
let table_data = [];
let cols_data = [];
let capacityByDivision = {};
let remoteCapacityByDivision = {};
let localCapacityByDivision = {};
let mix_percent;
let year;
let month;
let is_rand_toggled = false;
let table;
// Mix assignation
let bajio_mix = [];
let mtronorte_mix = [];
let mtrosur_mix = [];
let noreste_mix = [];
let noroeste_mix = [];
let occidente_mix = [];
let sur_mix = [];
let sureste_mix = [];
const MIX_DIVS_ARR = [
    bajio_mix,
    mtronorte_mix,
    mtrosur_mix,
    noreste_mix,
    noroeste_mix,
    occidente_mix,
    sur_mix,
    sureste_mix,
];

// MONTH VALUES SET ACCORDING TO CURRENT MONTH
MIX_MONTH.value = `${TODAY_DATE.getFullYear()}-${(
    "0" +
    (TODAY_DATE.getMonth() + 1)
).slice(-2)}`;
year = parseInt(MIX_MONTH.value.split("-")[0]);
month = parseInt(MIX_MONTH.value.split("-").pop());

// TEST
MIX_MONTH.value = "2021-06";
year = parseInt(MIX_MONTH.value.split("-")[0]);
month = parseInt(MIX_MONTH.value.split("-").pop());
// TEST

// EVENT LISTENERS FOR EACH INPUT
CR_DB_INPUT.addEventListener("change", () => {
    if (CR_DB_INPUT.files.length > 0) {
        Papa.parse(CR_DB_INPUT.files[0], {
            complete: (parsed_doc) => {
                let temp_data = parsed_doc.data;
                if (temp_data[0].length === 4) {
                    cr_general = [];
                    for (let i = 1; i < temp_data.length; i++) {
                        if (temp_data[i].length === temp_data[0].length) {
                            if (
                                temp_data[i][3] !== "EMPRESA" &&
                                temp_data[i][3] !== "SUPER"
                            ) {
                                cr_general.push(temp_data[i].slice(0, 3));
                            }
                        }
                    }
                    for (let i = 0; i < cr_general.length; i++) {
                        if (cr_general[i][1].includes("REGIONAL")) {
                            cr_general[i][1] = cr_general[i][1].split(" ")[1];
                        }
                    }
                    for (let i = 0; i < cr_general.length; i++) {
                        cr_general[i][0] = parseInt(cr_general[i][0]);
                    }
                    cr_general = cr_general.sort((arr1, arr2) => {
                        return arr1[1] > arr2[1] ? 1 : -1;
                    });
                    // TEST
                    console.log("CR GENERAL: ", cr_general.length);
                    console.log("**********************************");
                    // TEST
                    document.getElementById("span0").className = "show";
                    // alert("SUCCESS!");
                } else {
                    cr_general = [];
                    CR_DB_INPUT.value = "";
                    alert(
                        "ERROR: Verifica que el archivo sea el correcto. Se espera archivo con 4 columnas."
                    );
                }
            },
        });
    }
});

CR_NO_CERT_INPUT.addEventListener("change", () => {
    if (CR_NO_CERT_INPUT.files.length > 0) {
        Papa.parse(CR_NO_CERT_INPUT.files[0], {
            complete: (parsed_doc) => {
                let temp_data = parsed_doc.data;
                if (vacations_data.length > 0) {
                    if (temp_data[0].length === 1) {
                        cr_no_cert = [];
                        for (let i = 1; i < temp_data.length; i++) {
                            if (temp_data[i].length === temp_data[0].length) {
                                cr_no_cert.push(parseInt(temp_data[i][0]));
                            }
                        }
                        let temp_arr = [];
                        for (let i = 0; i < cr_no_cert.length; i++) {
                            let index = isValueInArray(cr_general, cr_no_cert[i], 0);
                            if (index !== -1) {
                                deleteByIndexFromArray(cr_general, index);
                            } else {
                                temp_arr.push(cr_no_cert[i]);
                            }
                        }
                        if (temp_arr.length > 0) {
                            console.log("NO VISITA: No encontradas en BASE GENERAL:");
                            console.log(temp_arr);
                        }
                        // TEST
                        console.log("CR GENERAL DESPUES DE NO VISITA: ", cr_general.length);
                        console.log("NO VISITA: ", cr_no_cert.length);
                        console.log("**********************************");
                        // TEST
                        document.getElementById("span2").className = "show";
                        // alert("SUCCESS!");
                    } else {
                        CR_NO_CERT_INPUT.value = "";
                        cr_no_cert = [];
                        alert(
                            "ERROR: Verifica que el archivo sea el correcto. Se espera archivo con 1 columna."
                        );
                    }
                } else {
                    CR_NO_CERT_INPUT.value = "";
                    cr_no_cert = [];
                    alert("ERROR: Carga el archivo de calendario mensual antes.");
                }
            },
        });
    }
});

CR_PRIORITY_INPUT.addEventListener("change", () => {
    if (CR_PRIORITY_INPUT.files.length > 0) {
        Papa.parse(CR_PRIORITY_INPUT.files[0], {
            complete: (parsed_doc) => {
                let temp_data = parsed_doc.data;
                if (cr_no_cert.length > 0) {
                    if (temp_data[0].length === 3) {
                        cr_prio = [];
                        for (let i = 1; i < temp_data.length; i++) {
                            if (temp_data[i].length === temp_data[0].length) {
                                cr_prio.push(temp_data[i]);
                            }
                        }
                        for (let i = 0; i < cr_prio.length; i++) {
                            cr_prio[i][0] = parseInt(cr_prio[i][0]);
                        }
                        let temp_arr = [];
                        for (let i = 0; i < cr_prio.length; i++) {
                            let index = isValueInArray(cr_general, cr_prio[i][0], 0);
                            if (index !== -1) {
                                deleteByIndexFromArray(cr_general, index);
                            } else {
                                temp_arr.push(cr_prio[i]);
                            }
                        }
                        // TEST
                        console.log("PRIO PRE: ", cr_prio.length);
                        console.log("CR GENERAL DESPUES DE PRIO: ", cr_general.length);
                        // TEST
                        if (temp_arr.length > 0) {
                            console.log("PRIORITARIAS: No encontradas en BASE GENERAL:");
                            console.log(temp_arr);
                            for (let i = 0; i < temp_arr.length; i++) {
                                let index = isValueInArray(cr_prio, temp_arr[i][0], 0);
                                if (index !== -1) {
                                    deleteByIndexFromArray(cr_prio, index);
                                } else {
                                    console.log("ERROR GRAVE");
                                }
                            }
                        }
                        cr_prio = cr_prio.sort((arr1, arr2) => {
                            return arr1[1] > arr2[1] ? 1 : -1;
                        });
                        // TEST
                        console.log("PRIO POST: ", cr_prio.length);
                        console.log("**********************************");
                        // TEST
                        document.getElementById("span3").className = "show";
                        // alert("SUCCESS!");
                    } else {
                        cr_prio = [];
                        CR_PRIORITY_INPUT.value = "";
                        alert(
                            "ERROR: Verifica que el archivo sea el correcto. Se espera archivo con 3 columnas."
                        );
                    }
                } else {
                    cr_prio = [];
                    CR_PRIORITY_INPUT.value = "";
                    alert("ERROR: Carga el archivo CRs sin visita antes.");
                }
            },
        });
    }
});

CR_LOCAL_INPUT.addEventListener("change", () => {
    if (CR_LOCAL_INPUT.files.length > 0) {
        Papa.parse(CR_LOCAL_INPUT.files[0], {
            complete: (parsed_doc) => {
                let temp_data = parsed_doc.data;
                if (cr_prio.length > 0) {
                    if (temp_data[0].length === 3) {
                        cr_local = [];
                        for (let i = 1; i < temp_data.length; i++) {
                            if (temp_data[i].length === temp_data[0].length) {
                                cr_local.push(temp_data[i]);
                            }
                        }
                        for (let i = 0; i < cr_local.length; i++) {
                            cr_local[i][0] = parseInt(cr_local[i][0]);
                        }
                        let temp_arr = [];
                        for (let i = 0; i < cr_local.length; i++) {
                            let index = isValueInArray(cr_general, cr_local[i][0], 0);
                            if (index !== -1) {
                                deleteByIndexFromArray(cr_general, index);
                            } else {
                                temp_arr.push(cr_local[i]);
                            }
                        }
                        // TEST
                        console.log("LOCAL PRE: ", cr_local.length);
                        console.log("CR GENERAL DESPUES DE LOCAL: ", cr_general.length);
                        // TEST
                        if (temp_arr.length > 0) {
                            console.log("LOCALES: No encontradas en BASE GENERAL:");
                            console.log(temp_arr);
                            for (let i = 0; i < temp_arr.length; i++) {
                                let index = isValueInArray(cr_local, temp_arr[i][0], 0);
                                if (index !== -1) {
                                    deleteByIndexFromArray(cr_local, index);
                                } else {
                                    console.log("ERROR GRAVE");
                                }
                            }
                        }
                        cr_local = cr_local.sort((arr1, arr2) => {
                            return arr1[1] > arr2[1] ? 1 : -1;
                        });
                        // TEST
                        console.log("LOCAL POST: ", cr_local.length);
                        console.log("**********************************");
                        // TEST
                        document.getElementById("span4").className = "show";
                        // alert("SUCCESS!");
                    } else {
                        cr_local = [];
                        CR_LOCAL_INPUT.value = "";
                        alert(
                            "ERROR: Verifica que el archivo sea el correcto. Se espera archivo con 3 columnas."
                        );
                    }
                } else {
                    CR_LOCAL_INPUT.value = "";
                    cr_local = [];
                    alert("ERROR: Carga el archivo de CRs prioritarias antes.");
                }
            },
        });
    }
});

VACATIONS_INPUT.addEventListener("change", () => {
    if (VACATIONS_INPUT.files.length > 0) {
        let year = parseInt(MIX_MONTH.value.split("-")[0]);
        let month = parseInt(MIX_MONTH.value.split("-").pop());
        let month_days = getNumberOFDaysByMonth(year, month);
        Papa.parse(VACATIONS_INPUT.files[0], {
            complete: (parsed_doc) => {
                let temp_data = parsed_doc.data;
                if (cr_general.length > 0) {
                    if (temp_data[0].length === month_days + 5) {
                        vacations_data = [];
                        for (let i = 1; i < temp_data.length; i++) {
                            if (temp_data[i].length === temp_data[0].length) {
                                if (
                                    temp_data[i][2] === "Certificador" &&
                                    temp_data[i][3] === "Comercial" &&
                                    isValueInArray(DIVISIONS, temp_data[i][1]) !== -1
                                ) {
                                    vacations_data.push(temp_data[i]);
                                }
                            }
                        }
                        vacations_data = vacations_data.sort((arr1, arr2) => {
                            return arr1[1] > arr2[1] ? 1 : -1;
                        });
                        // TEST
                        console.log("CERTIFICADORES: ", vacations_data.length);
                        console.log(
                            "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&"
                        );
                        // TEST
                        generateMonthArrayAndHeader();
                        document.getElementById("span1").className = "show";
                        // alert("SUCCESS!");
                    } else {
                        vacations_data = [];
                        VACATIONS_INPUT.value = "";
                        alert(
                            "ERROR: Verifica que el archivo sea el correcto. Se esperan " +
                            (month_days + 5) +
                            " columnas"
                        );
                    }
                } else {
                    VACATIONS_INPUT.value = "";
                    vacations_data = [];
                    alert("ERROR: Carga la base de CRs antes.");
                }
            },
        });
    }
});

RANDOM_TOGGLE_INPUT.addEventListener("change", (e) => {
    is_rand_toggled = e.target.checked ? true : false;
    if (is_rand_toggled) {
        // MIN_MIX_INPUT.value = 2;
        // MAX_MIX_INPUT.value = 3;
        MIN_MIX_INPUT.disabled = false;
        MAX_MIX_INPUT.disabled = false;
        for (let i = 0; i < MIX_DIV_INPUTS_ARR.length; i++) {
            MIX_DIV_INPUTS_ARR[i].attr('disabled', true);
            MIX_DIV_INPUTS_ARR[i].selectpicker("refresh")
        }
    } else {
        // MIN_MIX_INPUT.value = 0;
        // MAX_MIX_INPUT.value = 0;
        MIN_MIX_INPUT.disabled = true;
        MAX_MIX_INPUT.disabled = true;
        for (let i = 0; i < DIV_INPUTS_IDS.length; i++) {
            MIX_DIV_INPUTS_ARR[i].removeAttr('disabled');
            MIX_DIV_INPUTS_ARR[i].selectpicker("refresh")
        }
    }
});

MIX_MONTH.addEventListener("change", (e) => {
    year = parseInt(MIX_MONTH.value.split("-")[0]);
    month = parseInt(MIX_MONTH.value.split("-").pop());
});

function fnExcelReport() {
    let tab_text = "<table border='2px'><tr>";
    let textRange;
    let j = 0;
    tab = document.getElementById("html-table").children[0]; // id of table

    for (j = 0; j < tab.rows.length; j++) {
        // console.log(tab.rows[j].innerHTML);
        tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
        //tab_text=tab_text+"</tr>";
    }

    tab_text = tab_text + "</table>";
    tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, ""); //remove if u want links in your table
    tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    let ua = window.navigator.userAgent;
    let msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        // If Internet Explorer
        txtArea1.document.open("txt/html", "replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus();
        sa = txtArea1.document.execCommand(
            "SaveAs",
            true,
            "Say Thanks to Sumit.xls"
        );
    } //other browser not tested on IE 11
    else
        sa = window.open(
            "data:application/vnd.ms-excel," + encodeURIComponent(tab_text)
        );

    return sa;
}
