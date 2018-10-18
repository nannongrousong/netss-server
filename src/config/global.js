const path = require('path');
const debugMode = true;

module.exports = {
    serverPort: 10001,
    mysql: {
        host: '',
        user: '',
        password: '',
        port: '',
        database: ''
    },
    secret: 'abcdefgh12345678',
    debugMode,
    homePath: path.resolve(__dirname, '../../'),
    publicPath: debugMode ? 'http://localhost:10001' : 'http://nannongrousong.xin/netss/api',
    //  用户重置密码
    defaultPwd: 'passok'
}