import { supabase } from "./supabase.js";

const form = document.getElementById("login-form");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // ==========================
  // Login
  // ==========================

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    message.textContent = error.message;
    message.style.color = "red";
    return;
  }

  // ==========================
  // Find Role
  // ==========================

  const { data: member, error: memberError } = await supabase
    .from("members")
    .select("role")
    .eq("email", email)
    .single();

  if (memberError) {
    message.textContent = "User record not found.";
    message.style.color = "red";

    await supabase.auth.signOut();

    return;
  }

  // ==========================
  // Save Role
  // ==========================

  localStorage.setItem("userRole", member.role);

  // Optional
  localStorage.setItem("userEmail", email);

  message.textContent = "Login Successful";
  message.style.color = "green";

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1000);
});
