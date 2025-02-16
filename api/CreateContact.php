<?php
//Daniel Armas API 2


//header and error return
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

try
{ 
    // reading json data
    $data = json_decode(file_get_contents("php://input"), true);

    // return error if invalid data
    if (!is_array($data))
    {
        throw new Exception("Invalid JSON input");
    }
    

    // extracting variables
    $firstName = trim($data["firstName"] ?? "");
    $lastName = trim($data["lastName"] ?? "");
    $phoneNumber = trim($data["phoneNumber"] ?? "");
    $email = isset($data["email"]) ? trim($data["email"]) : null;

    if(empty($firstName) || empty($lastName) || empty($phoneNumber))
    {
        throw new Exception("Missing required fields");
    }


    // retrieve userID from cookies
    if(!isset($_COOKIE["userID"]) || !is_numeric($_COOKIE["userID"]))
    {
        throw new Exception("User not authenticated");
    }
    $userID = (int) $_COOKIE["userID"];

    $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
    $stmt->blnd_param("ssssi", $firstName, $lastName, $phoneNumber, $email, $userID);

    if(!$stmt->execute())
    {
        throw new Exception("Database error: " . $stmt->error);
    }
    }
catch(Exception $e)
{
    $response["error"] = $e->getMessage();
}

// return JSON response
echo json_encode($response);

?>
