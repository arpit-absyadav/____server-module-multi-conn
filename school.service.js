/*
 * @Author: Arpit.Yadav
 * @Date: 2019-02-09 20:46:13
 * @Last Modified by: Arpit.Yadav
 * @Last Modified time: 2019-03-02 13:29:01
 */

const { School } = require('./school.model');
const handleMongooseError = require('../../common/handlers/mongoose.error.handler');

/**
 * @function : `Create  School Fn`
 * @description : `Will return result as array`
 */
exports.create = school => {
  try {
    const _school = new School(school);
    return new Promise((resolve, reject) => {
      _school
        .save()
        .then(result => {
          resolve([false, result]);
        })
        .catch(err => {
          console.error(err);
          resolve([err, false]);
        });
    });
  } catch (error) {
    return error;
  }
};

/**
 * @function : `Get School Fn`
 * @description : `Will return result as array`
 *
 * @param { string } email : `will have email `
 */
exports.findByEmail = email => {
  try {
    return new Promise((resolve, reject) => {
      School.findOne({ email: email, isActivated: true })
        .then(_school => resolve([false, _school]))
        .catch(err => resolve([err, false]));
    });
  } catch (error) {
    return error;
  }
};

/**
 * @function : `Find by id School Fn`
 * @description : `This will get the result matching with id.`
 *
 * @param { string } _id : _id is the unique id created by mongodb itself. Using this the data can be identfied.
 *
 */
exports.findBy_Id = _id => {
  try {
    return new Promise((resolve, reject) => {
      School.findOne({ _id: _id, isActivated: true })
        .then(_school => resolve([false, _school]))
        .catch(err => resolve([err, false]));
    });
  } catch (error) {
    return error;
  }
};

/**
 * @function : `Update School Fn`
 * @description : `This will update the document.`
 *
 * @param { string } _id : _id is the unique id created by mongodb itself. Using this the data can be identfied.
 * @param { object } data : data is a object with existing collection keys and values eg:`{ isActivated: true } `
 */
exports.update = (_id, data) => {
  try {
    return new Promise((resolve, reject) => {
      School.where({ _id: _id })
        .update({ $set: data })
        .then(_school => resolve([false, _school]))
        .catch(err => resolve([err, false]));
    });
  } catch (error) {
    return error;
  }
};
