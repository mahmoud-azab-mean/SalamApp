module.exports = function (io, User, _) {
    const user = new User();
    io.on('connection', socket => {
        socket.on('reload', () => {
            io.emit('reloadPage', {});
        });
        socket.on('online', data => {
            socket.join(data.room);
            user.addUser(socket.id, data.userId, data.room);
            const onlineUsers = user.getUsers(data.room);
            io.emit('usersOnline', _.uniq(onlineUsers));
        });
        socket.on('disconnect', () => {
            const removedUser = user.removeUser(socket.id);
            if (removedUser) {
                let onlineUsers = user.getUsers(removedUser.room);
                onlineUsers = _.uniq(onlineUsers);
                _.remove(onlineUsers, elem => elem === removedUser.userId);
                io.emit('usersOnline', onlineUsers);
            }
        })
    })
}