// ==========================
// ACCORDION
// ==========================

const accordions = document.querySelectorAll(".accordion");

accordions.forEach((accordion) => {
  accordion.addEventListener("click", () => {
    const panel = accordion.nextElementSibling;

    // Close all other panels
    accordions.forEach((item) => {
      if (item !== accordion) {
        item.classList.remove("active");

        const otherPanel = item.nextElementSibling;

        otherPanel.style.maxHeight = null;
        otherPanel.classList.remove("open");
      }
    });

    // Toggle current panel
    accordion.classList.toggle("active");

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
      panel.classList.remove("open");
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
      panel.classList.add("open");
    }
  });
});

// ==========================
// HELP SEARCH
// ==========================

const searchInput = document.getElementById("help-search");

searchInput.addEventListener("keyup", function () {
  const value = this.value.toLowerCase().trim();

  document.querySelectorAll(".help-card").forEach((card) => {
    const title = card.querySelector(".accordion").textContent.toLowerCase();

    const content = card.querySelector(".panel").textContent.toLowerCase();

    const accordion = card.querySelector(".accordion");
    const panel = card.querySelector(".panel");

    if (title.includes(value) || content.includes(value)) {
      card.style.display = "";

      // Automatically open matching sections
      if (value !== "") {
        accordion.classList.add("active");
        panel.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      } else {
        accordion.classList.remove("active");
        panel.classList.remove("open");
        panel.style.maxHeight = null;
      }
    } else {
      card.style.display = "none";
    }
  });
});

// ==========================
// OPEN FIRST SECTION
// ==========================

if (accordions.length > 0) {
  accordions[0].classList.add("active");

  const firstPanel = accordions[0].nextElementSibling;

  firstPanel.classList.add("open");
  firstPanel.style.maxHeight = firstPanel.scrollHeight + "px";
}
