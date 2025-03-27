const ButtonClick = require("../model/buttonClick");

// Track a button click
const trackButtonClick = async (req, res) => {
  try {
    const { buttonId, username } = req.body;

    // Create a new button click record
    const newButtonClick = new ButtonClick({
      buttonId,
      username: username || "guest",
      timestamp: new Date(),
    });

    // Save to database
    await newButtonClick.save();

    res.status(201).json({
      success: true,
      message: "Button click tracked successfully",
      data: newButtonClick,
    });
  } catch (error) {
    console.error("Error tracking button click:", error);
    res.status(500).json({
      success: false,
      message: "Failed to track button click",
      error: error.message,
    });
  }
};

// Get all button clicks
const getButtonClicks = async (req, res) => {
  try {
    // Get all button clicks, sorted by timestamp (newest first)
    const buttonClicks = await ButtonClick.find()
      .sort({ timestamp: -1 })
      .limit(50); // Limit to 50 most recent clicks

    res.status(200).json(buttonClicks);
  } catch (error) {
    console.error("Error getting button clicks:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get button clicks",
      error: error.message,
    });
  }
};

module.exports = {
  trackButtonClick,
  getButtonClicks,
};
