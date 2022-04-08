/**
 * FairController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const loash = require('@sailshq/lodash');

module.exports = {

  getRestaurants: async function (req, res) {
    let menu = [];
    let fair = await Fair.find({
      where: {
        id: req.param('slug')
      }
    }).populate('restaurants').then( (fair) => {
      let query = Menu.find({
        where: {
          restaurant: loash.pluck(fair[0].restaurants, 'id')
        }
      }).populate('restaurant').populate('category').then((response) => {
        return res.ok({
          fair: fair,
          menus: response
        });
      });
    });
  },

  uploadFairLogo: async (req, res) => {
    try {
      req.file('image').upload({
        // don't allow the total upload size to exceed ~10MB
        maxBytes: 30000000,
        dirname: '../../assets/uploads/images/fairs/logo'
      },async function whenDone(err, uploadedFiles) {
        if (err) {return res.serverError(err);}

        if (req.param('id') === undefined) {return res.badRequest('ID cannot be null');}

        if (uploadedFiles.length === 0) {return res.badRequest('No image send');}

        const filePath = uploadedFiles[0].fd;

        const imageUploaded = await Fair.update({
          id: req.param('id')
        }).set({
          logoPath: filePath,
          image: filePath.split('/')[filePath.split('/').length - 1]
        });
        const data = await Fair.find({
          id: req.param('id')
        });

        return res.json({
          message: uploadedFiles.length + ' file(s) uploaded successfully!',
          image: data
        });
      })
    } catch (e) {
      res.badRequest(e);
    }
  },

};

