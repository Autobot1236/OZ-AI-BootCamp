// =============================================
// caculator_v2.js — JS 사칙연산 계산기 v2
// =============================================

// ── 상태 변수 ──
let isOn = false;        // 전원 상태
let currentInput = "";   // 현재 입력된 계산식
let justCalculated = false; // 계산 직후 여부

// ── 전원 ON/OFF ──
function togglePower() {
    isOn = !isOn;

    const display = document.getElementById("display");
    const onOffBtn = document.querySelector(".on-off");
    const buttons = document.querySelectorAll(".number, .operator, .clear, .enter");

    if (isOn) {
        // 전원 ON
        onOffBtn.classList.add("on");
        onOffBtn.textContent = "ON/OFF";
        display.value = "0";
        currentInput = "";
        justCalculated = false;

        // 버튼 활성화
        buttons.forEach(btn => btn.disabled = false);
    } else {
        // 전원 OFF
        onOffBtn.classList.remove("on");
        display.value = "OFF";
        currentInput = "";

        // 버튼 비활성화
        buttons.forEach(btn => btn.disabled = true);
    }
}

// ── 숫자/소수점 입력 ──
function appendNumber(num) {
    if (!isOn) return;

    const display = document.getElementById("display");

    // 계산 직후 새 숫자 입력 시 초기화
    if (justCalculated) {
        currentInput = "";
        justCalculated = false;
    }

    // 소수점 중복 방지: 현재 숫자 덩어리에 이미 . 있으면 무시
    if (num === ".") {
        const parts = currentInput.split(/[\+\-\*\/]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes(".")) return;
    }

    // 첫 입력이 0인 경우 대체 (0 → 숫자)
    if (currentInput === "0" && num !== ".") {
        currentInput = num;
    } else {
        currentInput += num;
    }

    display.value = currentInput;
}

// ── 연산자 입력 ──
function appendOperator(op) {
    if (!isOn) return;
    if (currentInput === "") return;

    const display = document.getElementById("display");
    justCalculated = false;

    // 마지막 문자가 연산자면 교체
    const lastChar = currentInput.slice(-1);
    if (["+", "-", "*", "/"].includes(lastChar)) {
        currentInput = currentInput.slice(0, -1) + op;
    } else {
        currentInput += op;
    }

    display.value = currentInput;
}

// ── 계산 실행 ──
function performCalculate() {
    if (!isOn) return;
    if (currentInput === "") return;

    const display = document.getElementById("display");

    // 마지막 문자가 연산자면 계산 불가
    const lastChar = currentInput.slice(-1);
    if (["+", "-", "*", "/"].includes(lastChar)) {
        display.value = "오류";
        currentInput = "";
        return;
    }

    try {
        const result = calculate(currentInput);
        display.value = result;
        currentInput = String(result);
        justCalculated = true;
    } catch (e) {
        display.value = "오류";
        currentInput = "";
    }
}

// ── 초기화 ──
function clearDisplay() {
    if (!isOn) return;

    const display = document.getElementById("display");
    currentInput = "";
    justCalculated = false;
    display.value = "0";
}

// ── 사칙연산 계산 (우선순위 적용) ──
function calculate(input) {
    const tokens = input.trim().split(/(?<=[0-9.])(?=[+\-*\/])|(?<=[+\-*\/])(?=[0-9.])/);

    // 공백 기준 split이 아니므로 다시 토큰화
    const tokenList = [];
    let numBuffer = "";

    for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch >= "0" && ch <= "9" || ch === ".") {
            numBuffer += ch;
        } else if (["+", "-", "*", "/"].includes(ch)) {
            if (numBuffer !== "") {
                tokenList.push(Number(numBuffer));
                numBuffer = "";
            }
            tokenList.push(ch);
        }
    }
    if (numBuffer !== "") tokenList.push(Number(numBuffer));

    // 1단계: *, / 먼저
    let i = 0;
    while (i < tokenList.length) {
        if (tokenList[i] === "*" || tokenList[i] === "/") {
            const left = tokenList[i - 1];
            const op = tokenList[i];
            const right = tokenList[i + 1];

            if (op === "/" && right === 0) throw new Error("0으로 나눌 수 없습니다.");

            const res = op === "*" ? left * right : left / right;
            tokenList.splice(i - 1, 3, res);
            i = 0;
        } else {
            i++;
        }
    }

    // 2단계: +, - 처리
    let result = tokenList[0];
    for (let j = 1; j < tokenList.length; j += 2) {
        const op = tokenList[j];
        const val = tokenList[j + 1];
        if (op === "+") result += val;
        else if (op === "-") result -= val;
    }

    // 소수점 처리
    return parseFloat(result.toFixed(10));
}

// ── 초기 상태: 전원 OFF ──
(function init() {
    const buttons = document.querySelectorAll(".number, .operator, .clear, .enter");
    buttons.forEach(btn => btn.disabled = true);
    document.getElementById("display").value = "OFF";
})();
