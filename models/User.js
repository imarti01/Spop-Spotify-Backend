const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: false,
  },

  role: {
    type: String,
    required: false,
  },

  img: {
    secure_url: { type: String, required: false, default: "" },
    public_id: { type: String, required: false, default: "" },
  },
});

module.exports = model("User", userSchema);
