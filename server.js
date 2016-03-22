/**
 * Created with KALI linux VIM.
 * User: S2
 * Date: 16-3-23
 * Time: 早上3:40
 */

var o = require('util');

var players = [];
var list    = [];

var io = require('socket.io')(server);
io.set('log level', 1);
io.sockets.on('connection', function(socket)
{
    socket.on('msg',function(data)
	{
        try
        {
            o.log(players[socket.id].name + ' to ' + players[data.tid].name + ' : ' + data.msg);
            data.timer = (new Date()).getTime();
            var d = data;
            d.socketid = players[socket.id].name;
            d.avatar = players[socket.id].avatar;
            socket.emit('message', d);
            var d = data;
            d.id = players[data.tid].name;
            d.lid = players[socket.id].name;
            d.socketid = socket.id;
            d.avatar = players[socket.id].avatar;
            s[data.tid].emit('messageTo', d);
        }
		catch(e){
			o.log(e.stack);
		}
    });
    socket.on('chatall',function(data)
	{
        try
        {
            o.log(players[socket.id].name + ' say: ' + data.msg);
            data.timer = (new Date()).getTime();
            socket.broadcast.emit('chatall', data);
        }
		catch(e){
			o.log(e.stack);
		}
    });

    socket.on('sendboss', function(data)
	{
        try
        {
            o.log('主播进入，开始直播！');
            socket.broadcast.emit('getboss', data);
            o.log(data);
        }
		catch(e){
			o.log(e.stack);
		}
    });

    socket.on('system', function(data)
	{
        try
        {
            o.log('[system]: ' + data.msg);
            data.timer = (new Date()).getTime();
            socket.broadcast.emit('system', data);
        }
		catch(e){
			o.log(e.stack);
		}
    });
    socket.on('login', function(user)
	{
        try
        {
            o.log('正在发送用户列表给新用户...');
            socket.emit('getplayers', list);
            o.log('用户列表发送完成!');
            players[socket.id] = user;
            s[socket.id] = socket;
            socket.emit('login', socket.id);
            user.id = socket.id;
            list.push(user);

            socket.broadcast.emit('loginIn', user);
            o.log('用户 ' + user.name + ' 登录了！当前在线人数：' + String(list.length));
        }
		catch(e){
			o.log(e.stack);
		}
    });
    socket.on('disconnect', function()
	{
        try
        {
            o.log('用户退出了! 当前在线人数：' + String(list.length - 1));
            socket.broadcast.emit('change', players[socket.id]);
            players.splice(socket.id, 1);
            s.splice(socket.id, 1);
            for(var i=0; i < list.length; i++)
			{
                if(list[i].id == socket.id)
				{
                    list.splice(i, 1);
                }
            }


        }
		catch(e){
			o.log(e.stack);
		}
    });
});

o.log('服务器已经启动，开始监听80端口!');
