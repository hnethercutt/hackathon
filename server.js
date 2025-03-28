const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const decisionTrees = {
    headache: {
        question: "Hungery?",
        options: ["Yes", "No"],
        next: {
            "Yes": { question: "Vey hungy?", options: ["Yes", "No"], next: {
                "Yes": { message: "Super hungry." },
                "No": { message: "Medium hungry." }
            }},
            "No": { question: "Question?", options: ["Yes", "No"], next: {
                "Yes": { message: "Message." },
                "No": { message: "Message." }
            }}
        }
    },
    fatigue: {
        question: "Question?",
        options: ["Yes", "No"],
        next: {
            "Yes": { question: "Question?", options: ["Yes", "No"], next: {
                "Yes": { message: "Message." },
                "No": { message: "Message." }
            }},
            "No": { question: "Question?", options: ["Yes", "No"], next: {
                "Yes": { message: "Message." },
                "No": { message: "Message." }
            }}
        }
    },
}

function traverseTree(symptom, responses) {
    let node = decisionTrees[symptom];

    for (let response of responses) {
        console.log(`Processing response: ${response}`);
        console.log("Response:" + response);
        console.log(node.next);
        if (node.next && node.next[response]) {
            node = node.next[response];
        } else {
            return {message: "Sry there was an error. :("}
        }
    }
    return node.message 
        ? {message: node.message} 
        : {question: node.question, options: node.options};
}

app.post("/api/symptom", (req, res) => {
    const {symptom, responseHistory} = req.body;

    if (!symptom || !decisionTrees[symptom]) {
        return res.status(400).json({error: "Invalid symptom"});
    }

    const result = traverseTree(symptom, responseHistory || []);
    res.json(result);
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));