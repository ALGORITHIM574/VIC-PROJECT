import { supabase } from "./supabase.js";
import { exportReport } from "./export.js";

const exportButton = document.getElementById("export-report");
const ctx = document.getElementById("myChart");
const totalMonth = document.getElementById("total-month");
const totalMembers = document.getElementById("total-members");
const totalSundays = document.getElementById("total-sundays");
const highestContribution = document.getElementById("highest-contribution");
const summaryTotal = document.getElementById("summary-total");
const summaryAverage = document.getElementById("summary-average");
const summaryContributors = document.getElementById("summary-contributors");
const summaryNonContributors = document.getElementById(
  "summary-noncontributors",
);
const reportTableBody = document.getElementById("report-table-body");

let myChart;
let chartData = [];
let statistics = {};

// ==========================
// Dashboard Starts Here
// ==========================

async function loadDashboard() {
  const contributions = await loadReport();

  await loadStatistics(contributions);
  buildReportTable(contributions);
}

loadDashboard();

// ==========================
// Load Report Data
// ==========================
async function loadReport() {
  const { data, error } = await supabase
    .from("contributions")
    .select("*")
    .order("contribution_date", { ascending: true });

  if (error) {
    console.log(error);
    return [];
  }

  chartData = processContributionData(data);

  createChart(chartData, "bar");

  return data;
}
async function loadStatistics(contributions) {
  const { data: members, error } = await supabase.from("members").select("id");

  if (error) {
    console.log(error);
    totalMembers.textContent = 0;
  } else {
    totalMembers.textContent = members.length;
  }

  // ==========================
  // Total This Month
  // ==========================

  let total = 0;

  contributions.forEach((c) => {
    total += Number(c.amount);
  });

  totalMonth.textContent = "KES " + total.toLocaleString();

  // ==========================
  // Highest Contribution
  // ==========================

  let highest = 0;

  contributions.forEach((c) => {
    if (Number(c.amount) > highest) {
      highest = Number(c.amount);
    }
  });

  highestContribution.textContent = "KES " + highest.toLocaleString();

  // ==========================
  // Sundays This Month
  // ==========================

  const uniqueDates = new Set();

  contributions.forEach((c) => {
    uniqueDates.add(c.contribution_date);
  });

  totalSundays.textContent = uniqueDates.size;
  // ==========================
  // Contribution Summary
  // ==========================

  // Total Contributions
  summaryTotal.textContent = "KES " + total.toLocaleString();

  // Average Per Sunday
  const average = uniqueDates.size > 0 ? total / uniqueDates.size : 0;

  summaryAverage.textContent =
    "KES " +
    average.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });

  // Contributing Members
  const uniqueMembers = new Set();

  contributions.forEach((c) => {
    uniqueMembers.add(c.member_id);
  });

  summaryContributors.textContent = uniqueMembers.size;

  // Non-Contributing Members
  summaryNonContributors.textContent = members.length - uniqueMembers.size;
  //MAKE THE VALUES GLOBEL
  statistics = {
    totalMembers: members.length,

    totalContribution: total,

    highestContribution: highest,

    totalSundays: uniqueDates.size,

    averagePerSunday: average,

    contributingMembers: uniqueMembers.size,

    nonContributingMembers: members.length - uniqueMembers.size,
  };
}
function buildReportTable(contributions) {
  const grouped = {};

  contributions.forEach((c) => {
    const date = new Date(c.contribution_date);

    const week = `Week ${Math.ceil(date.getDate() / 7)}`;

    if (!grouped[week]) {
      grouped[week] = {
        total: 0,
        contributors: new Set(),
        date: c.contribution_date,
      };
    }

    grouped[week].total += Number(c.amount);

    grouped[week].contributors.add(c.member_id);
  });

  reportTableBody.innerHTML = "";

  Object.keys(grouped).forEach((week) => {
    const row = grouped[week];

    const average = row.total / row.contributors.size;

    reportTableBody.innerHTML += `

        <tr>

            <td>${week}</td>

            <td>${row.date}</td>

            <td>KES ${row.total.toLocaleString()}</td>

            <td>${row.contributors.size}</td>

            <td>KES ${average.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}</td>

        </tr>

        `;
  });
}
// ==========================
// Convert Contributions into Weekly Totals
// ==========================

function processContributionData(data) {
  const grouped = {};

  data.forEach((contribution) => {
    const date = new Date(contribution.contribution_date);

    const week = `Week ${Math.ceil(date.getDate() / 7)}`;

    if (!grouped[week]) {
      grouped[week] = 0;
    }

    grouped[week] += Number(contribution.amount);
  });

  return Object.keys(grouped).map((week) => ({
    week,
    amount: grouped[week],
  }));
}

// ==========================
// Change Chart Type
// ==========================

window.setChartType = function (chartType) {
  if (myChart) {
    myChart.destroy();
  }

  createChart(chartData, chartType);
};

// ==========================
// Build Chart
// ==========================

function createChart(data, type) {
  myChart = new Chart(ctx, {
    type: type,

    data: {
      labels: data.map((row) => row.week),

      datasets: [
        {
          label: "Weekly Contributions",

          data: data.map((row) => row.amount),

          borderWidth: 2,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      scales:
        type === "bar" || type === "line"
          ? {
              y: {
                beginAtZero: true,
              },
            }
          : {},
    },
  });
}
exportButton.addEventListener("click", () => {
  exportReport(statistics, chartData);
});
