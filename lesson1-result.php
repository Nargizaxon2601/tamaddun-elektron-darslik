```php
<?php
session_start();

$choice = $_GET['choice'] ?? 'A';

if($choice == 'A'){

    $title = "Sen to‘g‘ri yo‘lni tanlading!";
    $text = "Yangi kelgan bola o‘zini yolg‘iz his qilmaydi. U do‘stlar topadi va maktabni yaxshi ko‘radi.";
    $value = "Vatanni sevish — odamlarga mehr ko‘rsatishdan boshlanadi.";
    $image = "images/result-a.png";
    $score = true;
    $color = "#22c55e";

}elseif($choice == 'B'){

    $title = "Sen uyalib turding";
    $text = "Lekin bu hamma vaqt yordam bermaslik degani emas. Do‘stlik boshlanmay qoldi.";
    $value = "Ba'zan bir qadam tashlamaslik — katta imkoniyatni yo‘qotishdir.";
    $image = "images/result-b.png";
    $score = false;
    $color = "#eab308";

}else{

    $title = "Sen aralashmading";
    $text = "Yangi bola o‘zini yolg‘iz his qildi.";
    $value = "Boshqalarga yordam bermaslik ham tanlovdir, lekin u har doim to‘g‘ri emas.";
    $image = "images/result-c.png";
    $score = false;
    $color = "#ef4444";
}
?>
<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>1-dars | Natijalar</title>

<link rel="stylesheet" href="css/lesson1.css">

<style>

body{
    background:#eef7ff;
    font-family:'Nunito',sans-serif;
}

.result-container{
    max-width:1300px;
    margin:40px auto;
    padding:20px;
}

.result-card{

    background:white;

    border-radius:35px;

    padding:50px;

    display:flex;

    align-items:center;

    justify-content:space-between;

    gap:50px;

    box-shadow:0 10px 35px rgba(0,0,0,.08);
}

.result-left{
    flex:1;
}

.result-right{
    flex:1;
}

.result-right img{

    width:100%;

    border-radius:25px;
}

.badge{

    display:inline-block;

    background:#dbeafe;

    color:#0f63e8;

    padding:10px 20px;

    border-radius:50px;

    font-weight:800;

    margin-bottom:20px;
}

.result-title{

    font-size:48px;

    margin-bottom:20px;
}

.result-text{

    font-size:22px;

    line-height:1.8;

    color:#555;

    margin-bottom:30px;
}

.value-box{

    background:#f8fafc;

    border-left:6px solid #0f63e8;

    padding:25px;

    border-radius:20px;

    margin-bottom:25px;
}

.value-box h3{

    margin-bottom:10px;
}

.score-box{

    background:#dcfce7;

    padding:20px;

    border-radius:20px;

    font-size:24px;

    font-weight:900;

    color:#166534;
}

.bottom-nav{

    margin-top:35px;

    display:flex;

    justify-content:space-between;

    align-items:center;
}

.back-btn{

    background:#f1f5f9;

    color:#333;

    text-decoration:none;

    padding:16px 30px;

    border-radius:50px;

    font-weight:800;
}

.next-btn{

    background:#16a34a;

    color:white;

    text-decoration:none;

    padding:16px 35px;

    border-radius:50px;

    font-weight:800;
}

.progress{

    display:flex;

    gap:12px;
}

.step{

    width:50px;

    height:50px;

    border-radius:50%;

    display:flex;

    justify-content:center;

    align-items:center;

    background:#e5e7eb;

    font-weight:900;
}

.done{

    background:#22c55e;

    color:white;
}

.active{

    background:#0f63e8;

    color:white;
}

</style>
</head>
<body>

<div class="result-container">

<div class="result-card">

<div class="result-left">

<div class="badge">
🏆 3-qism: Natijalar
</div>

<h1
class="result-title"
style="color:<?= $color ?>">

<?= $title ?>

</h1>

<p class="result-text">

<?= $text ?>

</p>

<div class="value-box">

<h3>❤️ Qadriyat</h3>

<p>

<?= $value ?>

</p>

</div>

<?php if($score): ?>

<div class="score-box">

🏅 +10 "Ezgu amal"

</div>

<?php endif; ?>

</div>

<div class="result-right">

<img
src="<?= $image ?>"
alt="Natija">

</div>

</div>

<div class="bottom-nav">

<a
href="lesson1-choice.php"
class="back-btn">

← OLDINGI

</a>

<div class="progress">

<div class="step done">✓</div>

<div class="step done">✓</div>

<div class="step active">3</div>

<div class="step">4</div>

<div class="step">5</div>

<div class="step">6</div>

</div>

<a
href="lesson1-summary.php"
class="next-btn">

DAVOM ETISH →

</a>

</div>

</div>

</body>
</html>
```
