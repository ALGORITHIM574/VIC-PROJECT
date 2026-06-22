import { supabase } from "./supabase.js"; //create a door for supabase

const form = document.getElementById("login-form");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); //prevent reloading of te page when login

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    message.textContent = error.message;
    message.style.color = "red";
    return;
  }

  message.textContent = "Login successful";
  message.style.color = "green"; //if login is sucefull

  window.location.href = "dashboard.html"; //redirects the code to the dashboard.html
});
