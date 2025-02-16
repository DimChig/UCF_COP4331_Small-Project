<?php
//Daniel Armas API 2

// header and error return
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

try
{

    //get json data
    //UPDATE DURING IMPLEMENTATION
    $data = json_decode(file_get_contents("php://input"), true);
    
    //check if data is valid
    if(!$data)
    {
        error_log("Error: invalid data");
    }


    //making variables
    $newFirstName = trim($data["newFirstName"] ?? "");
    $newLastName = trim($data["newLastName"] ?? "");
    $newPhoneNumber = trim($data["newPhoneNumber"] ?? "");
    $newEmail = trim($data["newEmail"] ?? "");

    // retrieving userId from cookies
    if(!isset($_COOKIE["userID"]) || !is_numeric($_COOKIE["userID"]))
    {
        throw new Exception("User not authenticated");
    }
    $userID = (int) $_COOKIE["userID"];

    // extract contactId from request
    if (!isset($data["contactId"]) || !is_numeric($data["contactId"]))
    {
        throw new Exception("Invalid or missing contactId");
    }

    // checking if all fields are null
    if ($newFirstName === null && 
    $newLastName === null && 
    $newPhoneNumber === null && 
    $newEmail === null) {
        throw new Exception("No new data provided for update");
    }

    // build the dynamic SQL query
    $updateFields = [];
    $params = [];
    $types = "";

    if ($newFirstName !== null)
    {
        $updateFields[] = "FirstName = ?";
        $params[] = $newFirstName;
        $types .= "s";
    }
    if ($newLastName !== null)
    {
        $updateFields[] = "LastName = ?";
        $params[] = $newLastName;
        $types .= "s";
    }
    if ($newPhoneNumber !== null)
    {
        $updateFields[] = "Phone = ?";
        $params[] = $newPhoneNumber;
        $types .= "s";
    }
    if ($newEmail !== null)
    {
        $updateFields[] = "Email = ?";
        $params[] = $newEmail;
        $types .= "s";
    }

    // ensure there are fields to update
    if (empty($updateFields))
    {
        throw new Exception("No fields to update");
    }

    // append UserID and ContactID for WHERE condition
    $params[] = $userID;
    $params[] = $contactId;
    $types .= "ii";

    // construct SQL query dynamically
    $sql = "UPDATE Contacts SET " . implode(", ", $updateFields) . " WHERE UserID = ? AND ID = ?";

    // prepare and execute statement
    $stmt = $conn->prepare($sql);
    if (!$stmt)
    {
        throw new Exception("Database error: " . $conn->error);
    }

    // bind parameters dynamically
    $stmt->bind_param($types, ...$params);

    if (!$stmt->execute())
    {
        throw new Exception("Database error: " . $stmt->error);
    }

    // if successful, no error
    $response["error"] = null;
}
catch(Exception $e)
{
    $response["error"] = $e->getMessage();
}


echo(json_encode($response));

?>
