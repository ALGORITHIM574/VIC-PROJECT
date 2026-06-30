import { requireRole } from "./auth-guard.js";

// ==========================
// Security Check
// ==========================

const profile = await requireRole(["Admin", "Secretary", "Member"]);

if (!profile) {
  throw new Error("Unauthorized");
}

// ==========================
// Username
// ==========================

document.getElementById("username").textContent = profile.full_name;

// ==========================
// Sections
// ==========================

const adminSection = document.getElementById("admin-section");
const secretarySection = document.getElementById("secretary-section");
const memberSection = document.getElementById("member-section");

// Hide everything first
if (adminSection) adminSection.style.display = "none";
if (secretarySection) secretarySection.style.display = "none";
if (memberSection) memberSection.style.display = "none";

// ==========================
// Show Correct Section
// ==========================

if (profile.role === "Admin") {
  if (adminSection) adminSection.style.display = "block";
}

if (profile.role === "Secretary") {
  if (secretarySection) secretarySection.style.display = "block";
}

if (profile.role === "Member") {
  if (memberSection) memberSection.style.display = "block";
}

console.log(profile);
