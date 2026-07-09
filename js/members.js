import { supabase } from "./supabase.js";
import { requireRole } from "./auth-guard.js";

// ==========================
// Security
// ==========================

await requireRole(["admin"]);

// ==========================
// Elements
// ==========================

const tableBody = document.getElementById("members-body");

const saveButton = document.getElementById("save");

const editModal = document.getElementById("edit-modal");

const overlay = document.getElementById("overlay");

const updateButton = document.getElementById("update-member");

const cancelEdit = document.getElementById("cancel-edit");

// ==========================
// Load Members
// ==========================

async function loadMembers() {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  tableBody.innerHTML = "";

  data.forEach((member, index) => {
    tableBody.innerHTML += `
      <tr>

        <td>${index + 1}</td>

        <td>${member.full_name}</td>

        <td>${member.phone}</td>

        <td>${member.email}</td>

        <td>${member.date_joined}</td>

        <td>

          <button
            class="edit-btn"
            onclick="editMember('${member.id}')">

            <i class="fa-solid fa-pen"></i>

            Edit

          </button>

     <button
class="delete-btn"
onclick="deleteMember('${member.id}')">

<i class="fa-solid fa-trash"></i>

Delete

</button>

        </td>

      </tr>
    `;
  });
}

// ==========================
// Add Member
// ==========================

saveButton.addEventListener("click", async () => {
  const full_name = document.getElementById("full-name").value;

  const phone = document.getElementById("phone").value;

  const email = document.getElementById("email").value;

  const date_joined = document.getElementById("date-joined").value;

  const { error } = await supabase.from("members").insert({
    full_name,
    phone,
    email,
    date_joined,
  });

  if (error) {
    console.log(error);
    alert("Failed to add member.");
    return;
  }

  alert("Member added successfully.");

  document.getElementById("full-name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("email").value = "";
  document.getElementById("date-joined").value = "";

  loadMembers();
});

// ==========================
// Edit Member
// ==========================

window.editMember = async function (id) {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error);
    return;
  }

  document.getElementById("edit-id").value = data.id;

  document.getElementById("edit-name").value = data.full_name;

  document.getElementById("edit-phone").value = data.phone;

  document.getElementById("edit-email").value = data.email;

  document.getElementById("edit-date").value = data.date_joined;

  document.getElementById("edit-role").value = data.role;

  document.getElementById("edit-status").value = data.status;

  overlay.style.display = "block";

  editModal.style.display = "block";
};

// ==========================
// Delete Member
// ==========================

window.deleteMember = async function (id) {
  const confirmDelete = confirm("Are you sure you want to delete this member?");

  if (!confirmDelete) {
    return;
  }

  const { error } = await supabase.from("members").delete().eq("id", id);

  if (error) {
    console.log(error);
    alert("Failed to delete member.");
    return;
  }

  alert("Member deleted successfully.");

  loadMembers();
};
// ==========================
// Cancel Edit
// ==========================

cancelEdit.addEventListener("click", () => {
  editModal.style.display = "none";

  overlay.style.display = "none";
});

// ==========================
// Update Member
// ==========================

updateButton.addEventListener("click", async () => {
  const id = document.getElementById("edit-id").value;

  const full_name = document.getElementById("edit-name").value;

  const phone = document.getElementById("edit-phone").value;

  const email = document.getElementById("edit-email").value;

  const date_joined = document.getElementById("edit-date").value;

  const role = document.getElementById("edit-role").value;

  const status = document.getElementById("edit-status").value;

  const { error } = await supabase
    .from("members")
    .update({
      full_name,
      phone,
      email,
      date_joined,
      role,
      status,
    })
    .eq("id", id);

  if (error) {
    console.log(error);
    alert("Failed to update member.");
    return;
  }

  alert("Member updated successfully.");

  editModal.style.display = "none";

  overlay.style.display = "none";

  loadMembers();
});

// ==========================
// Initial Load
// ==========================

loadMembers();
