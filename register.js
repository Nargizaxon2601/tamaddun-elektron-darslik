const inputs = document.querySelectorAll("input");

inputs.forEach((input) => {
  input.addEventListener("focus", () => {
    input.style.boxShadow = "0 0 20px rgba(20,93,255,.2)";
  });

  input.addEventListener("blur", () => {
    input.style.boxShadow = "none";
  });
});
