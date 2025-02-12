document.addEventListener("DOMContentLoaded", async () => {
    const userId = 1; // TO DO
    const tableBody = document.getElementById("contacts-table-body");
    const noContactsMessage = document.getElementById("no-contacts-message");

    try {
        const response = await fetch(`/api/getAllContacts.php?user_id=${userId}`);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Unknown error");
        }

        const contacts = data.contacts;

        if (contacts.length === 0) {
            noContactsMessage.classList.remove("d-none");
        } else {
            noContactsMessage.classList.add("d-none");
            contacts.forEach((contact, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <th scope="row">${index + 1}</th>
                    <td>${contact.name}</td>
                    <td>${contact.number}</td>
                    <td>${contact.email}</td>
                    <td><button type="button" class="btn btn-warning mx-1">✏ Update</button></td>
                    <td><button type="button" class="btn btn-danger mx-1">🗑 Delete</button></td>
                `;
                tableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error("Error fetching contacts:", error);
        noContactsMessage.textContent = "Failed to load contacts.";
        noContactsMessage.classList.remove("d-none");
    }
});
