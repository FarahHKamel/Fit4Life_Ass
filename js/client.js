document.addEventListener("DOMContentLoaded", async () => {
    // Load all clients from localStorage
    const clients = JSON.parse(localStorage.getItem("clients")) || [];

    // Get selected client index
    const indexStr = localStorage.getItem("selectedClientIndex");
    let client = null;
    let clientIndex = -1;

    if (indexStr !== null) {
        const idx = Number(indexStr);
        if (!Number.isNaN(idx) && clients[idx]) {
            client = clients[idx];
            clientIndex = idx;
        }
    }

    // Fallback: try old "selectedClient" object if index not found
    if (!client) {
        const clientData = localStorage.getItem("selectedClient");
        if (!clientData) {
            alert("No client selected!");
            return;
        }
        client = JSON.parse(clientData);
    }

    // 1. Populate client info
    document.getElementById("clientName").textContent = client.fullName || "";
    document.getElementById("clientEmail").textContent = client.email || "";
    document.getElementById("clientPhone").textContent = client.phone || "";
    document.getElementById("clientGoal").textContent = client.goal || "";
    document.getElementById("clientStartDate").textContent = client.startDate || "";

    // 2. Populate Training History (if any)
    const historyList = document.getElementById("trainingHistory");
    historyList.innerHTML = "";

    const history = client.trainingHistory || [];
    if (history.length > 0) {
        history.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            historyList.appendChild(li);
        });
    } else {
        const li = document.createElement("li");
        li.textContent = "No training history yet.";
        historyList.appendChild(li);
    }

    // 3. Exercises for next session (persist per client)
    const nextList = document.getElementById("nextExercises");
    const status = document.getElementById("exerciseStatus");
    nextList.innerHTML = "";
    status.textContent = "";

    // Helper to render exercises
    function renderExercises(exNames) {
        nextList.innerHTML = "";
        exNames.forEach(name => {
            const li = document.createElement("li");
            li.textContent = name;
            nextList.appendChild(li);
        });
    }

    // If this client already has saved exercises, just show them
    if (client.nextExercises && client.nextExercises.length > 0) {
        status.textContent = "Loaded previously suggested exercises for this client.";
        renderExercises(client.nextExercises);
        return;
    }

    // Otherwise, fetch and generate a new list (once)
    try {
        status.textContent = "Loading exercises for this client...";

        const resp = await fetch("https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json");
        const allExercises = await resp.json();

        // Very simple random suggestion (you can later filter by goal)
        const shuffled = allExercises.sort(() => 0.5 - Math.random());
        const suggested = shuffled.slice(0, 5);
        const exerciseNames = suggested.map(ex => ex.name || "Unnamed exercise");

        // Save them into the client (if we know the index)
        if (clientIndex >= 0 && clients[clientIndex]) {
            clients[clientIndex].nextExercises = exerciseNames;
            localStorage.setItem("clients", JSON.stringify(clients));
        } else {
            // If no index, just attach to the local object
            client.nextExercises = exerciseNames;
        }

        status.textContent = "Suggested exercises have been saved for this client.";
        renderExercises(exerciseNames);

    } catch (err) {
        console.error("Error fetching exercises:", err);
        status.textContent = "Failed to load exercises.";
        const li = document.createElement("li");
        li.textContent = "Failed to load exercises.";
        nextList.appendChild(li);
    }
});
