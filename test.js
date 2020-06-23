// const openGeocoder = require('node-open-geocoder');

// openGeocoder()
//   .reverse(106.349179 , 9.954118)
//   .end((err, res) => {
//       console.log(res)
//   })

  var geocoding = new require('reverse-geocoding');
var config = {
    'latitude': 40.00403611111111,
    'longitude': 116.48485555555555,
    'language': 'zh-cn'
};
geocoding(config, (err, data) => {
    console.log(err ? err : data);
});