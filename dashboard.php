
session_start();

/*
if(!isset($_SESSION['user_id'])){

    header("Location: login.php");
    exit();

}
*/

$fullname =O'quvchi


?>

<!DOCTYPE html>
<html lang="uz">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0">

<title>TAMADDUN Dashboard</title>

<link
href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800;900&display=swap"
rel="stylesheet">

<link
rel="stylesheet"
href="css/dashboard.css">

</head>

<body>

<div class="sidebar">

    <div class="logo">

        <img
        src="images/logo.png"
        alt="">

        <h2>TAMADDUN</h2>

    </div>

    <ul>

        <li class="active">
            🏠 Bosh sahifa
        </li>

        <li>
            📚 Darslarim
        </li>

        <li>
            🏅 Nishonlar
        </li>

        <li>
            🎁 Mukofotlar
        </li>

        <li>
            🌱 Qadriyatlar
        </li>

        <li>
            📊 Statistika
        </li>

    </ul>

    <a
    href="logout.php"
    class="logout">

    🚪 Chiqish

    </a>

</div>

<div class="main">

    <div class="top-header">

        <h1>

        Assalomu alaykum,
        <?php echo $fullname; ?> 👋

        </h1>

        <p>
        Bugun yangi bilim olish uchun ajoyib kun!
        </p>

    </div>

    <div class="stats">

        <div class="stat-card">

            <h3>⭐ Ballar</h3>

            <h2>0</h2>

        </div>

        <div class="stat-card">

            <h3>🏅 Nishonlar</h3>

            <h2>0</h2>

        </div>

        <div class="stat-card">

            <h3>🎁 Mukofotlar</h3>

            <h2>0</h2>

        </div>

    </div>

    <div class="section-title">

        <h2>📚 Darslar</h2>

    </div>

    <div class="lesson-grid">

        <div class="lesson-card">

            <span>
                1-dars
            </span>

            <h3>
                Vatanim – faxrim
            </h3>

            <p>

                Vatan haqida tushuncha,
                mehr, hurmat va
                vatanparvarlik
                qadriyatlari.

            </p>

            <div class="progress">

                <div
                class="progress-bar">

                </div>

            </div>

            <div class="percent">

                0%

            </div>

            <a
            href="lesson1.php"
            class="start-btn">

            Boshlash

            </a>

        </div>

    </div>

</div>

<script src="js/dashboard.js"></script>

</body>
</html>
```
