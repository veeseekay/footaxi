/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  var response = {
    'footaxi': {
      'href': './v1'
    },
    'compute fare': {
      'href': './v1/rides/estimate'
    },
    'create rides': {
      'href': './v1/rides'
    },
    'ride feedback': {
      'href': './v1/rides/{ride_id}/feedback'
    },
    'ride details': {
      'href': './v1/rides/{ride_id}'
    }
  };
  res.jsonp(response);
};
