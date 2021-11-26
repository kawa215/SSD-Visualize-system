var express = require('express');
var app = express();


app.use('/vals', express.static('val'));

app.use('/viss', express.static('vis'));

// HTTPリクエストを受け取る部分
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// サーバーを起動する部分
var server = app.listen(4000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
