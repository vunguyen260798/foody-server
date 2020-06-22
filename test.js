const openGeocoder = require('node-open-geocoder');

openGeocoder()
  .reverse(105.979651, 20.258085 )
  .end((err, res) => {
      console.log(res)
  })