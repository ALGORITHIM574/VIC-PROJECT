import { supabase } from "./supabase.js";

const memberSelect = document.getElementById("member-select");
const saveButton = document.getElementById("save-contribution");
const amountInput = document.getElementById("amount");
const contributionBody = document.getElementById("contribution-body");
const editModal = document.getElementById("edit-modal");
const overlay = document.getElementById("overlay");
const cancelEdit = document.getElementById("cancel-edit");
const updateButton = document.getElementById("update-contribution");

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

//search bar
const search = document.getElementById("search-contribution");

search.addEventListener("keyup", () => {
  const value = search.value.toLowerCase();

  const rows = document.querySelectorAll("#contribution-body tr");

  rows.forEach((row) => {
    if (row.textContent.toLowerCase().includes(value)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});

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

  // --------------------------
  // Create Notification
  // --------------------------

  const { error: notificationError } = await supabase
    .from("notifications")
    .insert({
      member_id: member_id,
      title: "Contribution Received",
      message: `Thank you! Your contribution of KES ${amount.toLocaleString()} has been received.`,
    });

  if (notificationError) {
    console.log(notificationError);
  }

  // --------------------------
  // Success
  // --------------------------

  showToast("✅ Contribution Added");

  loadContributions();

  amountInput.value = "";

  memberSelect.value = "";
});

// ==========================
// Start
// ==========================

// ==========================
// Load Contributions
// ==========================

async function loadContributions() {
  const { data, error } = await supabase
    .from("contributions")
    .select(
      `
      id,
      amount,
      contribution_date,
      members (
        full_name
      )
    `,
    )
    .order("contribution_date", { ascending: false });

  if (error) {
    console.log(error);
    showToast("Failed to load contributions.", "#dc3545");
    return;
  }

  contributionBody.innerHTML = "";

  if (data.length === 0) {
    contributionBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;padding:25px;">
          No contributions found.
        </td>
      </tr>
    `;

    return;
  }

  data.forEach((contribution, index) => {
    contributionBody.innerHTML += `

      <tr>

        <td>${index + 1}</td>

      <td>${contribution.members?.full_name || "Unknown Member"}</td>

        <td>KES ${Number(contribution.amount).toLocaleString()}</td>

      <td>

${new Date(contribution.contribution_date).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
})}

</td>

        <td>

       <button
class="edit-btn"
onclick="editContribution('${contribution.id}')">

<i class="fa-solid fa-pen"></i>

Edit

</button>

<button
class="delete-btn"
onclick="deleteContribution('${contribution.id}')">

<i class="fa-solid fa-trash"></i>

Delete

</button>

        </td>

      </tr>

    `;
  });
}
loadMembers();
// const editMember = document.getElementById("edit-member");

// editMember.innerHTML = "";

// data.forEach((member) => {
//   const option = document.createElement("option");

//   option.value = member.id;

//   option.textContent = member.full_name;

//   editMember.appendChild(option);
// });
loadContributions();
