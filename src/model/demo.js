const dbHelper = require('../common/dbHelper');
const errorInfo = require('../common/errorInfo');

const listUser = async ({ index, size }) => {
    const [count, recordList] = await Promise.all([
        dbHelper.executeSql('select count(1) as count from tbl_test_user'),
        dbHelper.executeSql(`select user_id as UserID, name as Name, age as Age, address as Address, tag as Tag
            from tbl_test_user where user_id >= ( select user_id from tbl_test_user limit ${index},1 )  limit ${size}`)
    ]);
    return [count[0].count, recordList];
}

const addUser = async ({ Name = '', Age, Address = '', Tag = '' }) => {
    let sqlParams = [Name, Age, Address, Tag];

    await dbHelper.executeSql('insert into tbl_test_user(name,age,address,tag) values(?,?,?,?)', sqlParams)
};

const delUser = async (userID) => {
    let sql = 'delete from tbl_test_user where user_id = ?';
    let sqlParams = [userID];

    await dbHelper.executeSql(sql, sqlParams);
};

const editUser = async (userInfo) => {
    let { UserID, Name, Age, Address, Tag } = userInfo;
    let sql = 'update tbl_test_user set name=?,age=?,address=?,tag=? where user_id = ?';
    let sqlParams = [Name, Age, Address, Tag, UserID];

    await dbHelper.executeSql(sql, sqlParams);
};

module.exports = {
    listUser,
    addUser,
    delUser,
    editUser
}