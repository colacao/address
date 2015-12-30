var express = require('express');
var Segment = require('segment');
var path = require('path');
var segment = new Segment();
segment.useDefault();
//segment.loadSynonymDict('synonym.txt');
var app = express();
var compression = require('compression');
var zlib = require('zlib');
app.use(compression());
app.set('port', process.env.PORT || 8808);
app.set('views', __dirname + '/view');
app.set('view engine', 'html');
app.set("view options",{  
   "open":"{{",  
   "close":"}}"  
});  
app.engine('html',require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'public'))); 


app.get('/', function(req, res) {
	var ipip = require('ipip').IPIP;
	var ip = new ipip();
	var strip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
	res.render('index', {city:ip.ip("58.208.66.241"||strip.match(/\d+/g).join('.')),title:new Date().toLocaleString()});
});


app.get('/json',function(req,res){
		var data="{}";		
		zlib.Z_DEFAULT_COMPRESSION=9;
		res.json(data);
});
app.get('/:key',function(req,res){
	res.send(segment.doSegment(req.params.key));
});
function getIPAdress(){
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
          var iface = interfaces[devName];
          for(var i=0;i<iface.length;i++){
               var alias = iface[i];
               if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                     return alias.address;
               }
          }
    }
}
console.log('http://'+getIPAdress()+":"+app.get('port')+"/");  
app.listen(app.get('port'));