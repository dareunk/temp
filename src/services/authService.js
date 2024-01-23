
const nodeMailer = require("nodemailer");
const EmailAuthResponseDTO = require("../dtos/authDTO.js");


// length 길이로 랜덤 문자/숫자 조합 생성하는 함수 
var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
                                  text += possible.charAt(Math.floor(Math.random() * possible.length));
                                }
    return text;
};

// 해당 이메일로 해당 코드 보내는 함수
const send = async(email,code) => {
    const transporter = nodeMailer.createTransport({
        service: "gmail",
        host: "smtp.google.com",
        port: 3000,
        auth:{
            user: process.env.SENDER,
            pass: process.env.PASSWORD
        }
    });
    var text = `[다온 인증코드] ${code}`;
    console.log(text);
    const option = {
        from: process.env.SENDER,
        to: email,
        subject: "daon",
        text: text 
    };
    const info = await transporter.sendMail(option);
    return info;

}

module.exports = {
    sendCode : async(email) => {
        console.log(email);
        if(email){
            var code = generateRandomString(8);
            const result = await send(email,code);


            console.log(result);
            return EmailAuthResponseDTO(result);
        }
        else{
            console.log("The entered email is undefined");
            const mes = "The entered email is undefined";
            return mes
        }

      
        
}
}