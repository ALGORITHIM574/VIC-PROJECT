import { supabase } from "./supabase.js";
import { requireRole } from "./auth-guard.js";

// ==========================
// Only Admin Can Access
// ==========================

await requireRole(["admin"]);

const tbody = document.getElementById("approval-body");

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
    return;
  }

  tbody.innerHTML = "";

  data.forEach((member) => {
    tbody.innerHTML += `

<tr>

<td>${member.full_name}</td>

<td>${member.email}</td>

<td>${member.phone}</td>

<td>${member.status}</td>

<td>

<button class="approve"
onclick="approveMember('${member.id}')">

<i class="fa-solid fa-check"></i>

Approve

</button>

<button class="reject"
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
// Approve
// ==========================

window.approveMember = async function (id) {
  const { error } = await supabase

    .from("members")

    .update({
      status: "Approved",
    })

    .eq("id", id);

  if (error) {
    console.log(error);

    return;
  }

  loadPendingMembers();
};

// ==========================
// Reject
// ==========================

window.rejectMember = async function (id) {
  const { error } = await supabase

    .from("members")

    .update({
      status: "Rejected",
    })

    .eq("id", id);

  if (error) {
    console.log(error);

    return;
  }

  loadPendingMembers();
};
