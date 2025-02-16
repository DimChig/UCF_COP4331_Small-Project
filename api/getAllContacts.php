<?php

// Edwin Villanueva API1

// enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

// send JSON response
function sendResultInfoAsJson($obj) {
    echo json_encode($obj);
    exit();
}

// return error response
function returnWithError($err) {
    sendResultInfoAsJson(["success" => false, "message" => $err]);
    exit();
}


// get userId from either GET request or cookies

$userID = isset($_GET["user_id"]) ? intval($_GET["user_id"]) : null;

// alternative: Get userId from cookies if missing

if (!$userID && isset($_COOKIE["userId"])) {
    $userID = intval($_COOKIE["userId"]);
}

// validate that userId exists

if (!$userID) {
    returnWithError("User ID is required");
}

// connect to the database
require_once __DIR__ . "/db_connector.php";

// Check connection
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

// if connection failed, return error
if ($conn->connect_error) {
    returnWithError("Database connection failed: " . $conn->connect_error);
}
//otherwise, perform logic
else {
    // prepare SQL statement
    $stmt = $conn->prepare("SELECT ID,CONCAT(FirstName, ' ',LastName) AS Name, Phone, Email FROM Contacts WHERE UserID = ?");
    $stmt->bind_param("i", $userID);
    $stmt->execute();
    $result = $stmt->get_result();

    // fetch all contacts
    $contacts = [];
    while ($row = $result->fetch_assoc()) {
        $contacts[] = [
            "id" => $row["ID"],
            "name" => $row["Name"],
            "number" => $row["Phone"],
            "email" => $row["Email"]
        ];
    }

    // return contacts or an empty array
    sendResultInfoAsJson(["success" => true, "contacts" => $contacts]);
}
// close connection
$stmt->close();
$conn->close();

?>