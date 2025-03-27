const ButtonClick = require("../model/buttonClickModel");

// Track a button click
exports.trackButtonClick = async (req, res) => {
  try {
    const { buttonId, username } = req.body;

    // Validate required fields
    if (!buttonId) {
      return res.status(400).json({
        success: false,
        message: "buttonId is required",
      });
    }

    // Create a new button click record
    const buttonClick = new ButtonClick({
      buttonId,
      username: username || "Guest",
      timestamp: new Date(),
    });

    // Save to database
    await buttonClick.save();

    return res.status(201).json({
      success: true,
      message: "Button click tracked successfully",
      data: buttonClick,
    });
  } catch (error) {
    console.error("Error tracking button click:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to track button click",
      error: error.message,
    });
  }
};

// Get all button clicks
exports.getButtonClicks = async (req, res) => {
  try {
    // Get all button clicks, sorted by timestamp (newest first)
    const buttonClicks = await ButtonClick.find()
      .sort({ timestamp: -1 })
      .limit(50); // Limit to most recent 50 clicks

    return res.status(200).json({
      success: true,
      count: buttonClicks.length,
      data: buttonClicks,
    });
  } catch (error) {
    console.error("Error getting button clicks:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get button clicks",
      error: error.message,
    });
  }
};
