<?php

$host = "localhost";
$user = "root";
$pass = "1111";
$dbname = "tamaddun";

$conn = mysqli_connect(
    $host,
    $user,
    $pass,
    $dbname
);

if(!$conn){
    die("Database ulanishda xatolik");
}

?>