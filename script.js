const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const decisionTrees = {
    headache: {
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
    stomachGIDistress: {
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
    anxietyStress: {
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
    lightheadedness: {
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
    soreThroat: {
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
    cough: {
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
    nausea: {
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
    insomnia: {
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
    }
}

function traverseTree(symptom, responses) {
    node = decisionTrees[symptom];

    for (let response of responses) {
        if (node.next && node.next[response]) {
            node = node.next[response];
        } else {
            return {message: "Sry there was an error. :("}
        }

        return node.message ? {message: node.message} : {question: node.question, options: node.options};
    }
}

app.post("/api/symptom", (req, res) => {
    const {symptom, response} = req.body;

    if (!symptom || !desicionTrees[symptom]) {
        return res.status(400).json({error: "Invalid symptom"});
    }

    const result = traverseDecisionTree(symptom, responseHistory || []);
    res.json(result);
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));