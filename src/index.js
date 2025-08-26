#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// ---------------- CONFIG ----------------
const LOG_DIR = path.join(__dirname, "logs");
const LOG_FILE = path.join(LOG_DIR, "history.log");
const LOG_SIZE_LIMIT = 1024 * 50; // 50 KB (rotate if bigger)
const TIMESTAMP_FILE = path.join(__dirname, "timestamps.json"); // fallback input
const detectedTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
const DEFAULT_TZ = detectedTZ || "UTC";

// ----------------------------------------

// Ensure log directory exists
try {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
} catch (err) {
  console.error("❌ Error creating log directory:", err.message);
  process.exit(1);
}

function convertTimestamp(utcTimestamp, tz = DEFAULT_TZ) {
  try {
    const date = new Date(utcTimestamp);
    
    if (isNaN(date.getTime())) {
      throw new Error("Invalid timestamp format");
    }

    // 12-hour format
    const format12 = date.toLocaleString("en-US", {
      timeZone: tz,
      hour12: true,
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    // 24-hour format
    const format24 = date.toLocaleString("en-GB", {
      timeZone: tz,
      hour12: false,
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    return { format12, format24, tz };
  } catch (err) {
    console.error("❌ Error converting timestamp:", err.message);
    process.exit(1);
  }
}

function ensureLogFileHeader() {
  try {
    if (!fs.existsSync(LOG_FILE)) {
      fs.writeFileSync(LOG_FILE, "==== TIMESTAMP CONVERSION LOG ====\n\n");
    }
  } catch (err) {
    console.error("❌ Error creating log file:", err.message);
    process.exit(1);
  }
}

function logConversion(utcTimestamp, tz = DEFAULT_TZ) {
  try {
    const conversion = convertTimestamp(utcTimestamp, tz);
    const uniqueId = `${Date.now()}-${uuidv4()}`;

    const entry = {
      id: uniqueId,
      utc: utcTimestamp,
      timezone: `${tz} (Your current local time zone)`,
      time_12h: conversion.format12,
      time_24h: conversion.format24,
      logged_at: new Date().toISOString()
    };

    // Rotate log if too big
    if (fs.existsSync(LOG_FILE)) {
      const stats = fs.statSync(LOG_FILE);
      if (stats.size > LOG_SIZE_LIMIT) {
        const rotated = path.join(LOG_DIR, `history-${Date.now()}.log`);
        fs.renameSync(LOG_FILE, rotated);
        console.log(`Log rotated → ${rotated}`);
      }
    }

    // Ensure header exists at top of log
    ensureLogFileHeader();

    // Append entry in PRETTY JSON with divider
    fs.appendFileSync(LOG_FILE, JSON.stringify(entry, null, 2) + "\n---\n\n");

    console.log("Logged entry:", entry);
  } catch (err) {
    console.error("❌ Error logging conversion:", err.message);
    process.exit(1);
  }
}

// ---------------- CLI + JSON Handling ----------------
try {
  const cliArg = process.argv[2];

  if (cliArg) {
    // CLI input preferred
    logConversion(cliArg, DEFAULT_TZ);
  } else if (fs.existsSync(TIMESTAMP_FILE)) {
    // Fallback to JSON file
    const raw = fs.readFileSync(TIMESTAMP_FILE, "utf-8");
    const data = JSON.parse(raw);

    if (Array.isArray(data.timestamps)) {
      data.timestamps.forEach(ts => logConversion(ts, DEFAULT_TZ));
    } else {
      console.error("❌ Invalid format in timestamps.json. Use { \"timestamps\": [ ... ] }");
      process.exit(1);
    }
  } else {
    console.error("❌ No timestamp provided. Use CLI arg or timestamps.json.");
    process.exit(1);
  }
} catch (err) {
  console.error("❌ Unexpected error:", err.message);
  process.exit(1);
}