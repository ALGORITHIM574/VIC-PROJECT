import { supabase } from "./supabase.js";

const logout = document.getElementById("logout");

logout.addEventListener("click", async () => {
  await supabase.auth.signOut();

  window.location.href = "login.html";
});
