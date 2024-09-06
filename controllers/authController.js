import Joi from "joi";
import { apiResponseCode } from "../routes/helper.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config.js";

const registration = async (req, res) => {
  const registerSchema = Joi.object({
    firstName: Joi.string().required(),
    email: Joi.string().email().required(),
    lastName: Joi.string().required(),
    userName: Joi.string().required(),
    password: Joi.string().min(8).required(),
  });
  try {
    // Validate User request
    // console.log("Hiiii");
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        response: apiResponseCode.BAD_REQUEST,
        responseMessage: error.details[0].message,
        data: null,
      });
    }

    // destructive fields/values from the request body
    const { firstName, email, lastName, userName, password } = req.body;

    // Checks if user already exists
    let user = await User.findOne({ email: email });
    // console.log(user);
    // console.log(user.email);
    if (user) {
      return res.status(400).json({
        response: apiResponseCode.BAD_REQUEST,
        responseMessage: `${email} already exists! `,
        data: null,
      });
    }

    // Hashing password before saving
    const hashPassword = await bcrypt.hash(password, 10);

    // Create the information as a new user
    user = new User({
      firstName,
      email,
      lastName, //second method if name is identical
      userName,
      password: hashPassword,
    });

    // save user to database
    await user.save();

    res.status(201).json({
      response: apiResponseCode.SUCCESSFUL,
      responseMessage: `${email} registered succefully`,
      data: {
        firstName,
        email,
        lastName,
        userName,
      },
    });

    // end
  } catch (error) {
    console.error(error);
    res.status(500).json({
      response: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error",
      data: null,
    });
  }
};

const login = async (req, res) => {
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  try {
    // collect the request body and test
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        response: apiResponseCode.BAD_REQUEST,
        responseMessage: error.details[0].message,
        data: null,
      });
    }

    // console.log("no error");
    // collect request data if no error
    const { email, password } = req.body;

    // const user = await User.findOne({ email: email });
    let user = await User.findOne({ email: email });

    // console.log(user);

    if (!user) {
      return res.status(400).json({
        response: apiResponseCode.BAD_REQUEST,
        responseMessage: "Invalid Credentials",
        data: null,
      });
    }

    // check if password matches password on file
    // const hashPassword = await bcrypt.hash(password, 10);
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        response: apiResponseCode.BAD_REQUEST,
        responseMessage: `Invalid Credentials`,
      });
    }

    // create/sign token to access protected routes and terminate toke in specified time
    const token = await jwt.sign(
      { id: user._id, email: user.email },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    // response if everything goes well and token generated
    res.status(200).json({
      response: apiResponseCode.SUCCESSFUL,
      responseMessage: `${email} login succefully`,
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userName: user.userName,
        token,
      },
    });

    // end
  } catch (error) {
    console.log(error);
    res.status(500).json({
      response: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error",
      data: null,
    });
  }
};

export { registration, login };
