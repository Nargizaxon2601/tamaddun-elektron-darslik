```php
<?php

session_start();
include("config/db.php");

$message = "";

if(isset($_POST['login'])){

    $login = mysqli_real_escape_string(
        $conn,
        $_POST['login']
    );

    $password = $_POST['password'];

    $query = mysqli_query(
        $conn,
        "SELECT * FROM users
         WHERE email='$login'
         OR username='$login'"
    );

    if(mysqli_num_rows($query) > 0){

        $user = mysqli_fetch_assoc($query);

        if(password_verify(
            $password,
            $user['password']
        )){

            $_SESSION['user_id'] =
            $user['id'];

            $_SESSION['fullname'] =
            $user['fullname'];

            echo "LOGIN MUVAFFAQIYATLI";
            exit();

        }else{

            $message =
            "Parol noto'g'ri!";

        }

    }else{

        $message =
        "Foydalanuvchi topilmadi!";

    }

}

?>

<!DOCTYPE html>
<html lang="uz">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0">

<title>TAMADDUN | Kirish</title>

<link
href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800;900&display=swap"
rel="stylesheet">

<link
rel="stylesheet"
href="css/login.css">

</head>

<body>

<div class="overlay"></div>

<div class="login-card">

    <img
    src="images/login-logo.png"
    class="logo"
    alt="Logo">

    <h1>TAMADDUN</h1>

    <h3>Kirish</h3>

    <?php if(!empty($message)){ ?>

        <div class="error">

            <?php echo $message; ?>

        </div>

    <?php } ?>

    <form method="POST">

        <input
        type="text"
        name="login"
        placeholder="Familya"
        required>

        <input
        type="password"
        name="password"
        placeholder="Parol"
        required>

        <button
        type="submit"
        name="login">

            Kirish

        </button>

    </form>

    <p>

        Hisobingiz yo'qmi?

        <a href="register.php">

            Ro'yxatdan o'tish

        </a>

    </p>

</div>

<script src="js/login.js"></script>

</body>
</html>
```
