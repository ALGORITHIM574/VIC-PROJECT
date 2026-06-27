import { supabase } from "./supabase.js";

const meetingsList = document.getElementById("meetings-list");

const totalMeetings = document.getElementById("total-meetings");
const upcomingMeetings = document.getElementById("upcoming-meetings");
const minutesUploaded = document.getElementById("minutes-uploaded");

const searchInput = document.getElementById("search");

let allMeetings = [];

// =========================================
// Determine Meeting Status
// =========================================

function getMeetingStatus(meetingDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const meeting = new Date(meetingDate);
  meeting.setHours(0, 0, 0, 0);

  if (meeting > today) return "Upcoming";

  if (meeting.getTime() === today.getTime()) return "Today";

  return "Completed";
}

// =========================================
// Render Meeting Cards
// =========================================

function renderMeetings(meetings) {
  meetingsList.innerHTML = "";

  if (meetings.length === 0) {
    meetingsList.innerHTML = `
      <h2 style="text-align:center; margin-top:40px;">
        No meetings found.
      </h2>
    `;
    return;
  }

  meetings.forEach((meeting) => {
    const status = getMeetingStatus(meeting.meeting_date);

    let statusClass = "";

    if (status === "Upcoming") {
      statusClass = "upcoming";
    } else if (status === "Today") {
      statusClass = "today";
    } else {
      statusClass = "completed";
    }

    meetingsList.innerHTML += `
      <div class="meeting-card">

        <div class="card-header">

          <div>
            <h2>${meeting.title}</h2>

       <span class="status ${statusClass}">
  ${status}
</span>
          </div>

          <div class="date">
            <i class="fa-solid fa-calendar"></i>
            ${meeting.meeting_date}
          </div>

        </div>

        <div class="meeting-content">

          <h4>Agenda</h4>

          <p>${meeting.agenda || "No agenda provided"}</p>

          <h4 style="margin-top:15px;">Minutes</h4>

          <p>${meeting.minutes || "No minutes uploaded"}</p>

          <h4 style="margin-top:15px;">Location</h4>

          <p>${meeting.location || "No location provided"}</p>

        </div>

        <div class="meeting-footer">

          <button
            class="view-btn"
            onclick="window.location.href='view-meeting.html?id=${meeting.id}'"
          >
            <i class="fa-solid fa-eye"></i>
            View
          </button>

          <button
            class="edit-btn"
            onclick="window.location.href='edit-meeting.html?id=${meeting.id}'"
          >
            <i class="fa-solid fa-pen"></i>
            Edit
          </button>

          <button
            class="delete-btn"
            onclick="deleteMeeting(${meeting.id})"
          >
            <i class="fa-solid fa-trash"></i>
            Delete
          </button>

        </div>

      </div>
    `;
  });
}

// =========================================
// Delete Meeting
// =========================================

async function deleteMeeting(id) {
  const confirmed = confirm("Are you sure you want to delete this meeting?");

  if (!confirmed) return;

  const { error } = await supabase.from("meetings").delete().eq("id", id);

  if (error) {
    console.log(error);
    alert("Failed to delete meeting");
    return;
  }

  alert("Meeting deleted successfully");

  loadMeetings();
}

// =========================================
// Load Meetings
// =========================================

async function loadMeetings() {
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .order("meeting_date", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  allMeetings = data;

  totalMeetings.textContent = allMeetings.length;

  let upcoming = 0;
  let minutes = 0;

  allMeetings.forEach((meeting) => {
    const status = getMeetingStatus(meeting.meeting_date);

    if (status === "Upcoming") {
      upcoming++;
    }

    if (meeting.minutes && meeting.minutes.trim() !== "") {
      minutes++;
    }
  });

  upcomingMeetings.textContent = upcoming;
  minutesUploaded.textContent = minutes;

  renderMeetings(allMeetings);
}

// =========================================
// Live Search
// =========================================

searchInput.addEventListener("input", () => {
  const search = searchInput.value.toLowerCase();

  const filteredMeetings = allMeetings.filter((meeting) => {
    return (
      meeting.title.toLowerCase().includes(search) ||
      (meeting.location || "").toLowerCase().includes(search) ||
      (meeting.agenda || "").toLowerCase().includes(search)
    );
  });

  renderMeetings(filteredMeetings);
});

// =========================================

loadMeetings();

window.deleteMeeting = deleteMeeting;
