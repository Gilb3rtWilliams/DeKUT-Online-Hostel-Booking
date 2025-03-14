const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    validate: {
      validator: function (email) {
        if (this.role === "student") {
          return email.endsWith("@students.dkut.ac.ke");
        } else if (this.role === "admin") {
          return email.endsWith("@dkut.ac.ke");
        }
        return false;
      },
      message: (props) => `${props.value} is not a valid email for this role.`,
    },
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
  },
  role: { 
    type: String, 
    enum: ["student", "admin"], 
    default: "student"  // Default role is student
  },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", UserSchema);
