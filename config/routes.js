/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  '/': { view: 'pages/homepage' },

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/

  /**********************
   *         User        *
   ***********************/
  // SignUp
  'POST /auth/signup/': 'UsersController.signUp',
  // Login
  'POST /auth/login': 'UsersController.login',
  // Login route for API's keys
  'POST /auth/systems-login': 'UsersController.loginForApiKeys',
  // Get user's session's
  'GET /user': 'UsersController.validateSession',
  // Get all users
  'GET /auth/all-users/': 'UsersController.allUsers',

  /**********************
   *      Restaurant     *
   ***********************/
  // Get restaurant with
  'GET /restaurant/:slug': 'FairController.getRestaurants',
  //Upload restaurant logo
  'POST /restaurant/logo/:id': 'RestaurantsController.uploadRestaurantLogo',
  //Upload restaurant logo
  'POST /menu/logo/:id': 'MenuController.uploadMenuPhoto',
  'GET /resturantTag/:tag': 'RestaurantsController.getRestaurant',

  /**********************
   *         Fair        *
   ***********************/
  //Upload fair logo
  'POST /fair/logo/:id': 'FairController.uploadFairLogo',

  /**********************
   *      Category       *
   ***********************/
  //Upload category logo
  'POST /categories/logo/:id': 'CategoriesController.uploadCategoryPhoto'
};
