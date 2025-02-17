<?php
//Daniel Armas API 2

//Connect to database
require_once("db_connector.php");

//read json data
$data = json_decode(file_get_contents("php://input"), true);


//sanitize input data
$userId = isset($data["ID"]) ? (int) $data["ID"] : 0;
$firstName = trim($data["FirstName"]);
$lastName = trim($data["LastName"]);
$phoneNumber = trim($data["Phone"]);
$email = trim($data["Email"]);


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
