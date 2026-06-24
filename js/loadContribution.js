import { supabase } from "./supabase.js";

const tbody = document.getElementById("contribution-body");

function getSundayNumber(dateString) {
  const date = new Date(dateString);

  let sundayCount = 0;

  for (let day = 1; day <= date.getDate(); day++) {
    const current = new Date(date.getFullYear(), date.getMonth(), day);

    if (current.getDay() === 0) {
      sundayCount++;
    }
  }

  return sundayCount;
}

async function loadContributions() {
  const { data, error } = await supabase.from("contributions").select(`
    amount,
    contribution_date,
    members (
      full_name
    )
  `);

  if (error) {
    console.log(error);
    return;
  }

  const grouped = {};

  data.forEach((contribution) => {
    const name = contribution.members.full_name;

    if (!grouped[name]) {
      grouped[name] = {
        sun1: 0,
        sun2: 0,
        sun3: 0,
        sun4: 0,
        sun5: 0,
        total: 0,
      };
    }

    const sunday = getSundayNumber(contribution.contribution_date);

    const amount = Number(contribution.amount);

    if (sunday >= 1 && sunday <= 5) {
      grouped[name][`sun${sunday}`] += amount;
    }

    grouped[name].total += amount;
  });

  tbody.innerHTML = "";

  let index = 1;

  Object.entries(grouped).forEach(([name, data]) => {
    tbody.innerHTML += `
      <tr>
        <td>${index++}</td>
        <td>${name}</td>
        <td>KES ${data.sun1}</td>
        <td>KES ${data.sun2}</td>
        <td>KES ${data.sun3}</td>
        <td>KES ${data.sun4}</td>
        <td>KES ${data.sun5}</td>
        <td>KES ${data.total}</td>
      </tr>
    `;
  });
}

loadContributions();
