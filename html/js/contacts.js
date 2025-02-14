// API Calls Module
const fetchContacts = async (userId) => {
    try {
        const response = await fetch(`/api/getAllContacts.php?user_id=${userId}`);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Unknown error");
        }

        return data.contacts;
    } catch (error) {
        console.error("Error fetching contacts:", error);
        throw error;
    }
};

// UI Update Module
const renderContacts = (contacts) => {
    const tableBody = document.getElementById("contacts-table-body");
    const noContactsMessage = document.getElementById("no-contacts-message");

    // Clear the table before rendering new contacts
    tableBody.innerHTML = '';

    //hide/add container with " No Contacts Message"
    if (contacts.length === 0) {
        noContactsMessage.classList.remove("d-none");
    } else {
        noContactsMessage.classList.add("d-none");

        //loop over contacts to create table rows
        contacts.forEach((contact, index) => {
            const row = document.createElement("tr");

            //that speak for itself
            row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${contact.name}</td>
                <td>${contact.number}</td>
                <td>${contact.email}</td>
                <td><button type="button" class="btn btn-warning mx-1">✏ Update</button></td>
                <td><button type="button" class="btn btn-danger mx-1">🗑 Delete</button></td>
            `;
            //inject generated html to the table element
            tableBody.appendChild(row);
        });
    }
};

//handle errors, that needs to be tweaked I think maybe not not sure
const showErrorMessage = (message, elementId) => {
    const errorDiv = document.getElementById(elementId);
    errorDiv.textContent = message;
    errorDiv.classList.remove("d-none");
};

// Event Handlers
const loadContacts = async () => {
    const userId = 1; // Placeholder for the user ID
    const noContactsMessage = document.getElementById("no-contacts-message");

    try {
        const contacts = await fetchContacts(userId);
        renderContacts(contacts);
    } catch (error) {
        showErrorMessage("Failed to load contacts.", "no-contacts-message");
    }
};


const handleUpdate = async (event) => {
    event.preventDefault();
    //change these to values from your modal
    const loginEmail = document.getElementById("exampleInputEmail1").value;
    const loginPassword = document.getElementById("exampleInputPassword1").value;

    console.log("Login Attempt:", { email: loginEmail, password: loginPassword });

    try {
        const data = await loginUser(loginEmail, loginPassword);

        if (data.success) {
            redirectToContacts();
        } else {
            alert(data.message); // To be improved later
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("An error occurred. Please try again.");
    }
};

// Event Listeners
const initializeEventListeners = () => {
    document.addEventListener("DOMContentLoaded", loadContacts);
    document.querySelector("#addModal form").addEventListener("submit", handleUpdate);
    //TODO:  Add more listeners here, for delete/edit create buttons
};

// Initialize all event listeners
initializeEventListeners();
