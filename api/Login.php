<?php

// Edwin Villanueva - API1

// enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

// get JSON input
function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

// send JSON response
function sendResultInfoAsJson($obj) {
    header('Content-Type: application/json');
    echo json_encode($obj);
    exit();
}

// return error response
function returnWithError($err) {
    sendResultInfoAsJson(["success" => false, "message" => $err]);
}

// return info as json
function returnWithInfo($id, $login) {
    sendResultInfoAsJson(["success" => true, "id" => $id, "email" => $login]);
}

// store user input data
$inData = getRequestInfo();

// define values from user input
$email = $inData["email"] ?? null;
$password = $inData["password"] ?? null;

// if either fields are missing, return error
if (!$email || !$password) {
    returnWithError("Missing required fields: email and password");
}

// establish a connection with the database
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "smallProjectTest");

// check if connection is successful or not
if ($conn->connect_error) {
    returnWithError("Database connection failed: " . $conn->connect_error);
}

// if connection is successful, find user in the database
$stmt = $conn->prepare("SELECT ID, Password FROM Users WHERE Login=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// check if the returned password matches the one the user sent in
if ($row = $result->fetch_assoc()) {
        if ($password === $row["Password"]) {
                returnWithInfo($row["ID"], $email);
        }
        // otherwise, tell the user they used the incorrect password
        else {
                returnWithError("Incorrect password");
        }
}
// otherwise, tell the user their email is not associated with an account
else {
        returnWithError("No records found for this email");
}

// close connections
$stmt->close();
$conn->close();

?>
