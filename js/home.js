// API Calls Module
const loginUser = async (login, password) => {
    const response = await fetch("/api/Login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            "login": login, 
            "password": password 
        }),
    });

    if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
    }

    return await response.json();
};

const signupUser = async (login, password) => {

    let firstName = 'Test1';
    let lastName = 'Test2';

    const response = await fetch("/api/Register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "login": login,
            "password": password,
        }),
    });

    if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
    }

    return await response.json(); 
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
    let login = document.getElementById("SigninModalLogin").value;
    let password = document.getElementById("SigninModalPassword").value;

    const validationError = getLoginValidationError(login, password);
    if (validationError) {
        showErrorMessage(validationError, "SigninModalError");
        return;   
    }

    login = login.trim(); //trim login

    console.log("Login Attempt:", { login: login, password: password });

    try {
        const data = await loginUser(login, password);

        if (data.userId && data.error == null) {            
            sessionLogin(data.userId);
            redirectToContacts();
        } else if (data.error) {
            showErrorMessage(data.error, "SigninModalError");
        } 
    } catch (error) {
        console.error("Login Error:", error);
        showErrorMessage(error, "SigninModalError");
    }
};

const handleSignup = async (event) => {
    event.preventDefault();

    let login = document.getElementById("SignupModalLogin").value;
    let password = document.getElementById("SignupModalPassword").value;
    let passwordConfirm = document.getElementById("SignupModalPasswordConfirm").value;

    const validationError = getSignupValidationError(login, password, passwordConfirm);
    if (validationError) {
        showErrorMessage(validationError, "SignupModalError");
        return;   
    }
    
    login = login.trim(); //trim login

    console.log("Signup Attempt:", { login: login, password: password });

    try {
        const data = await signupUser(login, password);

        if (data.userId && data.error == null) {
            sessionLogin(data.userId);
            redirectToContacts();
        } else if (data.error) {
            showErrorMessage(data.error, "SignupModalError");
        }
    } catch (error) {
        console.error("Signup Error:", error);
        showErrorMessage(error.message, "SignupModalError");
    }
};

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#exampleModal form").addEventListener("submit", handleLogin);
    document.querySelector("#SignupModal form").addEventListener("submit", handleSignup);
});
