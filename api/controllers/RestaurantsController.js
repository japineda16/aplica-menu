/**
 * RestaurantsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  uploadRestaurantLogo: async (req, res) => {
    try {
      req.file('image').upload({
        // don't allow the total upload size to exceed ~10MB
        maxBytes: 50000000,
        dirname: '../../assets/uploads/images/restaurants/logo'
      }, async function whenDone(err, uploadedFiles) {
        if (err) {return res.serverError(err);}

        if (req.param('id') === undefined) {return res.badRequest('ID cannot be null');}

        if (uploadedFiles.length === 0) {return res.badRequest('No image send');}

        const filePath = uploadedFiles[0].fd;

        const settingImage = await Restaurants.update({
          id: req.param('id')
        }).set({
          logoPath: filePath,
          image: filePath.split('/')[filePath.split('/').length - 1]
        });

        const data = await Restaurants.find({
          id: req.param('id')
        });

        return res.json({
          message: uploadedFiles.length + ' file(s) uploaded successfully!',
          image: data
        });
      });
    } catch (e) {
      res.badRequest(e);
    }
  },

  getRestaurant: async (req, res) => {
    try {
      rest = await Restaurants.find({
        where: {restaurantTag: req.param('tag')},
        limit: 1
      }).populate('users')
      .populate('fair')
      .populate('menu', {isActive: true}).populate('category').exec( (err, fido) => {
        if (err) {return res.serverError(err);}
        if (!fido) {return res.notFound();}
        return res.ok(fido);
      });
    }
    catch(err) {
      res.badRequest({err});
    }
  }

};

