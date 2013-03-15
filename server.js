/** Chatサーバ **/
var fs = require('fs');
var app = require('http').createServer( function (req, res) {

	// 参考
	// http://nodejs.jp/nodejs.org_ja/api/http.html#http_http_createserver_requestlistener
	var persedURL = require('url').parse( req.url, true );
	var fileName;
	if( persedURL.href.length == 0 ){
		fileName = '/index.html';
	}else{
		fileName = persedURL.href;
	}
	
    fs.readFile(__dirname +  persedURL.href, function (err, data) {
        if (err) return res.writeHead(500);
        res.writeHead(200);
        res.end(data);
    });

/**
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) return res.writeHead(500);
        res.writeHead(200);
        res.end(data);
    });
**/	
	
});

var io = require('socket.io').listen(app, { log: true });
io.sockets.on('connection', function (socket) {
	/**
    socket.on('pulse', function (data) {
        socket.emit('pulse', data ? data * 2 : 0);
    });
	**/
	
	/** 以下追加部分　http://d.hatena.ne.jp/ngmy/20111009/1318164221 **/
  // クライアントからのイベント'all'を受信する
	socket.on('all', function(data) {
	
	
	 // 実行時間を追加
	 // 日本時間に修正
	var timeStamp = parseInt( new Date() /1000 ) + 32400;
    var d = new Date( timeStamp * 1000 );
    data.time = d.getFullYear()  + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    console.log('\033[96m' + data + '\033[39m');
	
    // イベント名'msg'で受信メッセージを
    // 自分を含む全クライアントにブロードキャストする
		io.sockets.emit('msg', data);
	});

  // クライアントからのイベント'others'を受信する
	socket.on('others', function(data) {
    // イベント名'msg'で受信メッセージを
    // 自分以外の全クライアントにブロードキャストする
		socket.broadcast.emit('msg', data);
	});

	socket.on('disconnect', function() {
		console.log('disconn');
	});
	/** ここまで **/

});
// app.listen(80);
app.listen(80);
