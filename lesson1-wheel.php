
<!DOCTYPE html>
<html lang="uz">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Bilimlar barabani</title>

<link rel="stylesheet" href="css/lesson1.css">
<link rel="stylesheet" href="css/lesson1-wheel.css">

</head>
<body>

<div class="wheel-container">

    <div class="wheel-header">

        <a href="lesson1-activity.php" class="back-btn">
            ← Orqaga
        </a>

        <h1>
            ⭐ Bilimlar barabani ⭐
        </h1>

        <div class="star-box">
            ⭐ Yulduzlar:
            <span id="starCount">0</span>
        </div>

    </div>

    <p class="wheel-subtitle">
        Barabanni aylantiring va savolga javob bering!
    </p>

    <div class="wheel-content">

        <!-- CHAP TOMON -->

        <div class="wheel-left">

            <div class="pointer"></div>

            <div class="wheel" id="wheel">

                <div class="sector sector1">🇺🇿 Vatan</div>
                <div class="sector sector2">👑 Bobur</div>
                <div class="sector sector3">🍈 Qovun</div>
                <div class="sector sector4">🏙 Poytaxt</div>
                <div class="sector sector5">🚩 Bayroq</div>
                <div class="sector sector6">🗺 Xarita</div>

            </div>

            <button
            id="spinBtn"
            class="spin-btn">

                🔄 BARABANNI AYLANTIR!

            </button>

        </div>

        <!-- O‘NG TOMON -->

        <div class="question-card">

            <div id="questionArea">

                <h2>
                    Savolni olish uchun
                    barabanni aylantiring
                </h2>

            </div>

        </div>

    </div>

    <!-- PROGRESS -->

    <div class="progress-section">

        <div class="progress-box">

            🎯
            <span id="progressText">
                0 / 3 savol
            </span>

        </div>

        <div class="progress-line">

            <div class="progress-step active">
                1
            </div>

            <div class="progress-step">
                2
            </div>

            <div class="progress-step">
                3
            </div>

        </div>

        <a
        href="index.php"
        id="finishBtn"
        class="finish-btn">

            🏆 DARSNI YAKUNLASH

        </a>

    </div>

</div>

<script src="js/lesson1-wheel.js"></script>

</body>
</html>
