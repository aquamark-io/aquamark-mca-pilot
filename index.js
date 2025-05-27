const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb, degrees } = require("pdf-lib");
const fetch = require("node-fetch");
const { createClient } = require("@supabase/supabase-js");
const QRCode = require("qrcode");

const app = express();
const PORT = process.env.PORT || 10000;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const TABLE_NAME = process.env.TABLE_NAME || "mca_pilot_users";
const API_KEY = process.env.GLOBAL_API_KEY || "mca-pilot-19645014";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(cors());
app.use(fileUpload());

app.post("/watermark", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const userId = req.headers["user-id"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Missing or invalid authorization token.");
  }

  const token = authHeader.split(" ")[1];
  if (token !== API_KEY) {
    return res.status(401).send("Invalid API key.");
  }

  if (!userId) {
    return res.status(400).send("Missing user-id header.");
  }

  // ✅ Partner-specific user check
  const { data: validUser, error: userError } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("user_id", userId)
    .single();

  if (userError || !validUser) {
    return res.status(403).send("Unauthorized user_id.");
  }

  if (!req.files || !req.files.file || !req.body.user_email) {
    return res.status(400).send("Missing file or user_email");
  }

  // 🔧 Rest of your processing logic (unchanged) goes here...

  res.status(200).send("✅ Placeholder: MCA Pilot processing successful.");
});

app.listen(PORT, () => {
  console.log(`🚀 MCA Pilot server running on port ${PORT}`);
});
