// -------------------------------------
// Load existing clients from localStorage
// -------------------------------------
let clients = JSON.parse(localStorage.getItem("clients")) || [];

// -------------------------------------
// Validation helpers
// -------------------------------------
function clearErrors() {
    document.querySelectorAll("input.error, select.error").forEach(el => {
        el.classList.remove("error");
    });
}

function markInvalid(el) {
    if (el) el.classList.add("error");
}

function validateClientForm() {
    clearErrors();

    const fullName = document.getElementById("fullName");
    const age = document.getElementById("age");
    const gender = document.getElementById("gender");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const goal = document.getElementById("goal");
    const startDate = document.getElementById("startDate");

    const errors = [];

    // Full name: required, at least 3 chars
    if (!fullName.value.trim() || fullName.value.trim().length < 3) {
        errors.push("Please enter a full name (at least 3 characters).");
        markInvalid(fullName);
    }

    // Age: optional but if provided, must be reasonable
    if (age.value) {
        const ageVal = Number(age.value);
        if (Number.isNaN(ageVal) || ageVal < 10 || ageVal > 100) {
            errors.push("Please enter a valid age between 10 and 100.");
            markInvalid(age);
        }
    }

    // Email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
        errors.push("Please enter a valid email address.");
        markInvalid(email);
    }

    // Phone: 8-15 digits, spaces or dashes allowed
    const phonePattern = /^\+?\d[\d\s-]{7,14}$/;
    if (!phone.value.trim() || !phonePattern.test(phone.value.trim())) {
        errors.push("Please enter a valid phone number (8-15 digits; digits, spaces, and - allowed).");
        markInvalid(phone);
    }

    // Gender: required
    if (gender.value === "") {
        errors.push("Please select a gender.");
        markInvalid(gender);
    }

    // Fitness goal selection
    if (goal.value === "") {
        errors.push("Please select a fitness goal.");
        markInvalid(goal);
    }

    // Start date: required, not in the future
    if (!startDate.value) {
        errors.push("Please choose a membership start date.");
        markInvalid(startDate);
    } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const chosen = new Date(startDate.value);
        if (chosen > today) {
            errors.push("Membership start date cannot be in the future.");
            markInvalid(startDate);
        }
    }

    if (errors.length > 0) {
        alert(errors.join("\n"));
        return false;
    }

    return true;
}

// Render clients on page load
window.onload = () => {
    renderTable();
};

// -------------------------------------
// Add Client Button
// -------------------------------------
document.getElementById("addClientBtn").addEventListener("click", function () {

    // Run validation first
    if (!validateClientForm()) {
        return;
    }

    // Read form values (after validation passes)
    const fullName = document.getElementById("fullName").value.trim();
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const goal = document.getElementById("goal").value;
    const startDate = document.getElementById("startDate").value;

    // Create new client object
    const newClient = {
        fullName,
        age,
        gender,
        email,
        phone,
        goal,
        startDate,
        // Optional extra fields for later use
        trainingHistory: [],
        nextExercises: []
    };

    // Add to array
    clients.push(newClient);

    // Save to localStorage
    localStorage.setItem("clients", JSON.stringify(clients));

    // Update table
    renderTable();

    // Clear form + error state
    document.querySelector("form").reset();
    clearErrors();

    alert("Client added successfully!");
});


// -------------------------------------
// Save Client Button
// -------------------------------------
document.getElementById("saveClientBtn").addEventListener("click", function () {

    if (!validateClientForm()) {
        return;
    }

    const index = document.getElementById("editingIndex").value;

    // Preserve existing trainingHistory and nextExercises if present
    const existing = clients[index] || {};

    // Update the client
    clients[index] = {
        fullName: document.getElementById("fullName").value.trim(),
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        goal: document.getElementById("goal").value,
        startDate: document.getElementById("startDate").value,
        trainingHistory: existing.trainingHistory || [],
        nextExercises: existing.nextExercises || []
    };

    // Save to localStorage
    localStorage.setItem("clients", JSON.stringify(clients));

    // Re-render table
    renderTable();

    // Reset form + errors
    document.querySelector("form").reset();
    document.getElementById("editingIndex").value = "";
    clearErrors();

    // Switch back to Add Client mode
    document.getElementById("addClientBtn").style.display = "inline-block";
    document.getElementById("saveClientBtn").style.display = "none";

    alert("Client details updated!");
});


// -------------------------------------
// Render Table
// -------------------------------------
function renderTable() {
    const tbody = document.getElementById("clientTableBody");
    tbody.innerHTML = "";

    clients.forEach((client, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${client.fullName}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td>${client.goal}</td>
            <td>${client.startDate}</td>
            <td>
                <button class="link" onclick="editClient(${index}); event.stopPropagation();">Edit</button>
                <button class="link" onclick="deleteClient(${index}); event.stopPropagation();">Delete</button>
            </td>
        `;

        // Click row to view client details
        row.addEventListener("click", () => {
            localStorage.setItem("selectedClientIndex", String(index));
            localStorage.setItem("selectedClient", JSON.stringify(client)); // optional backup
            window.location.href = "client.html";
        });

        tbody.appendChild(row);
    });
}

// -------------------------------------
// Delete Client
// -------------------------------------
function deleteClient(index) {
    if (!confirm("Are you sure you want to delete this client?")) return;

    clients.splice(index, 1);
    localStorage.setItem("clients", JSON.stringify(clients));
    renderTable();
}


// -------------------------------------
// Edit Client
// -------------------------------------
function editClient(index) {
    const client = clients[index];

    document.getElementById("fullName").value = client.fullName;
    document.getElementById("age").value = client.age;
    document.getElementById("gender").value = client.gender;
    document.getElementById("email").value = client.email;
    document.getElementById("phone").value = client.phone;
    document.getElementById("goal").value = client.goal;
    document.getElementById("startDate").value = client.startDate;

    document.getElementById("editingIndex").value = index;

    document.getElementById("addClientBtn").style.display = "none";
    document.getElementById("saveClientBtn").style.display = "inline-block";

    window.location.hash = "#new";
}


// -------------------------------------
// Search
// -------------------------------------
document.getElementById("searchInput").addEventListener("input", function () {
    const query = this.value.toLowerCase();

    const rows = document.querySelectorAll("#clientTableBody tr");

    rows.forEach(row => {
        const name = row.children[0].textContent.toLowerCase();
        row.style.display = name.includes(query) ? "" : "none";
    });
});
