const answers = {
  q1: "B",
  q2: "A",
};

let done = {
  q1: false,
  q2: false,
};

document.querySelectorAll(".quiz-option").forEach((option) => {
  option.addEventListener("click", () => {
    const question = option.dataset.question;
    const answer = option.dataset.answer;

    document
      .querySelectorAll(`[data-question="${question}"]`)
      .forEach((item) => {
        item.classList.remove("correct");
        item.classList.remove("wrong");

        const mark = item.querySelector(".mark");

        if (mark) {
          mark.remove();
        }
      });

    if (answer === answers[question]) {
      option.classList.add("correct");

      option.innerHTML += '<span class="mark"> ✓ </span>';
    } else {
      option.classList.add("wrong");

      option.innerHTML += '<span class="mark"> ✗ </span>';
    }

    done[question] = true;

    if (done.q1 && done.q2) {
      document.getElementById("nextBtn").classList.remove("disabled");
    }
  });
});
