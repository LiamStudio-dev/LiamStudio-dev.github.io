/* =========================================================
ELEMENTS
========================================================= */

const calculatorPage =
document.getElementById("calculatorPage");

const settingsPage =
document.getElementById("settingsPage");

const settingsBtn =
document.getElementById("settingsBtn");

const backBtn =
document.getElementById("backBtn");

const settingsTitle =
document.getElementById("settingsTitle");

const settingsHome =
document.getElementById("settingsHome");

const themesView =
document.getElementById("themesView");

const fontsView =
document.getElementById("fontsView");

const previousDisplay =
document.getElementById("previous");

const currentDisplay =
document.getElementById("current");

const themeAnimal =
document.getElementById("themeAnimal");

const buttons =
document.querySelectorAll(".btn");

const themeButtons =
document.querySelectorAll(".theme-card");

const settingsOptions =
document.querySelectorAll(".settings-option");

const fontButtons =
document.querySelectorAll(".font-card");


/* =========================================================
CALCULATOR VARIABLES
========================================================= */

let expression = "0";
let justCalculated = false;


/* =========================================================
DISPLAY
========================================================= */

function updateDisplay(animate = false) {

    currentDisplay.textContent = expression
        .replace(/\*/g, "×")
        .replace(/\//g, "÷");

    previousDisplay.textContent = "";

    if (animate) {

        currentDisplay.classList.remove("number-pop");

        void currentDisplay.offsetWidth;

        currentDisplay.classList.add("number-pop");

    }

}


/* =========================================================
NUMBERS
========================================================= */

function addNumber(number) {

    if (expression === "خطا") {
        clearCalculator();
    }

    if (justCalculated) {

        expression = "0";
        justCalculated = false;

    }

    const lastNumber = expression.match(/(\d*\.?\d+)$/);

    const currentPart = lastNumber
        ? lastNumber[1]
        : "";

    if (number === ".") {

        if (currentPart.includes(".")) {
            return;
        }

        if (currentPart === "") {

            expression += "0.";

        } else {

            expression += ".";

        }

        updateDisplay(true);

        return;

    }

    if (expression.endsWith(")")) {
        expression += "*";
    }

    if (
        currentPart === "0" &&
        !expression.endsWith("0.")
    ) {

        expression = expression.slice(0, -1) + number;

    } else {

        expression += number;

    }

    updateDisplay(true);

}


/* =========================================================
OPERATORS
========================================================= */

function chooseOperator(op) {

    if (expression === "خطا") {
        return;
    }

    if (justCalculated) {
        justCalculated = false;
    }

    if (op === "%") {

        if (/[0-9)]$/.test(expression)) {

            expression += "%";

            updateDisplay(true);

        }

        return;

    }

    if (expression === "0" && op === "-") {

        expression = "-";

        updateDisplay(true);

        return;

    }

    if (/[+\-*/]$/.test(expression)) {

        if (expression.endsWith("(")) {
            return;
        }

        expression = expression.slice(0, -1);

    }

    if (expression.endsWith("(") && op !== "-") {
        return;
    }

    expression += op;

    updateDisplay(false);

}


/* =========================================================
PARENTHESES
========================================================= */

function insertParenthesis(type) {

    if (expression === "خطا") {
        clearCalculator();
    }

    if (justCalculated) {

        expression = "0";

        justCalculated = false;

    }

    const openCount =
        (expression.match(/\(/g) || []).length;

    const closeCount =
        (expression.match(/\)/g) || []).length;

    if (type === "(") {

        if (/[0-9)%]$/.test(expression)) {
            expression += "*";
        }

        if (expression === "0") {
            expression = "(";
        } else {
            expression += "(";
        }

    }

    else {

        if (
            openCount > closeCount &&
            /[0-9)%]$/.test(expression)
        ) {

            expression += ")";

        }

    }

    updateDisplay(true);

}


/* =========================================================
SQUARE ROOT
========================================================= */

function insertSquareRoot() {

    if (expression === "خطا") {
        clearCalculator();
    }

    if (justCalculated) {

        expression = "0";

        justCalculated = false;

    }

    if (/[0-9)%]$/.test(expression)) {
        expression += "*";
    }

    if (expression === "0") {

        expression = "√(";

    } else {

        expression += "√(";

    }

    updateDisplay(true);

}


