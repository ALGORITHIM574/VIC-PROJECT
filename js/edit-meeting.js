import { supabase } from "./supabase.js";

// -------------------------
// Read Meeting ID
// -------------------------

const params = new URLSearchParams(window.location.search);
const meetingId = params.get("id");

// -------------------------
// Form Inputs
// -------------------------

const form = document.querySelector("form");

const title = document.getElementById("meeting-title");
const meetingDate = document.getElementById("meeting-date");
const location = document.getElementById("meeting-location");
const agenda = document.getElementById("meeting-agenda");
const minutes = document.getElementById("meeting-minutes");

// -------------------------
// Load Existing Meeting
// -------------------------

async function loadMeeting() {
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .eq("id", meetingId)
    .single();

  if (error) {
    console.log(error);
    alert("Meeting not found");
    return;
  }

  title.value = data.title;
  meetingDate.value = data.meeting_date;
  location.value = data.location;
  agenda.value = data.agenda;
  minutes.value = data.minutes;
}

loadMeeting();

// -------------------------
// Update Meeting
// -------------------------

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const { error } = await supabase
    .from("meetings")
    .update({
      title: title.value,
      meeting_date: meetingDate.value,
      location: location.value,
      agenda: agenda.value,
      minutes: minutes.value,
    })
    .eq("id", meetingId);

  if (error) {
    console.log(error);
    alert("Failed to update meeting");
    return;
  }

  alert("Meeting updated successfully");

  window.location.href = "meetings.html";
});
