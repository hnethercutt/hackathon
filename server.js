// 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
import OpenAI from "openai";

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const client = new OpenAI

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const decisionTrees = {
    headache: {
        question: "Do you drink caffeine daily?", options: ["Yes", "No"], next: {
            "Yes": {question: "Have you had your normal amount of caffeine today?", options: ["Yes", "No"], next: {
                "No": {message: "Caffeine"},
                "Yes": {question: "Have you had enough water today?", options: ["Yes", "No"], next: {
                    "No": {message: "Dehydration"},
                    "Yes": {question: "Are you especially anxious or stressed?", options: ["Yes", "No"], next: {
                        "Yes": {message: "Stress/anxiety"},
                        "No": {question: "Have you eaten enough today?", options: ["Yes", "No"], next: {
                            "No": {message: "Hunger"},
                            "Yes": {question: "Is it likely that your eyes are strained, or you are otherwise overstimulated?", options: ["Yes", "No"], next: {
                                "Yes": {message: "Eye strain"},
                                "No": {message: "Mystery"}
                            }}
                        }}
                    }}
                }}
            }},
            "No": {question: "Have you had enough water today?", options: ["Yes", "No"], next: {
                "No": {message: "Dehydration"},
                "Yes": {question: "Are you especially anxious or stressed?", options: ["Yes", "No"], next: {
                    "Yes": {message: "Stress/anxiety"},
                    "No": {question: "Have you eaten enough today?", options: ["Yes", "No"], next: {
                        "No": {message: "Hunger"},
                        "Yes": {question: "Is it likely that your eyes are strained, or you are otherwise overstimulated?", options: ["Yes", "No"], next: {
                            "Yes": {message: "Eye strain"},
                            "No": {message: "Mystery"}
                        }}
                    }}
                }}
            }}
        }
    },
    fatigue: {
        question: "Have you gotten at least eight hours of sleep most nights this week?", options: ["Yes", "No"], next: {
            "Yes": {question: "Do you regularly use your phone right before sleeping?", options: ["Yes", "No"], next: {
                "Yes": {message: "Blue light"},
                "No": {question: "Do you regularly consume stimulants (caffeine, nicotine) within three hours of sleeping?", options: ["Yes", "No"], next: {
                    "Yes": {message: "Stimulants"},
                    "No": {question: "Are you especially anxious or stressed?", options: ["Yes", "No"], next: {
                        "Yes": {message: "Stress/anxiety"},
                        "No": {question: "Does your diet largely consist of fast food?", options: ["Yes", "No"], next: {
                            "Yes": {message: "Poor diet"},
                            "No": {question: "Do you have pre-existing conditions or circunstances that might cause fatigue (depression, burnout, etc.)", options: ["Yes", "No"], next: {
                                "Yes": {message: "Preexisting conditions."},
                                "No": {message: "Mystery"}
                            }}
                        }}
                    }}
                }}
            }},
            "No": {message: "Sleep deprivation"}
        }
    },
    mood_swings: {
        question: "Have you gotten at least eight hours of sleep most nights this week?", options: ["Yes", "No"], next: {
            "Yes": {question: "Are you especially stressed or anxious, or otherwise in a bad headspace?", options: ["Yes", "No"], next: {
                "Yes": {message: "Bad headspace"},
                "No": {question: "Do you consume a lot of \"junk food\"?", options: ["Yes", "No"], next: {
                    "Yes": {message: "Stimulants"},
                    "No": {question: "Are you especially anxious or stressed?", options: ["Yes", "No"], next: {
                        "Yes": {message: "Stress/anxiety"},
                        "No": {question: "Does your diet largely consist of fast food?", options: ["Yes", "No"], next: {
                            "Yes": {message: "Poor diet"},
                            "No": {question: "Are there any external factors in your life that might unknowingly cause irritation or unease?", options: ["Yes", "No"], next: {
                                "Yes": {message: "External factors."},
                                "No": {message: "Mystery"}
                            }}
                        }}
                    }}
                }}
            }},
            "No": {message: "Sleep deprivation"}
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