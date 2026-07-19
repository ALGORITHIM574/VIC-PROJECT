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

const btn = document.getElementById("back-btn");
btn.addEventListener("click", function () {
  window.location.href = "dashboard.html";
});
// ==========================
// Load Contributions
// ==========================

async function loadContributions() {
  const { data, error } = await supabase
    .from("contributions")
    .select("*")
    .eq("member_id", profile.id)
    .order("contribution_date", { ascending: true });

  if (error) {
    console.log(error);
    return;
  }

  historyBody.innerHTML = "";

  // ==========================
  // No Contributions
  // ==========================

  if (data.length === 0) {
    historyBody.innerHTML = `
      <tr>
        <td colspan="2" style="text-align:center;padding:30px;">
          No contributions found.
        </td>
      </tr>
    `;

    monthTotalEl.textContent = "KES 0";
    yearTotalEl.textContent = "KES 0";
    lifetimeTotalEl.textContent = "KES 0";

    return;
  }

  // ==========================
  // Variables
  // ==========================

  let lifetimeTotal = 0;
  let monthTotal = 0;
  let yearTotal = 0;

  const labels = [];
  const amounts = [];

  const today = new Date();

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // ==========================
  // Loop Through Contributions
  // ==========================

  data.forEach((contribution) => {
    const amount = Number(contribution.amount);

    const contributionDate = new Date(contribution.contribution_date);

    const formattedDate = contributionDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

    labels.push(formattedDate);
    amounts.push(amount);

    lifetimeTotal += amount;

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
        <td>${formattedDate}</td>
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

  // ==========================
  // Draw Chart
  // ==========================

  new Chart(chartCanvas, {
    type: "line",

    data: {
      labels: labels,

      datasets: [
        {
          label: "Contribution",

          data: amounts,

          borderColor: "#1f4e79",

          backgroundColor: "rgba(31,78,121,0.08)",

          fill: true,

          tension: 0.4,

          borderWidth: 4,

          pointBackgroundColor: "#28a745",

          pointBorderColor: "#28a745",

          pointRadius: 6,

          pointHoverRadius: 8,

          pointBorderWidth: 2,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      animation: {
        duration: 1500,

        easing: "easeOutQuart",
      },

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          callbacks: {
            label: function (context) {
              return "KES " + context.raw.toLocaleString();
            },
          },
        },
      },

      scales: {
        x: {
          grid: {
            display: false,
          },
        },

        y: {
          beginAtZero: true,

          ticks: {
            callback: function (value) {
              return "KES " + value;
            },
          },
        },
      },
    },
  });
}

// ==========================
// Start
// ==========================

loadContributions();
