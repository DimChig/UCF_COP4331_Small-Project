<?php
//Connect to database
require_once("db_connector.php");
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

// requesting data
function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

//read json data
$data = getRequestInfo();


//sanitize input data
$userId = $data["ID"] ?? null;
$firstName = $data["FirstName"] ?? null;
$lastName = $data["LastName"] ?? null;
$phoneNumber = $data["PhoneNumber"] ?? null;
$email = $data["Email"] ?? null;


//prepare SQL query
$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, PhoneNumber=?, Email=? WHERE ID=?");
$stmt->bind_param("ssssi",$userId, $firstName, $lastName, $phoneNumber, $email);

// bind parameters dynamically

if (!$stmt->execute())
{
    echo json_encode(["error" => "Failed to update contact: " . $stmt->error]);
}
else 
{
    // Check if any row was updated
    if ($stmt->affected_rows > 0)
    {
        echo json_encode(["success" => true, "message" => "Contact updated successfully"]);
    }
    else
    {
        echo json_encode(["error" => "No contact found with the provided ID or no changes made"]);
    }
}

// Close the statement and connection
$stmt->close();
$conn->close();

?>
