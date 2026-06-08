```javascript
document.addEventListener(
"DOMContentLoaded",
function(){

    document.body.style.opacity = "0";

    setTimeout(() => {

        document.body.style.transition =
        "0.5s ease";

        document.body.style.opacity =
        "1";

    },100);

});

const form =
document.querySelector("form");

const button =
document.querySelector("button");

if(form){

    form.addEventListener(
    "submit",
    function(){

        button.innerHTML =
        "⏳ Tekshirilmoqda...";

        button.disabled = true;

    });

}
```;
