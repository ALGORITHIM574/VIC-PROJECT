// import { supabase } from "./supabase.js";

// const {
//   data: { session },
// } = await supabase.auth.getSession();

// if (!session) {
//   window.location.href = "login.html";
// }
import { supabase } from "./supabase.js";

const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  window.location.href = "login.html";
}

const user = session.user;

const { data: profile, error } = await supabase
  .from("profiles")
  .select("full_name,role")
  .eq("id", user.id)
  .single();

// if (error) {
//   console.log(error);

//   window.location.href = "login.html";
// }
if (error) {
  console.log("Profile error:", error.message);

  //return;
}

// document.getElementById("username").textContent = profile.full_name;
document.getElementById("username").textContent = profile.full_name || "User";

const role = profile.role;

if (role === "admin") {
  document.getElementById("admin-section").style.display = "block";
}

if (role === "secretary") {
  document.getElementById("secretary-section").style.display = "block";
}

if (role === "member") {
  document.getElementById("member-section").style.display = "block";
}
