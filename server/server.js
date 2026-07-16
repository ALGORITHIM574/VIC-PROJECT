import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();
console.log("SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("PHONE:", process.env.TWILIO_PHONE_NUMBER);
console.log("TOKEN:", process.env.TWILIO_AUTH_TOKEN ? "Loaded" : "Missing");

const app = express();

app.use(cors());
app.use(express.json());

// ===============================
// Twilio Client
// ===============================

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

// ===============================
// Home Route
// ===============================

app.get("/", (req, res) => {
  res.send("Church Contribution Backend Running");
});

// ===============================
// Send SMS Route
// ===============================

app.post("/send-sms", async (req, res) => {
  const { phone, message } = req.body;

  // Validation
  if (!phone || !message) {
    return res.status(400).json({
      success: false,
      message: "Phone number and message are required.",
    });
  }

  try {
    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    res.json({
      success: true,
      message: "SMS Sent Successfully",
      sid: sms.sid,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
      code: error.code,
      moreInfo: error.moreInfo,
    });
  }
});

// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
