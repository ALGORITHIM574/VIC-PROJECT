import { supabase } from "./supabase.js";
//tests
console.log("meetings.js loaded");
const {
  data: { user },
} = await supabase.auth.getUser();

console.log(user);

const form = document.querySelector("form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("meeting-title").value.trim();

    const meetingDate = document.getElementById("meeting-date").value;

    const location = document.getElementById("meeting-location").value.trim();

    const agenda = document.getElementById("meeting-agenda").value.trim();

    const minutes = document.getElementById("meeting-minutes").value.trim();

    console.log({
      title,
      meetingDate,
      location,
      agenda,
      minutes,
    });
    //STATUS200
    const { data, error } = await supabase
      .from("meetings")
      .insert([
        {
          title: title,
          meeting_date: meetingDate,
          location: location,
          agenda: agenda,
          minutes: minutes,
        },
      ])
      .select();

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      alert("Failed to save meeting");
      return;
    }

    alert("Meeting saved successfully");

    window.location.href = "meetings.html";
  });
}
