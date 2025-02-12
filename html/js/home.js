// API Calls Module
const loginUser = async (email, password) => {
    const response = await fetch("/api/Login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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

const signupUser = async (email, password) => {
    const response = await fetch("/api/Register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email,
            password,
            //TO DO: ?
            FirstName: 'Test',
            LastName: 'Test'
        }),
    });

    const text = await response.text();
    let data;

    try {
        data = JSON.parse(text);
    } catch {
        data = { message: text };
    }

    if (!response.ok) {
        throw new Error(data.message || `Server responded with status ${response.status}`);
    }

    return data;
};

// UI Update Module
const showErrorMessage = (message, elementId) => {
    const errorDiv = document.getElementById(elementId);
    errorDiv.textContent = message;
    errorDiv.hidden = false;
};

const redirectToContacts = () => {
    window.location.href = '/contacts.html';
};

// Event Handlers
const handleLogin = async (event) => {
    event.preventDefault();
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

const handleSignup = async (event) => {
    event.preventDefault();
    const signupEmail = document.getElementById("SignupModalEmail").value;
    const signupPassword = document.getElementById("SignupModalPassword").value;

    console.log("Signup Attempt:", { email: signupEmail, password: signupPassword });

    try {
        const data = await signupUser(signupEmail, signupPassword);

        if (data.success) {
            redirectToContacts();
        } else {
            showErrorMessage(data.message, "servererror");
        }
    } catch (error) {
        console.error("Signup Error:", error);
        showErrorMessage(error.message, "servererror");
    }
};

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#exampleModal form").addEventListener("submit", handleLogin);
    document.querySelector("#SignupModal form").addEventListener("submit", handleSignup);
});
