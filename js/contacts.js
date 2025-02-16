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

// API Calls Module
const addContact = async (fname, lname, phone, email) => {
    const response = await fetch("/api/someEndpoint.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fname, lname, phone, email }),
    });

    if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
    }

    const text = await response.text();
    let data;

    try {
        data = JSON.parse(text);
    } catch {
        throw new Error("Failed to parse JSON");
    }

    return data;
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


const handleAddContact = async (event) => {
    event.preventDefault();

    const fname = document.getElementById("first-name").value;
    const lname = document.getElementById("last-name").value;
    const phone = document.getElementById("phone-number").value;
    const email = document.getElementById("email").value;

    console.log("Update Attempt:", { fname: fname, lname: lname, phone: phone, email: email });

    try {
        const data = await addContact(loginEmail, loginPassword);

        if (data.success) {
            redirectToContacts();
        } else {
            alert(data.message); // To be improved later
        }
    } catch (error) {
        console.error("Update Contact Error:", error);
        alert("An error occurred. Please try again.");
    }
};

// Event Listeners
const initializeEventListeners = () => {
    document.addEventListener("DOMContentLoaded", loadContacts);
    document.querySelector("#addModal form").addEventListener("submit", handleAddContact);
    //TODO:  Add more listeners here, for delete/edit create buttons
};

// Initialize all event listeners
initializeEventListeners();
