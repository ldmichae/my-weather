require('dotenv').config()
const axios = require('axios');
var nodemailer = require('nodemailer');

const toTitleCase = str => str.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase())

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWD
  }
});


const getWeatherData = async( zipCode ) => {
  var key = process.env.WEATHER_API_KEY;
  const data = await axios.get(
    'https://api.openweathermap.org/data/2.5/weather?zip=' + zipCode + ',us&appid=' + key + '&units=imperial')  
  return data
}
  
getWeatherData(27513).then(res=>{
  const description = res.data.weather[0];
  const weather = res.data.main;
  const wind = res.data.wind;
  const resObj = {...description, ...weather, ...wind}
  const weatherDescription = toTitleCase(resObj.description);

  var mailOptions = {
    from: process.env.EMAIL,
    to: process.env.RECIPIENT,
    subject: `Weather Report ${new Date(Date.now()).toLocaleTimeString()}`,
    html: 
    `
     <b>Weather Report for ${res.data.name}</b><br/><br/>
     <b>Description</b>: ${weatherDescription}<br/>
     <b>Temperature</b>: ${resObj.temp} degrees<br/>
     <b>Feels Like</b>:  ${resObj.feels_like} degrees<br/>
     <b>Humidity</b>:    ${resObj.humidity}%<br/>
     <b>Wind Speed</b>:  ${resObj.speed} mph<br/>
    `
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});



