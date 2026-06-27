import { supabase } from "./supabase.js";

// Read the meeting ID from the URL
const params = new URLSearchParams(window.location.search);

const meetingId = params.get("id");

// HTML elements
const title = document.getElementById("title");
const meetingDate = document.getElementById("meeting-date");
const location = document.getElementById("location");
const agenda = document.getElementById("agenda");
const minutes = document.getElementById("minutes");

async function loadMeeting() {
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .eq("id", meetingId)
    .single();

  if (error) {
    console.log(error);

    title.textContent = "Meeting not found";

    return;
  }

  title.textContent = data.title;

  meetingDate.textContent = data.meeting_date;

  location.textContent = data.location;

  agenda.textContent = data.agenda;

  minutes.textContent = data.minutes;
}

loadMeeting();
