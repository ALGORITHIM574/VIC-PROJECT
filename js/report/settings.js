import { supabase } from "./supabase.js";

const saveButton = document.getElementById("save-settings");

function showToast(message, color = "#28a745") {
  const toast = document.getElementById("toast");

  if (!toast) {
    alert(message);

    return;
  }

  toast.textContent = message;

  toast.style.background = color;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

saveButton.addEventListener("click", () => {
  showToast("Settings saved successfully.");
});
