const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');

const server = http.createServer(app);
const serverConfig = require('./config/global')
const sysAuthRouter = require('./routers/Sys_Auth')
const sysMgrRouter = require('./routers/Sys_Mgr');
const attachRouter = require('./routers/Attach');

const demoRouter = require('./routers/Demo');
const log4js = require('./common/log4js')

server.listen(serverConfig.serverPort, () => {
    console.log(`正在监听${serverConfig.serverPort}端口`);
});

log4js.init(app);

app.use(bodyParser.json());

app.use(expressJwt({
    secret: serverConfig.secret
}).unless(req => (
    req.originalUrl == '/Sys_Auth/CMS_Login' ||
    (req.method == 'GET' && req.originalUrl.indexOf('/Attach') == 0)
)));

app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});

app.use('/Sys_Auth', sysAuthRouter)
app.use('/Demo', demoRouter);
app.use('/Sys_Mgr', sysMgrRouter);
app.use('/Attach', attachRouter);


app.get('/error', (req, res, next) => {
    console.error('内部服务器错误[内部跳转]');
    res.send('');
})

app.use((req, res) => {
    res.status(404)
    res.send('页面不存在！')
})

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({ Code: false, Info: 'TOKEN过期或丢失，请尝试重新登录！' });
    } else {
        res.status(err.status || 500).send(err.message || '内部服务器错误');
    }
})