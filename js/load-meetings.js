import { supabase } from "./supabase.js";

const meetingsList = document.getElementById("meetings-list");

async function loadMeetings() {
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .order("meeting_date", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  meetingsList.innerHTML = "";

  data.forEach((meeting) => {
    meetingsList.innerHTML += `
      <div class="meeting-card">

        <div class="card-header">
          <div>
            <h2>${meeting.title}</h2>
            <span class="status">Meeting</span>
          </div>

          <div class="date">
            <i class="fa-solid fa-calendar"></i>
            ${meeting.meeting_date}
          </div>
        </div>

        <div class="meeting-content">
          <h4>Agenda</h4>

          <p>${meeting.agenda}</p>

          <h4 style="margin-top:15px;">Minutes</h4>

          <p>${meeting.minutes}</p>

          <h4 style="margin-top:15px;">Location</h4>

          <p>${meeting.location}</p>
        </div>

        <div class="meeting-footer">

          <button class="view-btn">
            <i class="fa-solid fa-eye"></i>
            View
          </button>

          <button class="edit-btn">
            <i class="fa-solid fa-pen"></i>
            Edit
          </button>

          <button class="delete-btn">
            <i class="fa-solid fa-trash"></i>
            Delete
          </button>

        </div>

      </div>
    `;
  });
}

loadMeetings();
