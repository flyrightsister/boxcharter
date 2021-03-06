/*
 * Copyright (c) 2017 Bonnie Schulkin. All Rights Reserved.
 *
 * This file is part of BoxCharter.
 *
 * BoxCharter is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * BoxCharter is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with BoxCharter. If not, see <http://www.gnu.org/licenses/>.
 *
 */

/**
 * Written with help from Stephen Grider's Advanced React and Redux Udemy Course
 * @module
 * routes
 */

const passport = require('passport');
const passportService = require('../services/passport');
const user = require('./user_routes');
const auth = require('./auth_routes');
const chart = require('./chart_routes');
const error = require('./error_routes');

// passport middleware
// { session: false } means don't create a session, since we're using jwt, not cookies
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function (app) {
  app.use('/api/auth', auth);
  app.use('/api/error', error);
  app.use('/api/users', requireAuth, user);
  app.use('/api/charts', requireAuth, chart);
};
