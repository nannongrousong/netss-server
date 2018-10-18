const path = require('path');
//  true为本地开发，log会打在控制台;false为线上发布，log会打在文件
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