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
                "No": {message: "A little caffeine boost might help perk you up! Maybe a cozy cup of tea or a small coffee? ☕✨"},
                "Yes": {question: "Have you had enough water today?", options: ["Yes", "No"], next: {
                    "No": {message: "Hydration is key! Take a sip, your body will thank you. 💦🐠"},
                    "Yes": {question: "Are you especially anxious or stressed?", options: ["Yes", "No"], next: {
                        "Yes": {message: "Try a deep breath, a short walk, or even some light stretching! Music and journaling can help too. 🎶✨"},
                        "No": {question: "Have you eaten enough today?", options: ["Yes", "No"], next: {
                            "No": {message: "Your brain needs fuel! Grab a tasty snack or a balanced meal to keep yourself feeling strong. 🍽️🐟"},
                            "Yes": {question: "Is it likely that your eyes are strained, or you are otherwise overstimulated?", options: ["Yes", "No"], next: {
                                "Yes": {message: "Look away from your screen for a moment! Try the 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds. Maybe blink a little extra, too! 😉"},
                                "No": {message: "Try drinking water, resting in a quiet space, or massaging your temples. If it's tension-related, some gentle stretching might help! 🌿💆"}
                            }}
                        }}
                    }}
                }}
            }},
            "No": {question: "Have you had enough water today?", options: ["Yes", "No"], next: {
                "No": {message: "Hydration is key! Take a sip, your body will thank you. 💦🐠"},
                "Yes": {question: "Are you especially anxious or stressed?", options: ["Yes", "No"], next: {
                    "Yes": {message: "Try a deep breath, a short walk, or even some light stretching! Music and journaling can help too. 🎶✨"},
                    "No": {question: "Have you eaten enough today?", options: ["Yes", "No"], next: {
                        "No": {message: "Your brain needs fuel! Grab a tasty snack or a balanced meal to keep yourself feeling strong. 🍽️🐟"},
                        "Yes": {question: "Is it likely that your eyes are strained, or you are otherwise overstimulated?", options: ["Yes", "No"], next: {
                            "Yes": {message: "Look away from your screen for a moment! Try the 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds. Maybe blink a little extra, too! 😉"},
                            "No": {message: "Try drinking water, resting in a quiet space, or massaging your temples. If it's tension-related, some gentle stretching might help! 🌿💆"}
                        }}
                    }}
                }}
            }}
        }
    },
    fatigue: {
        question: "Have you gotten at least eight hours of sleep most nights this week?", options: ["Yes", "No"], next: {
            "Yes": {question: "Do you regularly use your phone right before sleeping?", options: ["Yes", "No"], next: {
                "Yes": {message: "Give your brain some time to unwind! Try a book, some relaxing music, or dim lighting instead. 🌙✨"},
                "No": {question: "Do you regularly consume stimulants (caffeine, nicotine) within three hours of sleeping?", options: ["Yes", "No"], next: {
                    "Yes": {message: "Your body needs time to wind down! Maybe swap that late-night coffee for herbal tea or a warm drink? ☕🌿"},
                    "No": {question: "Are you especially anxious or stressed?", options: ["Yes", "No"], next: {
                        "Yes": {message: "A little meditation, a gratitude list, or some soft music can help you drift off peacefully. Sweet dreams! 🌙💤"},
                        "No": {question: "Does your diet largely consist of fast food?", options: ["Yes", "No"], next: {
                            "Yes": {message: "More greens, more whole foods, and plenty of nutrients can do wonders for your energy and mood! 🌱🍊"},
                            "No": {question: "Do you have pre-existing conditions or circunstances that might cause fatigue (depression, burnout, etc.)", options: ["Yes", "No"], next: {
                                "Yes": {message: "If you have a pre-existing condition, remember to check in with yourself. You deserve care and rest! 🩵"},
                                "No": {message: "Small movement breaks, good hydration, and nutritious food can help keep your energy steady. Take it easy when you need to! 🌞"}
                            }}
                        }}
                    }}
                }}
            }},
            "No": {message: "Try a consistent bedtime, a comfy sleep setup, and limiting screen time before bed! Your body needs good rest. 😴💙"}
        }
    },
    mood_swings: {
        question: "Have you gotten at least eight hours of sleep most nights this week?", options: ["Yes", "No"], next: {
            "Yes": {question: "Are you especially stressed or anxious, or otherwise in a bad headspace?", options: ["Yes", "No"], next: {
                "Yes": {message: "Try shifting focus with a hobby, a chat with a friend, or stepping outside for fresh air. You're not alone! 💕🐟"},
                "No": {question: "Do you consume a lot of \"junk food\"?", options: ["Yes", "No"], next: {
                    "Yes": {message: "Nutritious food can help with mood, energy, and focus. Treat yourself to something fresh and wholesome! 🥑💚"},
                    "No": {question: "Are you especially anxious or stressed?", options: ["Yes", "No"], next: {
                        "Yes": {message: "Deep breathing, light exercise, and creative activities can work wonders! Find what soothes you. 🌿💆"},
                        "No": {question: "Are there any external factors in your life that might unknowingly cause irritation or unease?", options: ["Yes", "No"], next: {
                            "Yes": {message: "Your space is your sanctuary! Try setting boundaries, creating a cozy vibe, and letting go of outside stress. 🏡✨"},
                            "No": {message: "Steady meals, good sleep, and self-care can help balance things out. And don’t forget to be kind to yourself! 💖"}
                        }}
                    }}
                }}
            }},
            "No": {message: "Try a consistent bedtime, a comfy sleep setup, and limiting screen time before bed! Your body needs good rest. 😴💙"}
        }
    },
}

function traverseTree(symptom, responses) {
    let node = decisionTrees[symptom];

    for (let response of responses) {
        console.log(`Processing response: ${response}`);
        console.log("Response:" + response);
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