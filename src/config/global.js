const path = require('path');
//  本地开发，log会打在控制台;线上发布，log会打在文件
const debugMode = process.env.NODE_ENV == 'devlopment';

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
    debugMode,
    homePath: path.resolve(__dirname, '../../'),
    publicPath: debugMode ? 'http://localhost:10001' : 'http://nannongrousong.xin/netss/api',
    //  用户重置密码
    defaultPwd: 'passok'
}