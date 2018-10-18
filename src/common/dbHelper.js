const mysql = require('mysql')
const { mysql: mysqlConf } = require('../config/global');
const errorInfo = require('./errorInfo');

const executeSql = (sql, params = []) => (
    new Promise((resolve, reject) => {
        const connection = mysql.createConnection(mysqlConf);
        connection.connect();

        connection.query({
            sql,
            values: params
        }, (err, res) => {
            if (err) {
                console.error(`执行sql错误.\nsql：${sql}`);
                console.error('params', params);
                console.error(err);
                reject(new Error(errorInfo.DB_OPER_ERROR));
            } else {
                resolve(res);
            }
        })

        connection.end();
    })
);

const executeSqlWithCon = (sql, params, conn) => (
    new Promise((resolve, reject) => {
        conn.query({
            sql,
            values: params
        }, (err, res) => {
            if (err) {
                reject(new Error(errorInfo.DB_OPER_ERROR));
            } else {
                resolve(res);
            }
        })
    })
)

/**
 * 
 * @param {*} sqlList 
 * @param {*} attachParams {sqlResIndex:0,sqlAfterReplaceStr:''}
 */
const executeTransaction = (sqlList, attachParams) => (
    new Promise((resove, reject) => {
        const connection = mysql.createConnection(mysqlConf);
        connection.connect();

        connection.beginTransaction(async (err) => {
            if (err) {
                console.error('beginTransaction.error');
                console.error('sqlList', sqlList);
                return reject(new Error(errorInfo.DB_OPER_ERROR));
            }

            let incrementID = undefined;

            for (let sqlIndex in sqlList) {
                let { sql, params = [] } = sqlList[sqlIndex];

                try {
                    attachParams && (sql = sql.replace(attachParams.sqlAfterReplaceStr, incrementID));

                    let data = await executeSqlWithCon(sql, params, connection);

                    attachParams && attachParams.sqlResIndex == sqlIndex && (incrementID = data.insertId);
                } catch (err) {
                    //  异常回滚
                    connection.rollback(() => {
                        console.error('执行事务错误。', err)
                        console.error('sql', sql);
                        console.error('params', params);
                        reject(new Error(errorInfo.DB_OPER_ERROR));
                    })
                    break;
                }
            }
            //  全部执行完毕
            connection.commit((err) => {
                if (err) {
                    connection.rollback(() => {
                        console.error('执行事务错误。');
                        console.error('sqllist', sqlList);
                        reject(new Error(errorInfo.DB_OPER_ERROR));
                    })
                }
                resove();
            })

            connection.end();
        })

    })
);

module.exports = {
    executeSql,
    executeTransaction
}