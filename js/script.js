// CONTRIBUTION MODAL
const BTN = document.querySelector("#btn");
const modal = document.querySelector("#modal");

if (BTN && modal) {
  BTN.addEventListener("click", function () {
    console.log("contribution added"); //for debugging
    modal.style.display = "block";
  });
}
// SEARCH MEMBERS
const search = document.querySelector("#search-member");

if (search) {
  search.addEventListener("keyup", function (e) {
    const term = e.target.value.toLowerCase();

    const tbody = document.querySelector("tbody");

    if (!tbody) return;

    const rows = tbody.getElementsByTagName("tr");

    Array.from(rows).forEach(function (row) {
      const name = row.children[1].textContent.toLowerCase();

      if (name.includes(term)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
}
// CLOSE CONTRIBUTION MODAL
const saveBtn = document.querySelector("#save");

if (saveBtn && modal) {
  saveBtn.addEventListener("click", function () {
    console.log("saved"); //for debugging
    modal.style.display = "none";
  });
}

// MEMBER MODAL

const memberBtn = document.querySelector("#btn-2");
const modal2 = document.querySelector("#modal-2");
const overlay = document.querySelector("#overlay");

if (memberBtn && modal2) {
  memberBtn.addEventListener("click", function () {
    console.log("member added"); //for debugging
    modal2.style.display = "block";
    if (overlay) {
      overlay.style.display = "block";
    }
  });
}
const saveBtn2 = document.querySelector("#btn-2");

if (saveBtn2 && modal2) {
  saveBtn.addEventListener("click", function () {
    console.log("saved"); //for debugging
    modal2.style.display = "none";
  });
}
// const ctx = document.getElementById("myChart");

// new Chart(ctx, {
//   type: "bar",
//   data: {
//     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
//     datasets: [
//       {
//         label: "# of Votes",
//         data: [12, 19, 3, 5, 2, 3],
//         borderWidth: 1,
//       },
//     ],
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   },
// });
