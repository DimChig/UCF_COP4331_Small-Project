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
    sendResultInfoAsJson(["success" => true, "id" => $id, "login" => $login]);
}

// store user input data
$inData = getRequestInfo();

// define values from user input
$login = $inData["login"] ?? null;
$password = $inData["password"] ?? null;

// if either fields are missing, return error
if (!$login || !$password) {
    returnWithError("Missing required fields: login and password");
}

// load db connection
require_once __DIR__ . "/db_connector.php";

// Check connection
if ($conn->connect_error) {
    returnWithError("Database connection failed: " . $conn->connect_error);
}

// check if connection is successful or not
if ($conn->connect_error) {
    returnWithError("Database connection failed: " . $conn->connect_error);
}

// if connection is successful, find user in the database
$stmt = $conn->prepare("SELECT ID, Password FROM Users WHERE Login=?");
$stmt->bind_param("s", $login);
$stmt->execute();
$result = $stmt->get_result();

// check if the returned password matches the one the user sent in
if ($row = $result->fetch_assoc()) {
        if ($password === $row["Password"]) {
                returnWithInfo($row["ID"], $login);
        }
        // otherwise, tell the user they used the incorrect password
        else {
                returnWithError("Incorrect password");
        }
}
// otherwise, tell the user their login is not associated with an account
else {
        returnWithError("No records found for this login");
}

// close connections
$stmt->close();
$conn->close();

?>