/* =========================================================
CALCULATE
========================================================= */

function calculate(showAnimation = true) {

    if (
        expression === "خطا" ||
        expression === "" ||
        justCalculated
    ) {
        return;
    }

    let fullExpression = expression;

    /* Remove unfinished operators */

    fullExpression = fullExpression.replace(/[+\-*/]+$/, "");

    if (
        !fullExpression ||
        fullExpression === "-"
    ) {
        return;
    }

    try {

        /* Validate characters */

        if (!/^[0-9+\-*/%.()√\s]+$/.test(fullExpression)) {
            throw new Error("Invalid expression");
        }

        /* Automatically close remaining parentheses */

        const openCount =
            (fullExpression.match(/\(/g) || []).length;

        const closeCount =
            (fullExpression.match(/\)/g) || []).length;

        if (closeCount > openCount) {
            throw new Error("Invalid parentheses");
        }

        fullExpression += ")".repeat(openCount - closeCount);

        /* Check incomplete expressions */

        if (/[+\-*/.(]$/.test(fullExpression)) {
            throw new Error("Incomplete expression");
        }

        /* Convert square root */

        fullExpression = fullExpression.replace(
            /√\(/g,
            "Math.sqrt("
        );

        /* Calculate */

        let result = Function(
            '"use strict"; return (' + fullExpression + ')'
        )();

        if (!Number.isFinite(result)) {
            throw new Error("Invalid result");
        }

        /* Round result */

        result = Math.round(
            (result + Number.EPSILON) * 100000000
        ) / 100000000;

        expression = String(result);

        justCalculated = true;

        updateDisplay(showAnimation);

    }

    catch (error) {

        expression = "خطا";

        justCalculated = true;

        updateDisplay(showAnimation);

    }

}


/* =========================================================
CLEAR
========================================================= */

function clearCalculator() {

    expression = "0";

    justCalculated = false;

    updateDisplay(true);

}


/* =========================================================
DELETE
========================================================= */

function deleteNumber() {

    if (
        expression === "خطا" ||
        justCalculated
    ) {

        clearCalculator();

        return;

    }

    if (expression.length <= 1) {

        expression = "0";

    } else {

        expression = expression.slice(0, -1);

    }

    if (
        expression === "" ||
        expression === "-"
    ) {

        expression = "0";

    }

    updateDisplay(true);

}


/* =========================================================
BUTTON EVENTS
========================================================= */

buttons.forEach(button => {

    button.addEventListener("click", () => {

        const value = button.dataset.value;

        const action = button.dataset.action;

        if (action === "clear") {

            clearCalculator();

            return;

        }

        if (action === "delete") {

            deleteNumber();

            return;

        }

        if (action === "calculate") {

            calculate(true);

            return;

        }

        if (!value) {
            return;
        }

        if (value === "sqrt") {

            insertSquareRoot();

        }

        else if (
            value === "(" ||
            value === ")"
        ) {

            insertParenthesis(value);

        }

        else if (
            ["+", "-", "*", "/", "%"].includes(value)
        ) {

            chooseOperator(value);

        }

        else {

            addNumber(value);

        }

    });

});


/* =========================================================
SETTINGS NAVIGATION
========================================================= */

function showSettingsView(view) {

    document.querySelectorAll(".settings-view").forEach(section => {

        section.classList.remove("active");

    });

    view.classList.add("active");

    if (view === settingsHome) {

        settingsTitle.textContent = "تنظیمات";

    }

    else if (view === themesView) {

        settingsTitle.textContent = "تم‌ها";

    }

    else if (view === fontsView) {

        settingsTitle.textContent = "فونت‌ها";

    }

}


/* =========================================================
OPEN SETTINGS
========================================================= */

settingsBtn.addEventListener("click", () => {

    calculatorPage.classList.add("hidden");

    settingsPage.classList.add("active");

    showSettingsView(settingsHome);

});


/* =========================================================
OPEN SETTINGS SECTIONS
========================================================= */

settingsOptions.forEach(button => {

    button.addEventListener("click", () => {

        const viewId = button.dataset.view;

        const view = document.getElementById(viewId);

        if (view) {

            showSettingsView(view);

        }

    });

});


/* =========================================================
BACK BUTTON
========================================================= */

backBtn.addEventListener("click", () => {

    if (
        themesView.classList.contains("active") ||
        fontsView.classList.contains("active")
    ) {

        showSettingsView(settingsHome);

        return;

    }

    settingsPage.classList.remove("active");

    calculatorPage.classList.remove("hidden");

});


/* =========================================================
AVAILABLE THEMES
========================================================= */

const availableThemes = [

    "blue",
    "green",
    "red",
    "yellow",
    "pink",
    "purple",
    "orange",
    "lemon",
    "white",
    "black",
    "darkblue",
    "brown",
    "liquid",
    "plg",
    "rlg",
    "wednesday",
    "squidgame"

];


/* =========================================================
THEME ANIMALS
========================================================= */

const animalImages = {

    blue: "animals/stitch.png",
    green: "animals/crocodile.png",
    red: "animals/tomato.png",
    pink: "animals/unicorn.png",
    yellow: "animals/chicken.png",
    lemon: "animals/lemon.png",
    brown: "animals/cookie.png",
    black: "animals/peni.png",
    purple: "animals/pouf.png",
    white: "animals/panda.png"

};


/* =========================================================
APPLY THEME
========================================================= */

function applyTheme(theme) {

    if (!availableThemes.includes(theme)) {

        theme = "blue";

    }

    availableThemes.forEach(item => {

        document.body.classList.remove(
            "theme-" + item
        );

    });

    document.body.classList.add(
        "theme-" + theme
    );

    themeButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.theme === theme
        );

    });

    if (animalImages[theme]) {

        themeAnimal.src = animalImages[theme];

        themeAnimal.style.display = "block";

    } else {

        themeAnimal.style.display = "none";

    }

    try {

        localStorage.setItem(
            "calculatorTheme",
            theme
        );

    }

    catch (error) {

        console.warn(
            "Theme could not be saved.",
            error
        );

    }

}


