export async function exportReport(statistics, chartData) {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  // ==========================
  // Header
  // ==========================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("VICTORY IN CHRIST CHURCH", 20, 20);

  doc.setFontSize(15);
  doc.text("Contribution Report", 20, 30);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Generated: " + new Date().toLocaleDateString(), 20, 40);

  doc.line(20, 45, 190, 45);

  // ==========================
  // Statistics
  // ==========================

  let y = 60;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Dashboard Summary", 20, y);

  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(`Total Members: ${statistics.totalMembers}`, 20, y);

  y += 8;

  doc.text(
    `Total Contributions: KES ${statistics.totalContribution.toLocaleString()}`,
    20,
    y,
  );

  y += 8;

  doc.text(
    `Highest Contribution: KES ${statistics.highestContribution.toLocaleString()}`,
    20,
    y,
  );

  y += 8;

  doc.text(`Sundays This Month: ${statistics.totalSundays}`, 20, y);

  y += 8;

  doc.text(
    `Average Per Sunday: KES ${statistics.averagePerSunday.toLocaleString(
      undefined,
      {
        maximumFractionDigits: 2,
      },
    )}`,
    20,
    y,
  );

  y += 8;

  doc.text(`Contributing Members: ${statistics.contributingMembers}`, 20, y);

  y += 8;

  doc.text(
    `Non-Contributing Members: ${statistics.nonContributingMembers}`,
    20,
    y,
  );

  // ==========================
  // Weekly Contributions
  // ==========================

  y += 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Weekly Contributions", 20, y);

  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  chartData.forEach((week) => {
    doc.text(
      `${week.week} .......................... KES ${week.amount.toLocaleString()}`,
      20,
      y,
    );

    y += 8;
  });

  // ==========================
  // Footer
  // ==========================

  y += 15;

  doc.line(20, y, 190, y);

  y += 10;

  doc.setFontSize(10);

  doc.text("Generated automatically by VIC Church Contribution System", 20, y);

  doc.save("Church_Report.pdf");
}
