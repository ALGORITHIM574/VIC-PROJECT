import { supabase } from "./supabase.js";

const memberSelect = document.getElementById("member-select");
const saveButton = document.getElementById("save-contribution");
const amountInput = document.getElementById("amount");

// ==========================
// Toast Message
// ==========================

function showToast(message, color = "#28a745") {
  const toast = document.getElementById("toast");

  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.style.background = color;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// ==========================
// Load Approved Members
// ==========================

async function loadMembers() {
  const { data, error } = await supabase
    .from("members")
    .select("id, full_name")
    .eq("status", "Approved")
    .order("full_name");

  if (error) {
    console.log(error);
    showToast("Failed to load members.", "#dc3545");
    return;
  }

  memberSelect.innerHTML = `<option value="">Select Member</option>`;

  data.forEach((member) => {
    const option = document.createElement("option");

    option.value = member.id;
    option.textContent = member.full_name;

    memberSelect.appendChild(option);
  });
}

// ==========================
// Save Contribution
// ==========================

saveButton.addEventListener("click", async () => {
  const member_id = memberSelect.value;

  const amount = Number(amountInput.value);

  // --------------------------
  // Validation
  // --------------------------

  if (!member_id) {
    showToast("Please select a member.", "#dc3545");
    return;
  }

  if (!amount || amount <= 0) {
    showToast("Enter a valid amount.", "#dc3545");
    return;
  }

  // --------------------------
  // Insert Contribution
  // --------------------------

  const { error } = await supabase.from("contributions").insert({
    member_id: member_id,
    amount: amount,
    contribution_date: new Date().toISOString().split("T")[0],
  });

  if (error) {
    console.log(error);
    showToast("Failed to save contribution.", "#dc3545");
    return;
  }

  // --------------------------
  // Success
  // --------------------------

  showToast("✅ Contribution Added");

  amountInput.value = "";
  memberSelect.value = "";
});

// ==========================
// Start
// ==========================

loadMembers();
