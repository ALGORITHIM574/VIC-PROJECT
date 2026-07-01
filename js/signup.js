import { supabase } from "./supabase.js";

const form = document.getElementById("signup-form");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // ==========================
  // Get Form Values
  // ==========================

  const fullName = document.getElementById("full-name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // ==========================
  // Create Auth User
  // ==========================

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    message.textContent = error.message;
    message.style.color = "red";
    return;
  }

  // ==========================
  // Save Member Record
  // ==========================

  const { error: memberError } = await supabase.from("members").insert({
    full_name: fullName,
    phone: phone,
    email: email,
    role: "Member",
    status: "Pending",
    date_joined: new Date().toISOString().split("T")[0],
  });

  if (memberError) {
    message.textContent = memberError.message;
    message.style.color = "red";
    return;
  }

  // ==========================
  // Success
  // ==========================

  message.style.color = "green";
  message.textContent =
    "Account created successfully. Wait for Admin approval before logging in.";

  form.reset();
});
