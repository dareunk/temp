const authService = require("../services/authService.js");
const response = require("../config/response.js");
const status = require("../config/responseStatus.js");

module.exports = {
    sendEmail: async(req,res,next) => {
        console.log("Sending a code to the user's email");
        // 사용자로부터 받은 이메일
        let email = req.body.email;
        res.send(response(status.SUCCESS,authService.sendCode(email)));
        
        
    }
}