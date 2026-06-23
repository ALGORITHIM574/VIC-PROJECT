import { supabase } from "./supabase.js";

const tableBody = document.getElementById("members-body");

const saveButton = document.getElementById("save");
//USED TO REQUST DATA
async function loadMembers() {
  const { data, error } = await supabase
    .from("members")
    .select("*") //says give me all the column
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
        <button>
        Edit
        </button>

        <button>
        Delete
        </button>
        </td>

        </tr>

        `;
  });
}

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

    alert("Failed to add member");

    return;
  }

  alert("Member added successfully");

  loadMembers();
});

loadMembers();
