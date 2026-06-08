```php
<?php

session_start();
include("config/db.php");

$message = "";

if(isset($_POST['register'])){

    $fullname = mysqli_real_escape_string(
        $conn,
        trim($_POST['fullname'])
    );

    $username = mysqli_real_escape_string(
        $conn,
        trim($_POST['username'])
    );

    $email = mysqli_real_escape_string(
        $conn,
        trim($_POST['email'])
    );

    $password = $_POST['password'];
    $confirmPassword = $_POST['confirm_password'];

    if(empty($fullname) ||
       empty($username) ||
       empty($email) ||
       empty($password) ||
       empty($confirmPassword))
    {

        $message = "Barcha maydonlarni to'ldiring!";

    }
    elseif(!filter_var($email, FILTER_VALIDATE_EMAIL))
    {

        $message = "Email noto'g'ri kiritilgan!";

    }
    elseif($password != $confirmPassword)
    {

        $message = "Parollar mos emas!";

    }
    else{

        $checkUser = mysqli_query(
            $conn,
            "SELECT * FROM users
             WHERE email='$email'
             OR username='$username'"
        );

        if(mysqli_num_rows($checkUser) > 0){

            $message =
            "Email yoki username allaqachon mavjud!";

        }
        else{

            $hashPassword =
            password_hash(
                $password,
                PASSWORD_DEFAULT
            );

            $insert =
            mysqli_query(
                $conn,
                "INSERT INTO users(
                    fullname,
                    username,
                    email,
                    password
                )
                VALUES(
                    '$fullname',
                    '$username',
                    '$email',
                    '$hashPassword'
                )"
            );

            if($insert){

                $_SESSION['success'] =
                "Ro'yxatdan muvaffaqiyatli o'tdingiz!";

                header("Location: login.php");
                exit();

            }
            else{

                $message =
                "Ma'lumotlarni saqlashda xatolik!";

            }

        }

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

    <title>TAMADDUN | Ro'yxatdan o'tish</title>

    <link
    href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800;900&display=swap"
    rel="stylesheet">

    <link
    rel="stylesheet"
    href="css/register.css">

</head>

<body>

    <div class="bg-overlay"></div>

    <img
    src="images/left-kids.png"
    class="left-kids"
    alt="">

    <img
    src="images/right-kids.png"
    class="right-kids"
    alt="">

    <div class="register-container">

        <div class="logo-box">

            <img
            src="images/logo.png"
            alt="TAMADDUN">

            <h1>TAMADDUN</h1>

            <p>
                Ro'yxatdan o'tish
            </p>

        </div>

        <?php if(!empty($message)){ ?>

        <div class="error-message">

            <?php echo $message; ?>

        </div>

        <?php } ?>

        <form method="POST">

            <div class="input-group">

                <label>
                    Ism va familiya
                </label>

                <input
                type="text"
                name="fullname"
                placeholder="Ism "
                required>

            </div>

            <div class="input-group">

                <label>
                    Familya
                </label>

                <input
                type="text"
                name="username"
                placeholder="Username kiriting"
                required>

            </div>

            <div class="input-group">

                <label>
                    Email
                </label>

                <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                required>

            </div>

            <div class="input-group">

                <label>
                    Parol
                </label>

                <input
                id="password"
                type="password"
                name="password"
                placeholder="Parol kiriting"
                required>

            </div>

            <div class="input-group">

                <label>
                    Parolni tasdiqlang
                </label>

                <input
                id="confirm"
                type="password"
                name="confirm_password"
                placeholder="Parolni qayta kiriting"
                required>

            </div>

            <button
            type="submit"
            name="register"
            class="register-btn">

                Ro'yxatdan o'tish

            </button>

        </form>

        <div class="login-link">

            Hisobingiz bormi?

            <a href="login.php">

                Kirish

            </a>

        </div>

    </div>

    <script src="js/register.js"></script>

</body>

</html>
```
