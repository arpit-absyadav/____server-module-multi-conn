/*
 * @Author: Arpit.Yadav
 * @Date: 2019-02-09 20:45:35
 * @Last Modified by: Arpit.Yadav
 * @Last Modified time: 2019-02-22 14:39:58
 */
var atob = require('atob');
var redis = require('redis');
var redisClient = redis.createClient();

var School = require('./school.service');
var Jwt = require('../../common/helpers/j_w_t/jwt.helper');
var errorParser = require('../../common/helpers/errorParser/error.parser');

/**
 * Create School fn: `Creating school. `
 * @description `req.body will have school data.`
 */
exports.create = async (req, res, next) => {
  try {
    let [err, school] = await School.create(req.body);
    if (!err) {
      let _school = JSON.parse(JSON.stringify(school));
      delete _school.password;
      let _token = await Jwt.create(_school);
      if (_token) {
        _school.token = _token;
      }
      // Note: Send Registration confirmation and otp
      res.success.Created('Successfully Created', _school);
    } else if (err.name === 'ValidationError') {
      res.error.UnprocessableEntity(
        err._message,
        errorParser.parseMongooseError(err.errors)
      );
    }
  } catch (error) {
    next(error);
  }
};

/**
 * School Login Fn: `School Login`
 * @description `req.body will have email and password`
 *
 */
exports.login = async (req, res, next) => {
  // console.log(req.headers);
  try {
    let [err, school] = await School.findByEmail(req.body.email);
    // console.log(err);
    // console.log(school);
    if (!err && school !== null) {
      console.log(school);
      school.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch) {
          // console.log(isMatch);
          let _school = JSON.parse(JSON.stringify(school));
          delete _school.password;
          _school['token'] = Jwt.create(_school);
          res.success.OK('Succesfully Logged in', _school);
        }
        res.error.NotFound('Credentials does not match !!');
      });
    } else {
      res.error.NotFound('Credentials does not match !!');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get School Data Fn: ` Get School Data`
 * @description `req.body will have _id `
 * @summary this funtion will get the data having same `_id` .
 * @reference service
 */
exports.getSchool = async (req, res, next) => {
  console.log(req.params);

  try {
    let [err, school] = await School.findBy_Id(req.params._id);
    console.log(school);

    if (!err) {
      res.success.OK('Successfully got School.', school);
    } else {
      res.error.NotFound('School Data not found.');
    }
  } catch (error) {
    next(error);
  }
};
