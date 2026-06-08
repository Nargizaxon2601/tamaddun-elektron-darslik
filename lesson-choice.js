```javascript
/* ==========================
   LESSON 1 - CHOICE
========================== */

let selectedChoice = '';

const choiceButtons =
document.querySelectorAll(
'.choice-btn'
);

const nextButton =
document.getElementById(
'nextBtn'
);

/* ==========================
   CHOICE SELECT
========================== */

choiceButtons.forEach(btn => {

    btn.addEventListener(
    'click',
    function(e){

        e.preventDefault();

        choiceButtons.forEach(item => {

            item.classList.remove(
            'selected'
            );

        });

        this.classList.add(
        'selected'
        );

        selectedChoice =
        this.value;

        if(nextButton){

            nextButton.disabled =
            false;

        }

    });

});


/* ==========================
   NEXT BUTTON
========================== */

if(nextButton){

    nextButton.addEventListener(
    'click',
    () => {

        if(selectedChoice === ''){

            alert(
            'Variant tanlang!'
            );

            return;

        }

        window.location.href =
        'lesson1-result.php?choice='
        + selectedChoice;

    });

}


/* ==========================
   STEP ANIMATION
========================== */

const activeStep =
document.querySelector(
'.step.active'
);

if(activeStep){

    setInterval(() => {

        activeStep.style.transform =
        'scale(1.08)';

        setTimeout(() => {

            activeStep.style.transform =
            'scale(1)';

        },400);

    },1500);

}


/* ==========================
   BUTTON HOVER
========================== */

choiceButtons.forEach(btn => {

    btn.addEventListener(
    'mouseenter',
    () => {

        if(
        !btn.classList.contains(
        'selected'
        )
        ){

            btn.style.transform =
            'translateY(-4px)';

        }

    });

    btn.addEventListener(
    'mouseleave',
    () => {

        if(
        !btn.classList.contains(
        'selected'
        )
        ){

            btn.style.transform =
            'translateY(0)';

        }

    });

});


/* ==========================
   CONSOLE
========================== */

console.log(
'%cLESSON CHOICE READY 🚀',
'color:#1d74ff;font-size:16px;font-weight:bold'
);
```;
