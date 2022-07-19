const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please provide name !'],
    minlength: 3,
    maxlength: 50,
  },

  email: {
    type: String,
    unique: true,
    require: [true, 'Please prov ide email !'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
  },

  password: {
    type: String,
    require: [true, 'Please provide password !'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'USER'],
    default: 'USER',
  },
});

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
