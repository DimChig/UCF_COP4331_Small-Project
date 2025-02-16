<?php
// Edwin Villanueva - API1

// enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

// send json response
function sendResultInfoAsJson($obj) {
    header('Content-Type: application/json');
    echo json_encode($obj);
    exit();
}

// returns with error if necessary
function returnWithError($err) {
    sendResultInfoAsJson(["success" => false, "message" => $err]);
}

// return success response (but false so that the user can log in with their new info)
function returnWithInfo($message) {
    sendResultInfoAsJson(["success" => false, "message" => $message]);
}

// get data from js request
function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

// assign data passed in to a variable for this script to use
$inData = getRequestInfo();

// check if data was received
if (!$inData) {
    returnWithError("No data received");
}

// define the values we sent in
$newLogin = isset($inData["login"]) ? $inData["login"] : null;
$newPassword = isset($inData["password"]) ? $inData["password"] : null;

// check if required fields are missing
if (!$newLogin || !$newPassword) {
    returnWithError("Missing required fields: login and password");
}

// create a connection with the database (FIX LATER, for now, its my personal db)
require_once __DIR__ . "/db_connector.php";

// Check connection
if ($conn->connect_error) {
    returnWithError("Database connection failed: " . $conn->connect_error);
}

// check whether or not the connection to the database was successful
// if not, return an error
if ($conn->connect_error) {
    returnWithError("Database connection failed: " . $conn->connect_error);
}

// if the connection was successful, use the information sent in to create a new user and close the connection.
else {
    // set up the line to send
    $statement = $conn->prepare("INSERT INTO Users (Login, Password) VALUES(?, ?)");
    // fill in the line with our user's info
    $statement->bind_param("ss", $newLogin, $newPassword);

    // execute the line and check if insertion was successful
    if ($statement->execute()) {
        returnWithInfo("User registered successfully!");
    } else {
        returnWithError("Error registering user: " . $conn->error);
    }

    // close the statement when finished
    $statement->close();
    
    // close the connection to the database
    $conn->close();
}

?>