/* =========================================================
LOAD SAVED THEME
========================================================= */

let savedTheme = "blue";

try {

    savedTheme =
        localStorage.getItem("calculatorTheme") || "blue";

}

catch (error) {

    console.warn("LocalStorage unavailable.");

}

applyTheme(savedTheme);


/* =========================================================
THEME BUTTON EVENTS
========================================================= */

themeButtons.forEach(button => {

    button.addEventListener("click", () => {

        const theme = button.dataset.theme;

        applyTheme(theme);

    });

});


/* =========================================================
AVAILABLE FONTS
========================================================= */

const availableFonts = [

    "iphone",
    "device",
    "vazir"

];


/* =========================================================
APPLY FONT
========================================================= */

function applyFont(font) {

    if (!availableFonts.includes(font)) {

        font = "iphone";

    }

    availableFonts.forEach(item => {

        document.body.classList.remove(
            "font-" + item
        );

    });

    document.body.classList.add(
        "font-" + font
    );

    fontButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.font === font
        );

    });

    try {

        localStorage.setItem(
            "calculatorFont",
            font
        );

    }

    catch (error) {

        console.warn(
            "Font could not be saved.",
            error
        );

    }

}


/* =========================================================
LOAD SAVED FONT
========================================================= */

let savedFont = "iphone";

try {

    savedFont =
        localStorage.getItem("calculatorFont") || "iphone";

}

catch (error) {

    console.warn("LocalStorage unavailable.");

}

applyFont(savedFont);


/* =========================================================
FONT BUTTON EVENTS
========================================================= */

fontButtons.forEach(button => {

    button.addEventListener("click", () => {

        const font = button.dataset.font;

        applyFont(font);

    });

});


/* =========================================================
KEYBOARD
========================================================= */

document.addEventListener("keydown", event => {

    if (settingsPage.classList.contains("active")) {
        return;
    }

    const key = event.key;

    if (/^[0-9.]$/.test(key)) {

        addNumber(key);

        return;

    }

    if (["+", "-", "*", "/", "%"].includes(key)) {

        chooseOperator(key);

        return;

    }

    if (key === "(" || key === ")") {

        insertParenthesis(key);

        return;

    }

    if (key === "Enter" || key === "=") {

        event.preventDefault();

        calculate(true);

        return;

    }

    if (key === "Backspace") {

        deleteNumber();

        return;

    }

    if (key === "Escape") {

        clearCalculator();

    }

});


/* =========================================================
START
========================================================= */

updateDisplay();