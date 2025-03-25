(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

document.addEventListener("DOMContentLoaded", function () {
  // Smooth fade-in effect on page load
  document.querySelector(".edit-card").classList.add("visible");

  // Image preview zoom effect
  const imgPreview = document.querySelector(".show-card img");
  imgPreview.addEventListener("mouseover", () => {
    imgPreview.style.transform = "scale(1.08)";
    imgPreview.style.boxShadow = "0px 4px 15px rgba(0, 0, 0, 0.2)";
  });
  imgPreview.addEventListener("mouseleave", () => {
    imgPreview.style.transform = "scale(1)";
    imgPreview.style.boxShadow = "none";
  });

  // Button hover glow effect
  const editBtn = document.querySelector(".btn-danger");
  editBtn.addEventListener("mouseover", () => {
    editBtn.style.boxShadow = "0px 0px 15px rgba(220, 53, 69, 0.6)";
  });
  editBtn.addEventListener("mouseleave", () => {
    editBtn.style.boxShadow = "none";
  });
});
