import { supabase } from "./supabase.js";

export async function requireRole(allowedRoles) {
  // ==========================
  // Check Session
  // ==========================

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "login.html";
    return null;
  }

  // ==========================
  // Get Member Profile
  // ==========================

  const { data: profile, error } = await supabase
    .from("members")
    .select("id, full_name, email, role, status")
    .eq("email", session.user.email)
    .single();

  if (error || !profile) {
    console.log(error);

    await supabase.auth.signOut();

    window.location.href = "login.html";

    return null;
  }

  // ==========================
  // Check Approval Status
  // ==========================

  if (profile.status !== "Approved") {
    alert("Your account is awaiting administrator approval.");

    await supabase.auth.signOut();

    window.location.href = "login.html";

    return null;
  }

  // ==========================
  // Check Role
  // ==========================

  if (!allowedRoles.includes(profile.role)) {
    alert("Access Denied");

    window.location.href = "dashboard.html";

    return null;
  }

  // ==========================
  // Return Profile
  // ==========================

  return profile;
}
