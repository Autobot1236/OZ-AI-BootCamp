function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function calculate(formula) {
    // 인자가 없으면 prompt로 계산식 입력받기
    let input = formula;
    if (input === undefined || input === null) {
        input = window.prompt("계산식을 입력하세요.\n숫자와 연산자를 띄어쓰기로 구분해주세요.");
    }

    // 취소 or 빈 입력
    if (input === null || input.trim() === "") {
        console.log("계산식을 입력해주세요.");
        return;
    }

    const tokens = input.trim().split(/\s+/);

    // 토큰이 홀수 개(숫자, 연산자, 숫자...)여야 함
    if (tokens.length < 3 || tokens.length % 2 === 0) {
        console.log("에러: 잘못된 계산식입니다. 숫자와 연산자를 띄어쓰기로 구분해주세요.");
        console.log("예시: 1 + 2 * 3 - 4 / 2");
        return;
    }

    // ── 1단계: *, / 먼저 처리 ──
    const intermediateTokens = [];
    let i = 0;

    while (i < tokens.length) {
        const token = tokens[i];

        if (token === "*" || token === "/") {
            const left = Number(intermediateTokens.pop());
            const right = Number(tokens[i + 1]);

            if (isNaN(left) || isNaN(right)) {
                console.log("에러: 잘못된 숫자가 포함되어 있습니다.");
                return;
            }

            let res;
            if (token === "*") {
                res = multiply(left, right);
            } else {
                if (right === 0) {
                    console.log("에러: 0으로 나눌 수 없습니다.");
                    return;
                }
                res = divide(left, right);
            }
            intermediateTokens.push(res);
            i += 2;
        } else {
            intermediateTokens.push(token);
            i++;
        }
    }

    // ── 2단계: +, - 처리 ──
    let result = Number(intermediateTokens[0]);

    if (isNaN(result)) {
        console.log("에러: 잘못된 숫자가 포함되어 있습니다.");
        return;
    }

    for (let j = 1; j < intermediateTokens.length; j += 2) {
        const operator = intermediateTokens[j];
        const nextValue = Number(intermediateTokens[j + 1]);

        if (isNaN(nextValue)) {
            console.log("에러: 잘못된 숫자가 포함되어 있습니다.");
            return;
        }

        if (operator === "+") {
            result = add(result, nextValue);
        } else if (operator === "-") {
            result = subtract(result, nextValue);
        } else {
            console.log(`에러: 지원하지 않는 연산자 → ${operator}`);
            return;
        }
    }

    console.log(`📌 계산식: ${input}`);
    console.log(`✅ 결과:   ${result}`);
}
