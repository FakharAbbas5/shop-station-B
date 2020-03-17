const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = mongoose.Schema(
  {
    UserName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(value) {
        if (value.length < 2) {
          throw new Error("Please Enter Valid UserName");
        }
      }
    },
    Password: {
      type: String,
      required: true,
      trim: true
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

UserSchema.methods.toJSON = function(req, res, next) {
  const user = this;
  const userObject = user.toObject();
  delete userObject.tokens;
  delete userObject.Password;
  return userObject;
};

UserSchema.methods.generateAuthToken = async function(next) {
  const user = this;

  const token = await jwt.sign(
    { _id: user._id.toString() },
    "thisisshopstation"
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

UserSchema.pre("save", async function(next) {
  const user = this;
  if (user.isModified("Password")) {
    user.Password = await bcrypt.hash(user.Password, 8);
  }
});

UserSchema.statics.findUserByCredentials = async (UserName, Password) => {
  const user = await User.findOne({ UserName: UserName });

  if (!user) {
    throw new Error("Unable to Login");
  }
  const isValidPassword = await bcrypt.compare(Password, user.Password);
  //   console.log(isValidPassword);
  if (!isValidPassword) {
    throw new Error("Unable to Login");
  }
  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
