# Zakie Trader Chrome Monitor

## Requirements
- Zakie Trader server running on this Windows computer at http://localhost:3000.
- Google Chrome and the IQ Option chart open in the same Chrome profile.
- The backend must have a valid OPENAI_API_KEY configured. OpenAI API usage is billed separately.

## Install
1. Download or clone the Zakie Trader repository and run `npm install` then `npm start` in its folder.
2. Open `chrome://extensions` in Chrome and enable **Developer mode**.
3. Choose **Load unpacked** and select this `chrome-monitor` folder.
4. Pin the Zakie Trader Monitor extension if desired.
5. Open IQ Option, select the chart tab, click the extension, then click **START MONITOR**.
6. Keep that IQ Option tab in front. It captures the visible tab every 30 seconds and sends it to the local server. Click **STOP MONITOR** to stop.

## Safety and limits
- The extension captures only the active IQ Option tab after you click Start. It pauses if another tab becomes active.
- It does not read passwords, cookies, account credentials, or place trades.
- Analysis is only as good as the visible chart. Use demo mode and confirm every decision manually.
- This prototype needs the local server running and the IQ Option tab visible. It is not a hidden background screen recorder.
