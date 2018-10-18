const https = require('https');
const crypto = require('crypto');
const serverConf = require('../config/global');
const jwt = require('jsonwebtoken');

/**
 * https的get请求
 * @param {String} url 请求地址
 * @param {Function} callBack 回调函数。param1:操作结果,param2:返回的数据
 */
const httpsGet = (url, callBack) => {
    https.get(url, (req, res) => {
        let data = '';
        req.on('data', (d) => {
            data += d;
        });
        req.on('end', () => {
            callBack(true, data);
        })
    }).on("error", (err) => {
        console.error(`https请求失败，地址${url}。错误信息\r\n`);
        console.error(err);
        callBack(false)
    });
}

/**
 * 获取时间格式字符串。返回YYYY-MM-DD
 * @param {Date} date 时间
 */
const getYYYYMMDD = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)
}

const aesEncrypt = (data, key) => {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

const aesDecrypt = (encrypted, key) => {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const encryptData = (data) => (aesEncrypt(data, 'helloworld'));

const decryptData = (data) => (aesDecrypt(data, 'helloworld'));

const getErrorInfo = (err) => (typeof err == 'string' ? err : (err.message || ''));

const getUserIDByHeaders = (header) => {
    const { authorization } = header;
    const token = authorization ? authorization.split(' ')[1] : '';
    const { secret } = serverConf;
    const { userID } = jwt.verify(token, secret);
    return userID;
};

module.exports = {
    httpsGet,
    getYYYYMMDD,
    encryptData,
    decryptData,
    getErrorInfo,
    getUserIDByHeaders
}