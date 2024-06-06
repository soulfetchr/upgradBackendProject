// app/controllers/user.controller.js
const User = require('../models/user.model');
const uuid = require('uuid');
const TokenGenerator = require('uuid-token-generator');

const tokenGenerator = new TokenGenerator();

exports.signUp = (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  const username = `${first_name}_${last_name}`;
  const uuidValue = uuid.v4();
  const accessToken = tokenGenerator.generate();
  
  const user = new User({
    email,
    password,
    username,
    uuid: uuidValue,
    accesstoken: accessToken,
    isLoggedIn: false
  });

  user.save((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User."
      });
    } else {
      res.send(data);
    }
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = hashPassword(password); // Assume you have a hashPassword function

  User.findOne({ username, password: hashedPassword }, (err, user) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while logging in."
      });
    } else if (!user) {
      res.status(404).send({
        message: "Invalid username or password."
      });
    } else {
      // Update user's isLoggedIn status and access token
      const accessToken = tokenGenerator.generate();
      user.accesstoken = accessToken;
      user.isLoggedIn = true;
      user.save((err, updatedUser) => {
        if (err) {
          res.status(500).send({
            message: err.message || "Some error occurred while logging in."
          });
        } else {
          res.send(updatedUser);
        }
      });
    }
  });
};

exports.logout = (req, res) => {
  const { uuid } = req.body;
  User.findOneAndUpdate({ uuid }, { isLoggedIn: false, accesstoken: "" }, { new: true }, (err, user) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while logging out."
      });
    } else {
      res.send(user);
    }
  });
};

exports.getCouponCode = (req, res) => {
  const { userId } = req.params;
  // Assume you have logic to generate a coupon code for the user
  const couponCode = generateCouponCode(); // Implement this function as needed
  User.findById(userId, (err, user) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while fetching user details."
      });
    } else if (!user) {
      res.status(404).send({
        message: "User not found."
      });
    } else {
      // Add the generated coupon code to the user's profile
      user.coupons.push({ code: couponCode });
      user.save((err, updatedUser) => {
        if (err) {
          res.status(500).send({
            message: err.message || "Some error occurred while saving user details."
          });
        } else {
          res.send(updatedUser);
        }
      });
    }
  });
};

exports.bookShow = (req, res) => {
  const { userId, showId, tickets } = req.body;
  // Assume you have logic to book the show for the user
  const bookingRefNumber = generateBookingRefNumber(); // Implement this function as needed
  User.findById(userId, (err, user) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while fetching user details."
      });
    } else if (!user) {
      res.status(404).send({
        message: "User not found."
      });
    } else {
      // Add the booking details to the user's profile
      user.bookingRequests.push({ reference_number: bookingRefNumber, show_id: showId, tickets });
      user.save((err, updatedUser) => {
        if (err) {
          res.status(500).send({
            message: err.message || "Some error occurred while saving user details."
          });
        } else {
          res.send(updatedUser);
        }
      });
    }
  });
};
