import { supabase } from "./supabase.js";

// ==========================
// Chart Variables
// ==========================

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

let myChart;
let chartData = [];

// ==========================
// Dashboard Starts Here
// ==========================

async function loadDashboard() {
  const contributions = await loadReport();

  await loadStatistics(contributions);
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
  // ==========================
  // Total Members
  // ==========================

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
