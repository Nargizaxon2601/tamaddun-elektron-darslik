
<!DOCTYPE html>
<html lang="uz">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>1-Dars | Harakat qilamiz</title>

<link rel="stylesheet" href="css/lesson1.css">
<link rel="stylesheet" href="css/lesson1-activity.css">

</head>
<body>

<div class="activity-container">

    <div class="activity-header">

        <div class="activity-badge">
            💪 Harakat qilamiz!
        </div>

        <h1>
            Harakat qilamiz!
        </h1>

        <p>
            Endi biroz dam olamiz va mashq qilamiz!
            Men bilan birga takrorla 👇
        </p>

    </div>

    <div class="activity-grid">

        <!-- 1 -->
        <div class="activity-card green">

            <div class="activity-number">
                1
            </div>

            <h3>
                Qo‘llarni yuqoriga ko‘taring!
            </h3>

            <img
            src="images/exercise-1.png"
            alt="Mashq 1">

            <button
            class="done-btn"
            onclick="finishTask(this)">
                Bajarish
            </button>

        </div>

        <!-- 2 -->
        <div class="activity-card orange">

            <div class="activity-number">
                2
            </div>

            <h3>
                O‘ngga va chapga egiling!
            </h3>

            <img
            src="images/exercise-2.png"
            alt="Mashq 2">

            <button
            class="done-btn"
            onclick="finishTask(this)">
                Bajarish
            </button>

        </div>

        <!-- 3 -->
        <div class="activity-card blue">

            <div class="activity-number">
                3
            </div>

            <h3>
                Joyingizda 5 marta sakrang!
            </h3>

            <img
            src="images/exercise-3.png"
            alt="Mashq 3">

            <button
            class="done-btn"
            onclick="finishTask(this)">
                Bajarish
            </button>

        </div>

        <!-- 4 -->
        <div class="activity-card pink">

            <div class="activity-number">
                4
            </div>

            <h3>
                Katta tabassum qiling!
            </h3>

            <img
            src="images/exercise-4.png"
            alt="Mashq 4">

            <button
            class="done-btn"
            onclick="finishTask(this)">
                Bajarish
            </button>

        </div>

        <!-- 5 -->
        <div class="activity-card purple">

            <div class="activity-number">
                5
            </div>

            <h3>
                “Men Vatanimni sevaman!”
                deb ayting!
            </h3>

            <img
            src="images/exercise-5.png"
            alt="Mashq 5">

            <button
            class="done-btn"
            onclick="finishTask(this)">
                Bajarish
            </button>

        </div>

    </div>

    <!-- TABRIK -->

    <div class="success-box">

        <div class="success-icon">
            ⭐
        </div>

        <div>

            <h2>
                Zo‘r ishladingiz!
            </h2>

            <p>

                Siz juda ajoyibsiz!

                Vatanimiz —
                O‘zbekiston bilan faxrlanamiz!

            </p>

        </div>

    </div>

    <!-- NAV -->

    <div class="bottom-nav">

        <a
        href="lesson1-video.php"
        class="back-btn">

            📖 DARSNI O‘QISH

        </a>

        <div class="progress">

            <div class="step done">✓</div>
            <div class="step done">✓</div>
            <div class="step done">✓</div>
            <div class="step done">✓</div>
            <div class="step done">✓</div>
            <div class="step done">✓</div>

            <div class="step active">
                💪
            </div>

        </div>

        <a
href="lesson1-wheel.php"
class="next-btn"
id="wheelBtn">

    🎡 BILIMLAR BARABANI →

</a>

    </div>

</div>

<script>

let completedCount = 0;

function finishTask(btn){

    if(btn.classList.contains("completed")){
        return;
    }

    btn.classList.add("completed");

    btn.innerHTML = "✓ Bajarildi";

    completedCount++;

    if(completedCount >= 5){

        const finishBtn =
        document.getElementById("finishLesson");

        finishBtn.style.opacity = "1";

        finishBtn.style.pointerEvents = "auto";
    }
}

window.onload = function(){

    const finishBtn =
    document.getElementById("finishLesson");

    finishBtn.style.opacity = "0.4";

    finishBtn.style.pointerEvents = "none";
};

</script>

</body>
</html>
