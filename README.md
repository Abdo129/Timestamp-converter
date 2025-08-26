# 🕒 Timestamp Converter

Easily convert UTC timestamps into **your local timezone** and log the outputs automatically.

------------------------------------------------------------------------

## 📦 Installation

1.  Clone the project:

    ``` bash
    git clone https://github.com/yourusername/timestamp-converter.git
    cd timestamp-converter
    ```

2.  Install dependencies:

    ``` bash
    npm install
    ```

------------------------------------------------------------------------

## ▶️ Usage

You can provide timestamps in two ways:

### 1. CLI Argument (Preferred)

``` bash
node index.js "2025-08-23T20:28:20.213Z"
```

### 2. From JSON File

Create a file named `timestamps.json` in the project root:

``` json
{
  "timestamp": "2025-08-23T20:28:20.213Z"
}
```

Run the script:

``` bash
node index.js
```

⚡ **Note:** If both a CLI timestamp and a JSON timestamp exist, the CLI
timestamp will be used.

------------------------------------------------------------------------

## 📝 Output Example
```
   Logged entry: {
  "id": "1729473600000-1b9d6b00-1234-5678-9abc-def123456789",
  "utc": "2025-08-23T20:28:20.213Z",
  "timezone": "America/New_York (Your current local time zone)",
  "time_12h": "August 23, 2025, 04:28:20 PM",
  "time_24h": "23 August 2025, 16:28:20",
  "logged_at": "2025-08-23T20:28:20.213Z"
}
```
------------------------------------------------------------------------

## 📂 Logs

Every run is saved into a **logs/** folder with a unique file name
(e.g., `logs/20250823-abc123.log`).\
This helps you keep history clean and organized.

------------------------------------------------------------------------

## 🌍 Timezone Behavior

-   The script converts UTC timestamps into **your system's local
    timezone**.\
-   If your system's timezone **cannot be detected**, the script will
    **fall back to UTC (Greenwich Mean Time)**.

------------------------------------------------------------------------

## ✅ Features

-   Convert **UTC → Local Timezone**
-   Supports both **12h (AM/PM)** and **24h formats**
-   Works with CLI or `.json` input
-   Auto-logs history into `/logs`
-   Graceful fallback to **UTC** if system timezone unavailable

------------------------------------------------------------------------

## 🛠 Requirements

-   Node.js 16+
-   npm
-   Library: [`uuid`](https://www.npmjs.com/package/uuid)

Install `uuid`:

``` bash
npm install uuid
```

------------------------------------------------------------------------

## 🎯 Example Repo Structure

    timestamp-converter/
    │── index.js
    │── timestamps.json
    │── logs/
    │── package.json
    │── USER_GUIDE.md

------------------------------------------------------------------------

Enjoy converting timestamps hassle-free 🚀
