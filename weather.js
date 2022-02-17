const weather = require('weather-js');
 
weather.find({search: '27513', degreeType: 'F'}, function(err, result) {
  if(err) console.log(err);
 
  return JSON.stringify(result, null, 2);
});