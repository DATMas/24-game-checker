let savedSolution = "";

function generateHands(inputs) {

    let hands = [[]];

    for (let val of inputs) {

        let possibleValues;

        if (val === "A") {
            possibleValues = [1, 11];
        } else {
            possibleValues = [Number(val)];
        }

        let newHands = [];

        for (let hand of hands) {

            for (let p of possibleValues) {

                newHands.push([
                    ...hand,
                    {
                        value: p,
                        expr: p.toString()
                    }
                ]);
            }
        }

        hands = newHands;
    }

    return hands;
}

function getRandomPhrase(phrases) {
    return phrases[Math.floor(Math.random() * phrases.length)];
}

function check24() {

    savedSolution = "";
    document.getElementById("solution").innerText = "";

    const inputs = [
        document.getElementById("n1").value,
        document.getElementById("n2").value,
        document.getElementById("n3").value,
        document.getElementById("n4").value
    ];

    // Check empty  
    for (let val of inputs) {
        if (val === "") {
            document.getElementById("result").innerText = "Please fill all 4 numbers";
            return;
        }
    }
    // Convert strings to numbers
    //const nums = inputs.map(x => ({
    //    value: Number(x),
    //    expr: x
    //}));
    const hands = generateHands(inputs);

    let result = false;

    for (let hand of hands) {

        if (judgePoint24(hand)) {

            result = true;
            break;
        }
    }

    console.log(inputs);


    const solvablePhrases = [
        "✅ Come on! You can make 24!",
        "✅ Come on Fad! You can make 24!",
        "✅ It's in there — keep thinking!",
        "✅ Yes! These cards have a solution.",
        "✅ Don't give up, there's a way!",
        "✅ A 24 is hiding in those numbers…",
        "✅ I believe in you. You are the CEO of numbers",
        "✅ Come on Cor! You are the CEO of numbers",
        "✅ You got this Cor! Its your day off"
    ];
    const unsolvablePhrases = [
        "❌ No solution this time.",
        "❌ These cards can't make 24.",
        "❌ Not every hand is a winner!",
        "❌ Dead end — try a new deal.",
        "❌ You are right Cor - it cant be solved.",
        "❌ You were right to check. No solution."
    ];

    if (result) {

        document.getElementById("result").innerText = getRandomPhrase(solvablePhrases);
            //"✅ Come on Fad! You can make 24!";

        document.getElementById("revealBtn").style.display =
            "inline";

    } else {

        document.getElementById("result").innerText = getRandomPhrase(unsolvablePhrases);
            //"❌ Cannot make 24";

        document.getElementById("revealBtn").style.display =
            "none";
    }
}

function showSolution() {

    document.getElementById("solution").innerText =
        savedSolution;
}

function judgePoint24(nums) {
    const EPSILON = 1e-6;

    function backtrack(numbers) {

        // Base case
        if (numbers.length === 1) {
            if (Math.abs(numbers[0].value - 24) < EPSILON) {

                savedSolution = numbers[0].expr;

                return true;
            }

            return false;
        }
        

        // Try every pair
        for (let i = 0; i < numbers.length; i++) {
            for (let j = 0; j < numbers.length; j++) {

                if (i !== j) {

                    let next = [];

                    // Keep unused numbers
                    for (let k = 0; k < numbers.length; k++) {
                        if (k !== i && k !== j) {
                            next.push(numbers[k]);
                        }
                    }

                    // Try operations
                    let results = compute(numbers[i], numbers[j]);

                    for (let r of results) {

                        next.push(r);

                        if (backtrack(next)) {
                            return true;
                        }

                        next.pop();
                    }
                }
            }
        }

        return false;
    }

    function compute(aObj, bObj) {

        const a = aObj.value;
        const b = bObj.value;

        let results = [

            {
                value: a + b,
                expr: `(${aObj.expr} + ${bObj.expr})`
            },

            {
                value: a - b,
                expr: `(${aObj.expr} - ${bObj.expr})`
            },

            {
                value: b - a,
                expr: `(${bObj.expr} - ${aObj.expr})`
            },

            {
                value: a * b,
                expr: `(${aObj.expr} * ${bObj.expr})`
            }
        ];

        if (Math.abs(b) > EPSILON) {

            results.push({
                value: a / b,
                expr: `(${aObj.expr} / ${bObj.expr})`
            });
        }

        if (Math.abs(a) > EPSILON) {

            results.push({
                value: b / a,
                expr: `(${bObj.expr} / ${aObj.expr})`
            });
        }

        return results;
    }

    return backtrack(nums);
}

const dropdowns = document.querySelectorAll(".playing-card");

for (let card of dropdowns) {

    card.addEventListener("change", () => {

        card.classList.add("flipping");

        setTimeout(() => {
            card.classList.remove("flipping");
        }, 450);
    });
}