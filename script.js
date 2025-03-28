// select ID is "symptom"
// make symptom element selection required

import { beHelpful } from "./chatBot.mjs";

let symptom = "";
let responseHistory = [];

async function submitSymptom() {
    symptom = document.getElementById("symptom").value;
    responseHistory = [];
    await fetchNextStep();
}

async function fetchNextStep(response = null) {
    if (response) {
        responseHistory.push(response);
    }

    try {
        const res = await fetch(`http://localhost:3000/api/symptom`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({symptom, responseHistory})
        });

        const data = await res.json();
        displayResponse(data);
    } catch (error) {
        console.log(error);
    }
}

function displayResponse(data) {
    const responseDiv = document.getElementById("response");
    responseDiv.innerHTML = "";

    if (data.question) {
        responseDiv.innerHTML = `<p>${data.question}</p>`;
        data.options.forEach(option => {
            const button = document.createElement("button");
            button.textContent = option;
            button.onclick = () => fetchNextStep(option);
            responseDiv.appendChild(button);
        });
    } else if (data.message) {
        responseDiv.innerHTML = `<p><strong>${beHelpful(data.message)}</strong></p>`;
    }
}