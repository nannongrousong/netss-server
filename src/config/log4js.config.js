const log4js = require('log4js')

log4js.configure({
    appenders: {
        //  请求跟踪
        trace: {
            type: 'dateFile',
            filename: 'logs/trace/',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
        //  错误日志
        error: {
            type: 'dateFile',
            filename: 'logs/error/',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
        //  信息
        info: {
            type: 'dateFile',
            filename: 'logs/info/',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: { appenders: ['info'], level: 'info' },
        error: { appenders: ['error'], level: 'error' },
        info: { appenders: ['info'], level: 'info' },
        trace: { appenders: ['trace'], level: 'trace' }
    }
})

module.exports = {
    getLogger: (name) => {
        return log4js.getLogger(name)
    },
    useLogger: (app, logger) => {
        app.use(log4js.connectLogger(logger, {
            format: '[:remote-addr :method :url :status :response-timems][:referrer HTTP/:http-version :user-agent]'
        }))
    }
}