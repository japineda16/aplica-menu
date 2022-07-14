/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const joi = require('joi');
const bcrypt = require('bcrypt');
const AuthenticationService = require('../services/AuthenticationService');
const saltRounds = 10;

module.exports = {

  signUp: async function (req, res) {
    try {
      const schema = joi.object().keys({
        email: joi.string().required().email().lowercase(),
        password: joi.string().required(),
        role: joi.string().required(),
        name: joi.string().required()
      });
      const query = schema.validate(req.allParams());

      const hashedPass = await bcrypt.hash(query.value.password, saltRounds);

      const user = await Users.create({
        email: query.value.email,
        password: hashedPass,
        role: query.value.role,
        name: query.value.name
      }).fetch()
        .intercept('E_UNIQUE', (e) => {
          return 'InvalidEmail, Already in use';
        }).intercept({name: 'UsageError'}, (e) => {
          return 'invalid';
        });

      return res.ok({
        response: 'Successfully response',
        return: user
      }).json();
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.badRequest({err}).json();
      }
      return res.serverError({err}).json();
    }
  },

  login: async function (req, res) {
    try {
      let schema = joi.object().keys({
        email: joi.string().required().email().lowercase(),
        password: joi.string().required()
      });
      const query = await schema.validate(req.allParams());

      const user = await Users.findOne({email: query.value.email});

      if (!user) {
        return res.notFound({err: 'User not found'});
      }

      const compare = await bcrypt.compare(query.value.password, user.password);

      const token = AuthenticationService.JWTIssuer({user: user.id}, '1 years');

      return compare ? res.ok({user, token: token}) : res.badRequest({err: 'Unauthorized'});

    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.badRequest({err}).json();
      }
      return res.serverError({err}).json();
    }
  },

  allUsers: async function (req, res) {

    try {
      const users = await Users.find({}).populate('routes', {
        limit: 15
      }).intercept({name: 'UsageError'}, (e) => {
        return 'invalid';
      });

      return res.ok({
        response: 'Successfully created',
        users: users
      });
    } catch (e) {
      console.log(e);
    }

  },

  loginForApiKeys: async function (req, res) {
    try {
      const schema = joi.object().keys({
        email: joi.string().required().email(),
        password: joi.string().required()
      });
      const query = await schema.validate(req.allParams());

      const user = await Users.findOne({email: query.value.email});

      if (!user) {
        return res.notFound({err: 'User not found'});
      }

      const compare = await bcrypt.compare(query.value.password, user.password);

      const token = AuthenticationService.JWTIssuer({user: user.id}, '99999 years');

      return compare ? res.ok({user, token: token}) : res.badRequest({err: 'Unauthorized'});

    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.badRequest({err}).json();
      }
      return res.serverError({err}).json();
    }
  },

  validateSession: async (req, res) => {
    try {
      if (!req.headers || !req.headers.authorization) {
        return res.badRequest({err: 'There is not headers'});
      }
      const auth = req.headers.authorization;
      const validate = await AuthenticationService.JWTVerify(auth);
      const user = await Users.findOne({id: validate.user});

      if (!user) {
        return res.badRequest({err: 'Unauthorized'});
      }

      res.ok({user: user});
    } catch (e) {
      return res.badRequest(e);
    }
  },
}
