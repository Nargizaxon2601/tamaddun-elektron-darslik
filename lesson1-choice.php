<?php
session_start();


?>

<!DOCTYPE html>
<html lang="uz">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>1-Dars | Vaziyat</title>

<link rel="stylesheet" href="css/lesson1.css">

<style>

.choice-page{
    padding:40px;
    text-align:center;
}

.choice-title{
    font-size:55px;
    color:#0d47c7;
    font-weight:900;
    margin-bottom:15px;
}

.choice-question{
    font-size:32px;
    color:#333;
    margin-bottom:30px;
}

.choice-image{
    width:100%;
    max-width:800px;
    border-radius:25px;
    margin-bottom:35px;
}

.choice-list{
    display:flex;
    flex-direction:column;
    gap:20px;
    max-width:900px;
    margin:auto;
}

.choice-btn{

    width:100%;
    border:none;

    padding:25px;

    border-radius:20px;

    font-size:24px;
    font-weight:800;

    cursor:pointer;
    transition:.3s;
}

.choice-btn:hover{
    transform:translateY(-5px);
}

.green{
    background:#dff8df;
}

.yellow{
    background:#fff3c9;
}

.red{
    background:#ffdede;
}

.progress{
    display:flex;
    justify-content:center;
    gap:15px;
    margin-top:40px;
}

.step{
    width:55px;
    height:55px;
    border-radius:50%;

    background:#e8edf3;

    display:flex;
    justify-content:center;
    align-items:center;

    font-weight:800;
}

.active{
    background:#1d74ff;
    color:white;
}

</style>

</head>
<body>

<div class="lesson-container">

    <div class="lesson-header">

        <div class="lesson-badge">
            📖 1-DARS
        </div>

        <div class="lesson-score">
            ⭐ +10 Ball
        </div>

    </div>

    <div class="choice-page">

        <h1 class="choice-title">
            VAZIYAT
        </h1>

        <p class="choice-question">

            Siz Ali va Dilshod o‘rnida
            bo‘lsangiz nima qilgan
            bo‘lardingiz?

        </p>

        <img
        src="images/lesson1-choice.png"
        class="choice-image"
        alt="Vaziyat">

        <div class="choice-list">

            <form method="POST">

                <button
                class="choice-btn green"
                name="choice"
                value="A">

                    🟢 A) Yordam beraman,
                    tanishtiraman

                </button>

            </form>

            <form method="POST">

                <button
                class="choice-btn yellow"
                name="choice"
                value="B">

                    🟡 B) Uyalib,
                    uzoqroq ketaman

                </button>

            </form>

            <form method="POST">

                <button
                class="choice-btn red"
                name="choice"
                value="C">

                    🔴 C) Faqat kuzataman,
                    aralashmayman

                </button>

            </form>

        </div>

      <div class="bottom-nav">

    <a href="lesson1.php" class="back-btn">
        ← OLDINGI
    </a>

    <div class="progress">

        <div class="step done">✓</div>

        <div class="step active">2</div>

        <div class="step">3</div>
        <div class="step">4</div>
        <div class="step">5</div>
        <div class="step">6</div>

    </div>

    <a href="lesson1-result.php?choice=A" class="next-btn">
    DAVOM ETISH →
</a>

</div>

    </div>

</div>

</body>
</html>