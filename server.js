var fs = require('fs');
var app = require('http').createServer( function (req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) return res.writeHead(500);

        res.writeHead(200);
        res.end(data);
    });
});

var io = require('socket.io').listen(app, { log: false });
io.sockets.on('connection', function (socket) {
    socket.on('pulse', function (data) {
        socket.emit('pulse', data ? data * 2 : 0);
    });
	
	/** �ȉ��ǉ������@http://d.hatena.ne.jp/ngmy/20111009/1318164221 **/
  // �N���C�A���g����̃C�x���g'all'����M����
	socket.on('all', function(data) {
    // �C�x���g��'msg'�Ŏ�M���b�Z�[�W��
    // �������܂ޑS�N���C�A���g�Ƀu���[�h�L���X�g����
		io.sockets.emit('msg', data);
	});

  // �N���C�A���g����̃C�x���g'others'����M����
	socket.on('others', function(data) {
    // �C�x���g��'msg'�Ŏ�M���b�Z�[�W��
    // �����ȊO�̑S�N���C�A���g�Ƀu���[�h�L���X�g����
		socket.broadcast.emit('msg', data);
	});

	socket.on('disconnect', function() {
		console.log('disconn');
	});
	/** �����܂� **/

});

app.listen(80);
