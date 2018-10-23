const path = require('path');

module.exports = {
    serverPort: 10001,
    mysql: {
        host: '',
        user: '',
        password: '',
        port: '',
        database: ''
    },
    secret: '',
    homePath: path.resolve(__dirname, '../../'),
    publicPath: (process.env.NODE_ENV == 'devlopment') ? 'http://localhost:10001' : 'http://nannongrousong.xin/netss/api',
    //  用户重置密码
    defaultPwd: 'passok'
}