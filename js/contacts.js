// API Calls Module
const fetchContacts = async () => {
    const session = retrieveSession();    
    if (!session || !session.userId) {
        window.location.href = "/";
        return;
    }

    try {                
        const response = await fetch(`/api/GetAllContacts.php?userId=${session.userId}`);

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
        noContactsMessage.hidden = false;
        return;
    } 
    tableLayout.classList.remove("d-none");
    noContactsMessage.hidden = true;

    //buttons
    const updateButton = '<button type="button" class="btn-update btn text-primary"><i class="fa fa-gear" aria-hidden="true"></i></button>';
    const deleteButton = '<button type="button" class="btn-delete btn text-danger"><i class="fa fa-trash" aria-hidden="true"></i></button>';

    //loop over contacts to create table rows
    contacts.forEach((contact, index) => {
        const row = document.createElement("tr");        

        //set data attribute for the contact id
        row.setAttribute("data-contact-id", contact.contactId);

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
            <td>${contact.email ? `<a href="mailto:${contact.email}">${contact.email}</a>` : ""}</td>
            <td>${contact.dateCreated ? formatTimestamp(contact.dateCreated) : ""}</td>
            <td><div class="d-flex">${updateButton}${deleteButton}</div></td>            
        `;
        //inject generated html to the table element
        tableBody.appendChild(row);
    });
};

// API Calls Module
const addContact = async (firstName, lastName, phoneNumber, email) => {
    const session = retrieveSession();    
    if (!session || !session.userId) {
        window.location.href = "/";
        return;
    }

    const response = await fetch("/api/CreateContact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            "userId": session.userId, 
            "firstName": firstName, 
            "lastName": lastName, 
            "phoneNumber": phoneNumber, 
            "email": email,
        }),
    });

    if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
    }

    return await response.json();
};

// Event Handlers
const loadContacts = async (isShowSpinner) => {    
    if (isShowSpinner) showSpinner("contactTableSpinner");

    try {              
        //await new Promise(resolve => setTimeout(resolve, 1000)); //for testing
        const contacts = await fetchContacts();
        renderContacts(contacts);
    } catch (error) {
        showErrorMessage("<b>Failed to load contacts</b><br>\n" + error, "ShowContactsError");        
    }

    hideSpinner("contactTableSpinner");
};


const handleAddContact = async (firstName, lastName, phoneNumber, email) => {
    try {
        //await new Promise(resolve => setTimeout(resolve, 1000)); //for testing
        const data = await addContact(firstName, lastName, phoneNumber, email);
        
        if (data.contactId && !data.error) {
            return data.contactId;
        } else if (data.error) {
            showErrorMessage(data.error, "AddModalError");        
        }
    } catch (error) {
        console.error("Update Contact Error:", error);
        showErrorMessage("An error occurred. Please try again.", "AddModalError");
    }
    return -1;
};

// Variable to store the contact id to delete
let contactIdToDelete = null;

// Event Listeners
const initializeEventListeners = () => {
    document.addEventListener("DOMContentLoaded", function() {        
        loadContacts(true);
    });     

    // Event delegation for delete buttons
    document.addEventListener("click", function(event) {
        const deleteButton = event.target.closest(".btn-delete");
        if (deleteButton) {
            // Get the corresponding table row
            const row = deleteButton.closest("tr");
            contactIdToDelete = row.getAttribute("data-contact-id");
            
            // Show the delete confirmation modal
            const deleteModal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
            deleteModal.show();
        }
    });

    document.getElementById("confirmDeleteButton").addEventListener("click", async function() {
        if (!contactIdToDelete) return;
        alert(contactIdToDelete);
    });
};



// Initialize all event listeners
initializeEventListeners();


document.getElementById("logout").addEventListener("click", function() {
    sessionLogout();
    window.location.href = "/";
});

function showSpinner(spinnerId) {  
    const spinner = document.getElementById(spinnerId);
    if (!spinner) return;    
    spinner.hidden = false;     
}

function hideSpinner(spinnerId) {
    const spinner = document.getElementById(spinnerId);
    if (!spinner) return;    
    spinner.hidden = true;     
}

function showErrorMessage(message, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = message;
    container.hidden = false;    
}

function hideErrorMessage(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    container.hidden = true;   
}

document.querySelector("#addModal form").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Select only inside #addModal to avoid conflicts
    let modal = document.querySelector("#addModal");    
    
    let firstName = modal.querySelector("#first-name").value.trim();
    let lastName = modal.querySelector("#last-name").value.trim();
    let phoneNumber = modal.querySelector("#phone-number").value.trim();
    let email = modal.querySelector("#email").value ?? null;
    if (!email || email.length == 0) email = null;

    const validationError = getAddContactValidationError(firstName, lastName, phoneNumber, email);
    if (validationError) {
        showErrorMessage(validationError, "AddModalError");
        return;   
    }

    //show loading
    showSpinner("addModalSpinner");
    const buttonTextElement = document.getElementById("addModalAddButtonText");
    const originalButtonText = buttonTextElement.innerHTML;
    buttonTextElement.innerHTML = "Adding...";
    modal.querySelectorAll("button").forEach(button => button.disabled = true);


    //execure query "add"
    const insertedContactId = await handleAddContact(firstName, lastName, phoneNumber, email);
    if (insertedContactId == -1) return;


    //execute query "load"
    await loadContacts(false);

    //hide loading
    hideSpinner("addModalSpinner");
    buttonTextElement.innerHTML = originalButtonText;
    modal.querySelectorAll("button").forEach(button => button.disabled = false);

    hideErrorMessage("AddModalError");
    this.reset();
    
    let dismissButton = modal.querySelector("[data-bs-dismiss='modal']");
    if (dismissButton) dismissButton.click();
});
