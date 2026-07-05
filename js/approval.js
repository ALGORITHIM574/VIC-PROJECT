import { supabase } from "./supabase.js";
import { requireRole } from "./auth-guard.js";

// ==========================
// Only Admin Can Access
// ==========================

await requireRole(["admin"]);

const tbody = document.getElementById("approval-body");
const toast = document.getElementById("toast");

// ==========================
// Toast Notification
// ==========================

function showToast(message, color = "#28a745") {
  toast.textContent = message;
  toast.style.background = color;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// ==========================
// Load Pending Members
// ==========================

async function loadPendingMembers() {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("status", "Pending")
    .order("full_name");

  if (error) {
    console.log(error);
    showToast("Failed to load pending members.", "#dc3545");
    return;
  }

  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;">
          No pending approval requests.
        </td>
      </tr>
    `;
    return;
  }

  data.forEach((member) => {
    tbody.innerHTML += `
      <tr>
        <td>${member.full_name}</td>
        <td>${member.email}</td>
        <td>${member.phone}</td>
        <td class="status">${member.status}</td>

        <td>
          <button
            class="approve"
            onclick="approveMember('${member.id}')">

            <i class="fa-solid fa-check"></i>
            Approve

          </button>

          <button
            class="reject"
            onclick="rejectMember('${member.id}')">

            <i class="fa-solid fa-xmark"></i>
            Reject

          </button>
        </td>
      </tr>
    `;
  });
}

loadPendingMembers();

// ==========================
// Approve Member
// ==========================

window.approveMember = async function (id) {
  const { data, error } = await supabase
    .from("members")
    .update({
      status: "Approved",
    })
    .eq("id", id)
    .select();

  if (error) {
    console.log(error);
    showToast(error.message, "#dc3545");
    return;
  }

  if (!data || data.length === 0) {
    showToast("No member was updated.", "#dc3545");
    return;
  }

  showToast("✅ Member Approved");

  loadPendingMembers();
};

// ==========================
// Reject Member
// ==========================

window.rejectMember = async function (id) {
  const { data, error } = await supabase
    .from("members")
    .update({
      status: "Rejected",
    })
    .eq("id", id)
    .select();

  if (error) {
    console.log(error);
    showToast(error.message, "#dc3545");
    return;
  }

  if (!data || data.length === 0) {
    showToast("No member was updated.", "#dc3545");
    return;
  }

  showToast("❌ Member Rejected", "#dc3545");

  loadPendingMembers();
};
