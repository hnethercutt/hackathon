// element ID symptom
// make symptom element selection required

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

    console.log("Sending data to backend:", {symptom, responseHistory}); // Log sent data

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
        responseDiv.innerHTML = `<p><strong>${data.message}</strong></p>`;
    }
}