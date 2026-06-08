```javascript id="e9m2wq"
// ==========================
// TAMADDUN DASHBOARD JS
// ==========================

document.addEventListener(
"DOMContentLoaded",
function(){

    document.body.style.opacity =
    "0";

    setTimeout(() => {

        document.body.style.transition =
        "0.5s ease";

        document.body.style.opacity =
        "1";

    },100);

});


// ==========================
// STAT CARD HOVER
// ==========================

const statCards =
document.querySelectorAll(
".stat-card"
);

statCards.forEach(card => {

    card.addEventListener(
    "mouseenter",
    () => {

        card.style.transform =
        "translateY(-6px)";

    });

    card.addEventListener(
    "mouseleave",
    () => {

        card.style.transform =
        "translateY(0px)";

    });

});


// ==========================
// LESSON CARD EFFECT
// ==========================

const lessonCards =
document.querySelectorAll(
".lesson-card"
);

lessonCards.forEach(card => {

    card.addEventListener(
    "mouseenter",
    () => {

        card.style.transform =
        "translateY(-8px)";

    });

    card.addEventListener(
    "mouseleave",
    () => {

        card.style.transform =
        "translateY(0px)";

    });

});


// ==========================
// PROGRESS BAR ANIMATION
// ==========================

const progressBar =
document.querySelector(
".progress-bar"
);

if(progressBar){

    let width = 0;

    const animate =
    setInterval(() => {

        if(width >= 0){

            clearInterval(
            animate
            );

        }else{

            width++;

            progressBar.style.width =
            width + "%";

        }

    },20);

}


// ==========================
// SIDEBAR CLICK ACTIVE
// ==========================

const menuItems =
document.querySelectorAll(
".sidebar li"
);

menuItems.forEach(item => {

    item.addEventListener(
    "click",
    () => {

        menuItems.forEach(el => {

            el.classList.remove(
            "active"
            );

        });

        item.classList.add(
        "active"
        );

    });

});


// ==========================
// BUTTON EFFECT
// ==========================

const startButton =
document.querySelector(
".start-btn"
);

if(startButton){

    startButton.addEventListener(
    "mouseenter",
    () => {

        startButton.style.transform =
        "translateY(-3px) scale(1.03)";

    });

    startButton.addEventListener(
    "mouseleave",
    () => {

        startButton.style.transform =
        "translateY(0px) scale(1)";

    });

}


// ==========================
// GREETING EFFECT
// ==========================

const title =
document.querySelector(
".top-header h1"
);

if(title){

    title.style.opacity = "0";

    title.style.transform =
    "translateY(20px)";

    setTimeout(() => {

        title.style.transition =
        "0.8s";

        title.style.opacity =
        "1";

        title.style.transform =
        "translateY(0px)";

    },300);

}


// ==========================
// LESSON START MESSAGE
// ==========================

if(startButton){

    startButton.addEventListener(
    "click",
    () => {

        console.log(
        "1-dars boshlandi"
        );

    });

}
```;
