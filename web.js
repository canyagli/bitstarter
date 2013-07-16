var express = require('express');

var fs = require('fs');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  var index_file = "index.html";
  response.send(fs.readFileSync(index_file).toString());
  //response.send('Hello World 2!');
});
//listen on port 8080
var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
