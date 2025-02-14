<?php

// Database connection settings
$db_server = "con-mng.cmtzc.xyz";
$db_user = "root";
$db_pass = "";
$db_name = "con-mng";
$db_port = 3306;

// Create connection using MySQLi with error handling
$conn = new mysqli($db_server, $db_user, $db_pass, $db_name, $db_port);

// Check connection
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
} else {
    echo "You are connected to the database!";
}
?>
