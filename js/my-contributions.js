import { supabase } from "./supabase.js";
import { requireRole } from "./auth-guard.js";

// ==========================
// Security
// ==========================

const profile = await requireRole(["Member"]);

if (!profile) {
  throw new Error("Unauthorized");
}

// ==========================
// Welcome Message
// ==========================

document.getElementById("member-name").textContent = profile.full_name;

// ==========================
// Get Current Member
// ==========================

const { data: member, error: memberError } = await supabase
  .from("members")
  .select("id")
  .eq("email", profile.email)
  .single();

if (memberError) {
  console.log(memberError);
  return;
}

const memberId = member.id;

console.log("Current Member ID:", memberId);
