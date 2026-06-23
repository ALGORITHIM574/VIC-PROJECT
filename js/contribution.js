import { supabase } from "./supabase.js";

const memberSelect = document.getElementById("member-select");
const saveButton = document.getElementById("save-contribution");
const amountInput = document.getElementById("amount");

// LOAD MEMBERS INTO DROPDOWN

async function loadMembers() {
  const { data, error } = await supabase.from("members").select("id,full_name");

  if (error) {
    console.log(error);
    return;
  }

  data.forEach((member) => {
    const option = document.createElement("option");

    option.value = member.id;

    option.textContent = member.full_name;

    memberSelect.appendChild(option);
  });
}

// SAVE CONTRIBUTION

saveButton.addEventListener("click", async () => {
  const member_id = memberSelect.value;

  const amount = amountInput.value;

  const { error } = await supabase.from("contributions").insert({
    member_id: member_id,

    amount: amount,
  });

  if (error) {
    console.log(error);

    alert("Failed");

    return;
  }

  alert("Contribution Added");

  amountInput.value = "";

  memberSelect.value = "";
});

loadMembers();
