const mongoose = require("mongoose");

const buttonClickSchema = new mongoose.Schema({
  buttonId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    default: "guest",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ButtonClick", buttonClickSchema);
