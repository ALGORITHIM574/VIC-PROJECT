import { requireRole } from "./auth-guard.js";

// ==========================
// SECURITY CHECK
// ==========================

const profile = await requireRole(["admin", "sec", "Member"]);

if (!profile) {
  throw new Error("Unauthorized");
}

// ==========================
// USERNAME
// ==========================

const username = document.getElementById("username");

if (username) {
  username.textContent = profile.full_name;
}

// ==========================
// DASHBOARD PANELS
// ==========================

const adminSection = document.getElementById("admin-section");
const secretarySection = document.getElementById("secretary-section");
const memberSection = document.getElementById("member-section");

// ==========================
// SIDEBAR MENUS
// ==========================

const membersMenu = document.getElementById("members-menu");
const reportsMenu = document.getElementById("reports-menu");
const settingsMenu = document.getElementById("settings-menu");

// ==========================
// OTHER CONTROLS
// ==========================

const addContributionButton = document.getElementById("btn");
const myContributionButton = document.getElementById("my-contributions-btn");
const viewMeetingsButton = document.getElementById("view-meetings-btn");

if (myContributionButton) {
  myContributionButton.addEventListener("click", () => {
    window.location.href = "my-contributions.html";
  });
}
if (viewMeetingsButton) {
  viewMeetingsButton.addEventListener("click", () => {
    window.location.href = "meetings.html";
  });
}
// ==========================
// HIDE EVERYTHING FIRST
// ==========================

if (adminSection) adminSection.style.display = "none";
if (secretarySection) secretarySection.style.display = "none";
if (memberSection) memberSection.style.display = "none";

if (membersMenu) membersMenu.style.display = "none";
if (reportsMenu) reportsMenu.style.display = "none";
if (settingsMenu) settingsMenu.style.display = "none";

if (addContributionButton) addContributionButton.style.display = "none";

// ==========================
// ADMIN
// ==========================

if (profile.role === "admin") {
  if (adminSection) adminSection.style.display = "block";

  if (membersMenu) membersMenu.style.display = "block";
  if (reportsMenu) reportsMenu.style.display = "block";
  if (settingsMenu) settingsMenu.style.display = "block";

  if (addContributionButton)
    addContributionButton.style.display = "inline-block";
}

// ==========================
// SECRETARY
// ==========================

if (profile.role === "sec") {
  if (secretarySection) secretarySection.style.display = "block";

  if (reportsMenu) reportsMenu.style.display = "block";

  if (addContributionButton)
    addContributionButton.style.display = "inline-block";
}

// ==========================
// MEMBER
// ==========================

if (profile.role === "Member") {
  if (memberSection) memberSection.style.display = "block";
}

// ==========================
// DEBUG
// ==========================

console.log(profile);
