const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const decisionTrees = {
    headache: {
        question: "Do you drink caffeine daily?", options: ["Yes", "No"], next: {
            "Yes": {question: "Have you had your normal amount of caffeine today?", options: ["Yes", "No"], next: {
                "No": {message: "drink a bit of caffeine"},
                "Yes": {question: "Have you had enough water today?", options: ["Yes", "No"], next: {
                    "No": {message: "drink some water"},
                    "Yes": {question: "Are you especially anxious or stressed?", options: ["Yes", "No"], next: {
                        "Yes": {message: "reccomend some activities to reduce stress/anxiety"},
                        "No": {question: "Have you eaten enough today?", options: ["Yes", "No"], next: {
                            "No": {message: "eat some food"},
                            "Yes": {question: "Is it likely that your eyes are strained, or you are otherwise overstimulated?", options: ["Yes", "No"], next: {
                                "Yes": {message: "reccomend some activities to reduce eye strain"},
                                "No": {message: "give some general tips to help with a typical headache"}
                            }}
                        }}
                    }}
                }}
            }},
            "No": {question: "Have you had enough water today?", options: ["Yes", "No"], next: {
                "No": {message: "drink some water"},
                "Yes": {question: "Are you especially anxious or stressed?", options: ["Yes", "No"], next: {
                    "Yes": {message: "reccomend some activities to reduce stress/anxiety"},
                    "No": {question: "Have you eaten enough today?", options: ["Yes", "No"], next: {
                        "No": {message: "eat some food"},
                        "Yes": {question: "Is it likely that your eyes are strained, or you are otherwise overstimulated?", options: ["Yes", "No"], next: {
                            "Yes": {message: "reccomend some activities to reduce eye strain"},
                            "No": {message: "give some general tips to help with a typical headache"}
                        }}
                    }}
                }}
            }}
        }
    },
    fatigue: {
        question: "Have you gotten at least eight hours of sleep most nights this week?", options: ["Yes", "No"], next: {
            "Yes": {question: "Do you regularly use your phone right before sleeping?", options: ["Yes", "No"], next: {
                "Yes": {message: "reccomend reducing phone usage before bed or using a blue light filter"},
                "No": {question: "Do you regularly consume stimulants (caffeine, nicotine) within three hours of sleeping?", options: ["Yes", "No"], next: {
                    "Yes": {message: "consume fewer stimulants before sleeping"},
                    "No": {question: "Are you especially anxious or stressed?", options: ["Yes", "No"], next: {
                        "Yes": {message: "reccomend some activities one can do to reduce stress/anxiety before bed"},
                        "No": {question: "Does your diet largely consist of fast food?", options: ["Yes", "No"], next: {
                            "Yes": {message: "eat a more healthy diet"},
                            "No": {question: "Do you have pre-existing conditions or circunstances that might cause fatigue (depression, burnout, etc.)", options: ["Yes", "No"], next: {
                                "Yes": {message: "note that the user may be experiencing issues related to pre-existing conditions and remind them to take care of themselves"},
                                "No": {message: "give some general tips to reduce overall fatigue"}
                            }}
                        }}
                    }}
                }}
            }},
            "No": {message: "get better sleep and get more sleep"}
        }
    },
    mood_swings: {
        question: "Have you gotten at least eight hours of sleep most nights this week?", options: ["Yes", "No"], next: {
            "Yes": {question: "Are you especially stressed or anxious, or otherwise in a bad headspace?", options: ["Yes", "No"], next: {
                "Yes": {message: "give some tips for mitigating a bad headspace"},
                "No": {question: "Do you consume a lot of \"junk food\"?", options: ["Yes", "No"], next: {
                    "Yes": {message: "eat healthier"},
                    "No": {question: "Are you especially anxious or stressed?", options: ["Yes", "No"], next: {
                        "Yes": {message: "reccomend some tips to redice general stress/anxiety"},
                        "No": {question: "Are there any external factors in your life that might unknowingly cause irritation or unease?", options: ["Yes", "No"], next: {
                            "Yes": {message: "focus on not letting external factors affect one's sense of peace while at home"},
                            "No": {message: "give some general tips on improving mood swings"}
                        }}
                    }}
                }}
            }},
            "No": {message: "get better sleep"}
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