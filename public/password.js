const showPasswordButton = document.getElementById("password-icon-button");
const passwordEyeIcon = document.getElementById("password-icon-img");
const passwordInput = document.getElementById("password-input");

showPasswordButton.addEventListener("click", toggleEyeIcon);

function toggleEyeIcon() {
  const currentSrc = passwordEyeIcon.src;

  const eyeSlashPath = "./icons/fa-eye-slash.svg";
  const eyePath = "./icons/fa-eye.svg";

  // usar slash por causa do nome do icone
  if (currentSrc.includes("slash")) {
    passwordEyeIcon.src = eyePath;
    passwordInput.type = "text";
  } else {
    passwordEyeIcon.src = eyeSlashPath;
    passwordInput.type = "password";
  }
}
