import { supabase } from "./supabase.js";

const logout = document.getElementById("logout");

logout.addEventListener("click", async () => {
  await supabase.auth.signOut();

  window.location.href = "login.html";
});
//THIS IS FOR THE DASHBORAD UPDATES

const totalMonthEl = document.getElementById("total-month");
const totalMembersEl = document.getElementById("total-members");
const totalSundaysEl = document.getElementById("total-sundays");
const highestContributorEl = document.getElementById("highest-contributor");

async function loadCards() {
  // MEMBERS
  const { count: memberCount } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true });

  totalMembersEl.textContent = memberCount || 0;

  // CONTRIBUTIONS
  const { data: contributions, error } = await supabase.from("contributions")
    .select(`
      amount,
      member_id,
      members (
        full_name
      )
    `);

  if (error) {
    console.log(error);
    return;
  }

  // TOTAL THIS MONTH
  let totalMonth = 0;

  contributions.forEach((c) => {
    totalMonth += Number(c.amount);
  });

  totalMonthEl.textContent = `KES ${totalMonth}`;

  // HIGHEST CONTRIBUTOR
  const totals = {};

  contributions.forEach((c) => {
    const name = c.members.full_name;

    if (!totals[name]) {
      totals[name] = 0;
    }

    totals[name] += Number(c.amount);
  });

  let highestName = "None";
  let highestAmount = 0;

  Object.entries(totals).forEach(([name, amount]) => {
    if (amount > highestAmount) {
      highestAmount = amount;
      highestName = name;
    }
  });

  highestContributorEl.textContent = `${highestName} - KES ${highestAmount}`;

  // SUNDAYS IN CURRENT MONTH
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const lastDay = new Date(year, month + 1, 0).getDate();

  let sundayCount = 0;

  for (let day = 1; day <= lastDay; day++) {
    const current = new Date(year, month, day);

    if (current.getDay() === 0) {
      sundayCount++;
    }
  }

  totalSundaysEl.textContent = sundayCount;
}

loadCards();
