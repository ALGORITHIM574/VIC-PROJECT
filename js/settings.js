import { supabase } from "./supabase.js";
import { requireRole } from "./auth-guard.js";

// ==========================================
// SECURITY
// ==========================================

const profile = await requireRole(["admin", "sec", "Member"]);

if (!profile) {
  throw new Error("Unauthorized");
}

// ==========================================
// ELEMENTS
// ==========================================

const fullName = document.getElementById("full-name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const role = document.getElementById("role");

const adminSettings = document.getElementById("admin-settings");
const securitySettings = document.getElementById("security-settings");

const saveProfile = document.getElementById("save-profile");

// ==========================================
// LOAD USER INFORMATION
// ==========================================

async function loadProfile() {
  fullName.value = profile.full_name;
  email.value = profile.email;
  role.value = profile.role;

  // Load latest phone number

  const { data, error } = await supabase
    .from("members")
    .select("phone")
    .eq("id", profile.id)
    .single();

  if (!error && data) {
    phone.value = data.phone || "";
  }

  // Admin Only

  if (profile.role === "admin") {
    adminSettings.style.display = "block";
    securitySettings.style.display = "block";
  }
}

// ==========================================
// SAVE PROFILE
// ==========================================

saveProfile.addEventListener("click", async () => {
  const { error } = await supabase
    .from("members")
    .update({
      phone: phone.value.trim(),
    })
    .eq("id", profile.id);

  if (error) {
    alert("Failed to update profile.");
    console.log(error);
    return;
  }

  alert("Profile updated successfully.");
});

// ==========================================
// START
// ==========================================

loadProfile();

// ==========================================
// NOTIFICATION SETTINGS
// ==========================================

const notifyContributions = document.getElementById("notify-contributions");
const notifyMeetings = document.getElementById("notify-meetings");
const notifyAnnouncements = document.getElementById("notify-announcements");
const notifySupport = document.getElementById("notify-support");

const saveNotifications = document.getElementById("save-notifications");

// ==========================================
// LOAD NOTIFICATION SETTINGS
// ==========================================

function loadNotificationSettings() {
  notifyContributions.checked =
    localStorage.getItem("notifyContributions") === "true";

  notifyMeetings.checked = localStorage.getItem("notifyMeetings") === "true";

  notifyAnnouncements.checked =
    localStorage.getItem("notifyAnnouncements") === "true";

  notifySupport.checked = localStorage.getItem("notifySupport") === "true";
}

// ==========================================
// SAVE NOTIFICATION SETTINGS
// ==========================================

saveNotifications.addEventListener("click", () => {
  localStorage.setItem("notifyContributions", notifyContributions.checked);

  localStorage.setItem("notifyMeetings", notifyMeetings.checked);

  localStorage.setItem("notifyAnnouncements", notifyAnnouncements.checked);

  localStorage.setItem("notifySupport", notifySupport.checked);

  alert("Notification settings saved.");
});

// ==========================================
// APPEARANCE SETTINGS
// ==========================================

const theme = document.getElementById("theme");
const fontSize = document.getElementById("font-size");

const saveAppearance = document.getElementById("save-appearance");

// ==========================================
// LOAD APPEARANCE
// ==========================================

function loadAppearance() {
  const savedTheme = localStorage.getItem("theme") || "light";

  const savedFont = localStorage.getItem("fontSize") || "medium";

  theme.value = savedTheme;

  fontSize.value = savedFont;

  document.body.setAttribute("data-theme", savedTheme);

  document.body.setAttribute("data-font", savedFont);
}

// ==========================================
// SAVE APPEARANCE
// ==========================================

saveAppearance.addEventListener("click", () => {
  localStorage.setItem("theme", theme.value);

  localStorage.setItem("fontSize", fontSize.value);

  document.body.setAttribute("data-theme", theme.value);

  document.body.setAttribute("data-font", fontSize.value);

  alert("Appearance updated.");
});

// ==========================================
// INITIALIZE
// ==========================================

loadNotificationSettings();

loadAppearance();
// ==========================================
// CHANGE PASSWORD
// ==========================================

const currentPassword = document.getElementById("current-password");
const newPassword = document.getElementById("new-password");
const confirmPassword = document.getElementById("confirm-password");

const changePassword = document.getElementById("change-password");

changePassword.addEventListener("click", async () => {
  if (newPassword.value.trim() === "") {
    alert("Please enter a new password.");
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    alert("Passwords do not match.");
    return;
  }

  if (newPassword.value.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword.value,
  });

  if (error) {
    console.log(error);
    alert(error.message);
    return;
  }

  alert("Password updated successfully.");

  currentPassword.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
});

// ==========================================
// PROFILE IMAGE PREVIEW
// ==========================================

const profileUpload = document.getElementById("profile-upload");
const profileImage = document.getElementById("profile-image");

profileUpload.addEventListener("change", () => {
  const file = profileUpload.files[0];

  if (!file) return;

  profileImage.src = URL.createObjectURL(file);
});

// ==========================================
// CHURCH INFORMATION
// ==========================================

const churchName = document.getElementById("church-name");
const churchEmail = document.getElementById("church-email");
const churchPhone = document.getElementById("church-phone");
const churchAddress = document.getElementById("church-address");

const saveChurchInfo = document.getElementById("save-church-info");

if (saveChurchInfo) {
  saveChurchInfo.addEventListener("click", () => {
    alert("Church Information saving will be connected to Supabase later.");
  });
}

// ==========================================
// SECURITY BUTTONS
// ==========================================

const backupSystem = document.getElementById("backup-system");
const resetPasswords = document.getElementById("reset-passwords");
const viewLogins = document.getElementById("view-logins");
const manageUsers = document.getElementById("manage-users");

if (backupSystem) {
  backupSystem.addEventListener("click", () => {
    alert("Database backup feature coming soon.");
  });
}

if (resetPasswords) {
  resetPasswords.addEventListener("click", () => {
    alert("Reset Password feature coming soon.");
  });
}

if (viewLogins) {
  viewLogins.addEventListener("click", () => {
    alert("Login History feature coming soon.");
  });
}

if (manageUsers) {
  manageUsers.addEventListener("click", () => {
    window.location.href = "members.html";
  });
}

// ==========================================
// SETTINGS PAGE READY
// ==========================================

console.log("Settings page loaded successfully.");
