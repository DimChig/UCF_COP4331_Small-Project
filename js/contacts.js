// API Calls Module
const fetchContacts = async (userId) => {
    try {
        const response = await fetch(`/api/getAllContacts.php?userId=${userId}`);

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();        

        if (data.error) {
            throw new Error(data.error || "Unknown error");
        }

        return data.results;
    } catch (error) {
        console.error("Error fetching contacts:", error);
        throw error;
    }
};

function getAvatarColor(contactName) {        
    const colors = [
        "#ee675c", //red,
        "#fa903e", //orange,
        "#fcc934", //yellow,
        "#5bb974", //green
        "#4ecde6", //blue
        "#af5cf7", //purple
        "#ff63b8", //pink
    ]

    // Fowler–Noll–Vo (FNV-1a) hashing with better distribution
    let hash = 997525853; // Large prime
    for (let i = 0; i < contactName.length; i++) {
        hash ^= contactName.charCodeAt(i);
        hash *= 16777619;
    }

    // Ensure hash is always positive and evenly distributed
    hash = (hash >>> 0) % colors.length;

    return colors[hash];
}


function formatPhoneNumber(phoneNumber) {
    // Remove the country code (+1) if present
    let cleaned = phoneNumber.replace(/^(\+1)/, "");

    // Ensure it only contains digits
    cleaned = cleaned.replace(/\D/g, "");

    // Format as XXX-XXX-XXXX
    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else {
        return phoneNumber; // Return original if format doesn't match
    }
}

function formatTimestamp(timestamp) {
    // Convert the input string into a Date object
    const date = new Date(timestamp);

    // Extract month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    // Format as MM/dd/yyyy
    return `${month}/${day}/${year}`;
}

// UI Update Module
const renderContacts = (contacts) => {
    const tableLayout = document.getElementById("contacts-table-layout");
    const tableBody = document.getElementById("contacts-table-body");
    const noContactsMessage = document.getElementById("no-contacts-message");

    // Clear the table before rendering new contacts
    tableBody.innerHTML = '';

    //hide/add container with " No Contacts Message"
    if (contacts.length === 0) {        
        noContactsMessage.classList.remove("d-none");
        return;
    } 
    tableLayout.classList.remove("d-none");
    noContactsMessage.classList.add("d-none");

    //buttons
    const updateButton = '<button type="button" class="btn text-primary"><i class="fa fa-gear" aria-hidden="true"></i></button>';
    const deleteButton = '<button type="button" class="btn text-danger"><i class="fa fa-trash" aria-hidden="true"></i></button>';

    //loop over contacts to create table rows
    contacts.forEach((contact, index) => {
        const row = document.createElement("tr");

        console.log(contact);

        const name = contact.firstName + " " + contact.lastName;
        const initials = (contact.firstName[0] + contact.lastName[0]).toUpperCase();

        const avatarAndName = 
        `<div class="d-flex align-items-center">
            <div class="avatar me-2" style="background-color: ${getAvatarColor(name)}!important">
                ${initials}
            </div>
            ${name}
        </div>`;

        //that speak for itself
        row.innerHTML = `
            <td scope="row">${index + 1}</td>
            <td>${avatarAndName}</td>
            <td>${formatPhoneNumber(contact.phoneNumber)}</td>
            <td>${contact.email ?? ""}</td>
            <td>${contact.dateCreated ? formatTimestamp(contact.dateCreated) : ""}</td>
            <td><div class="d-flex">${updateButton}${deleteButton}</div></td>            
        `;
        //inject generated html to the table element
        tableBody.appendChild(row);
    });
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
    const session = retrieveSession();    
    if (!session || !session.userId) {
        window.location.href = "/";
        return;
    }

    const userId = session.userId;    

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


document.getElementById("logout").addEventListener("click", function() {
    sessionLogout();
    window.location.href = "/";
});
