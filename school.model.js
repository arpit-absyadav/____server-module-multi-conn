/*
 * @Author: Arpit.Yadav
 * @Date: 2019-02-09 17:51:48
 * @Last Modified by: Arpit.Yadav
 * @Last Modified time: 2019-03-02 13:28:29
 */

const mongoose = require('./../../../config/database/mongoose');
const bcrypt = require('bcrypt');
const config = require('../../../config/env/config');
const handleMongooseError = require('../../common/handlers/mongoose.error.handler');
Schema = mongoose.Schema;
const id = mongoose.Types.ObjectId();

const SchoolSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true
  },
  Id: {
    type: String,
    unique: true,
    default: Math.floor(100000 + Math.random() * 900000)
  },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, default: null },
  isOtpVerified: { type: Boolean, required: true, default: false },
  isActivated: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now, required: true }
});

/**
 * Generate hash of password before saving
 */
SchoolSchema.pre('save', function(next) {
  bcrypt.genSalt(config.saltRounds, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (!err) {
        this.password = hash;
        next();
      } else next(new Error('Error while hashin password.'));
    });
  });
});

/**
 *  Compare password
 * @function comparePassword : `This funtion will compare given password`
 * @param {String} inputPassword : `Password which has passed as input`
 * @return {} cb : `Will return the true and false`
 */
SchoolSchema.methods.comparePassword = function(inputPassword, cb) {
  bcrypt.compare(inputPassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
SchoolSchema.plugin(handleMongooseError);
exports.School = mongoose.flex.model('School', SchoolSchema);
