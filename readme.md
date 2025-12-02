Fit4Life — Client Management Web App

A simple, lightweight fitness-client management system built with HTML, CSS, and JavaScript, designed to help fitness trainers manage clients, view their details, and generate personalized exercise suggestions.

The system is fully browser-based and uses LocalStorage for persistence (no backend required).

✨ Features
1. Add & Edit Clients

Full client form with validation:

Full Name (required)

Age (optional, validated when filled)

Gender (required)

Email (required + validation)

Phone (required + validation)

Fitness Goal (required)

Membership Start Date (required & cannot be in the future)

Edit existing clients

Delete clients with confirmation

All data is saved to LocalStorage

2. Client List View

Displays all clients in a clean, responsive table

Search by name

Click Edit or Delete from the list

Click anywhere else on the row to open the full Client Details page

3. Client Details Page (client.html)

Completely redesigned to match the main page theme

Shows:

Name

Email

Phone

Fitness goal

Membership start date

Training history

Persisted “Exercises for Next Session”

4. Persistent Exercise Suggestions

Each client receives a unique set of 5 exercises.

✔ Generated once per client
✔ Loaded instantly on refresh
✔ Stored inside each client object in LocalStorage
✔ Never regenerates unless the client is deleted or manually reset

This ensures each client has their own saved session plan.

5. Consistent UI Design

Both pages (index.html and client.html) now share:

Responsive layout

Card-based sections

Unified header and footer

Clean typography and spacing

Same CSS theme (styles.css)

📁 File Structure
/
├── index.html            # Main page: create clients + list view
├── client.html           # Detailed page for a single client
├── css/
│   └── styles.css        # Unified design for all pages
├── js/
│   ├── main.js           # Client creation, editing, table rendering, validation
│   └── client.js         # Loads a single client + persistent exercise logic
├── assets/
│   └── fit.png           # Logo
└── readme.md

Deployment Method is through github pages
