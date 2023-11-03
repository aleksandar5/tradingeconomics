'use strict'; 
const express=require('express');
var cors = require('cors')
const te = require('tradingeconomics');
const app=express();
app.use(cors())
const key="46aa8c0058bb4ca:m6o9do7g9w6h0un";
const port = 3000;

app.use(express.static(__dirname)); //now you can load additional files in homepage...
app.use(express.text())  //you can receive string with country name...
app.use(express.urlencoded({extended: false}))

async function getTopTradingPartners(targetCountry) {
  try {
    await te.login(key); 
	//Get exports
    const exports = await te.getComtradeTotalByType(
      (country = targetCountry),
      (type = 'export')
    )
    //Get imports
    const imports = await te.getComtradeTotalByType(
      (country = targetCountry),
      (type = 'import')
    )
    const exportCountries = exports.filter(
      (entry) => entry.country2.toLowerCase() != 'world'
    )
    const importCountries = imports.filter(
      (entry) => entry.country2.toLowerCase() != 'world'
    )	  
    //Top 50 export markets
    const top50Export = exportCountries
      .sort((a, b) => b.value - a.value)
      .slice(0, 50)
    //Top 50 import sources
    const top50Import = importCountries
      .sort((a, b) => b.value - a.value)
      .slice(0, 50)

return [top50Export,top50Import]

  } catch (error) {
    console.log(error)
  }
}

app.get('/', function (req, res) {
  res.sendFile(__dirname+'/index.html');  //load homepage...
});

app.post('/country', async (req, res) => {
  try {
    const data = JSON.parse(req.body).sendCountryName;   //reseiving country name...
    const result=await getTopTradingPartners(data)  //query for the data...    
    res.setHeader('Content-Type', 'application/json'); 
    res.json( {message : result} );   //send data to index.html
	console.log(result);
	}catch (e) {
    res.end(e.message || e.toString());
  }
});

app.listen(port); 

