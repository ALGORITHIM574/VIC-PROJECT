import { supabase } from "./supabase.js";
import { requireRole } from "./auth-guard.js";

// ==========================
// Security
// ==========================

const profile = await requireRole(["Member"]);

if (!profile) {
  throw new Error("Unauthorized");
}

// ==========================
// Welcome
// ==========================

document.getElementById("member-name").textContent = profile.full_name;

// ==========================
// Elements
// ==========================

const monthTotalEl = document.getElementById("month-total");
const yearTotalEl = document.getElementById("year-total");
const lifetimeTotalEl = document.getElementById("lifetime-total");
const historyBody = document.getElementById("history-body");
const chartCanvas = document.getElementById("contributionChart");

// ==========================
// Load Contributions
// ==========================

async function loadContributions() {
  const { data, error } = await supabase
    .from("contributions")
    .select("*")
    .eq("member_id", profile.id)
    .order("contribution_date", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  // ==========================
  // Totals
  // ==========================

  let lifetimeTotal = 0;
  let monthTotal = 0;
  let yearTotal = 0;

  const today = new Date();

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  historyBody.innerHTML = "";
  const labels = [];
  const amounts = [];

  data.forEach((contribution) => {
    const amount = Number(contribution.amount);
    labels.push(contribution.contribution_date);
    amounts.push(amount);

    lifetimeTotal += amount;

    const contributionDate = new Date(contribution.contribution_date);

    if (
      contributionDate.getMonth() === currentMonth &&
      contributionDate.getFullYear() === currentYear
    ) {
      monthTotal += amount;
    }

    if (contributionDate.getFullYear() === currentYear) {
      yearTotal += amount;
    }

    historyBody.innerHTML += `
      <tr>
        <td>${contribution.contribution_date}</td>
        <td>KES ${amount.toLocaleString()}</td>
      </tr>
    `;
  });

  // ==========================
  // Display Totals
  // ==========================

  monthTotalEl.textContent = `KES ${monthTotal.toLocaleString()}`;
  yearTotalEl.textContent = `KES ${yearTotal.toLocaleString()}`;
  lifetimeTotalEl.textContent = `KES ${lifetimeTotal.toLocaleString()}`;
  //chart section
  new Chart(chartCanvas, {
    type: "line",

    data: {
      labels: labels,

      datasets: [
        {
          label: "Contribution",

          data: amounts,

          borderColor: "#1f4e79",

          backgroundColor: "rgba(31,78,121,0.15)",

          fill: true,

          tension: 0.4,

          borderWidth: 3,

          pointBackgroundColor: "#28a745",

          pointBorderColor: "#28a745",

          pointRadius: 5,
        },
      ],
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          display: false,
        },
      },

      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  console.log(data);
}

// ==========================
// Start
// ==========================

loadContributions();
