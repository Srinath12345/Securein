const cron = require("node-cron");

const axios = require("axios");

// Schedule the job to run every day at 12:00 AM (midnight)
cron.schedule("0 */6 * * *", async () => {
  console.log("Running scheduled task to call the API...");

  try {
    const response = await axios.get("http://localhost:3000/sync"); // Replace with your actual API URL
    console.log("API Response:", response.data);
  } catch (error) {
    console.error("Error calling the API:", error.message);
  }
});
