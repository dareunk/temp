const db = require("../config/db.js");
const getDiarySQL = require("./searchSQL.js");

const getDiaryFromDB = async(search) => {
    const dbConnection = await db.getConnection();
    const result = await db.query(getDiarySQL);
    dbConnection.release();
   // console.log(result);
   //console.log(result[0]);

    return result[0];

}
module.exports = getDiaryFromDB;