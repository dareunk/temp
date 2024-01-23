const express = require("express");
const userController = require("../controllers/userController.js");
const authController = require("../controllers/authController.js");
const passport = require("passport"),
	LocalStrategy = require("passport-local").Strategy,
	//{Strategy: NaverStrategy, Profile:NaverProfile} = require("passport-naver-v2");
	NaverStrategy = require('passport-naver').Strategy,
	KakaoStrategy = require('passport-kakao').Strategy,
	GoogleStrategy = require("passport-google-oauth2").Strategy;


const authRouter = express.Router();




passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: '/auth/google',
	passReqToCallback: true,
}, async function(request, accessToken, refreshToken, profile, done) {
	console.log(profile);
	/*
	const [user,created] = await User.findOrCreate({
		where:{email: profile.email},
		defaults:{
			firstName:profile.given_name,
			lastName:profile.family_name,
			password:generateRandomString(10),
			profile: "default_profile"
		}
	});
	if(created){
		console.log("sign up with google account");
	}
*/
	//req.session.profile = profile;
//	console.log(accessToken);
	
	return done(null, profile);
}));

const client_id= process.env.NAVER_CLIENT_ID;
const client_secret = process.env.NAVER_CLIENT_SECRET;

console.log(client_id);
console.log(client_secret);

passport.use(
	new NaverStrategy(
		{
			clientID: client_id,
			clientSecret: client_secret,
			callbackURL: '/auth/naver',
		}, async function(accessToken, refreshToken, profile, done) {
			console.log(profile);
			/*
			const [user,created] = await User.findOrCreate({
				where:{email: profile.email},
				defaults:{
					firstName:profile.given_name,
					lastName:profile.family_name,
					password:generateRandomString(10),
					profile: "default_profile"
				}
			});
			if(created){
				console.log("sign up with google account");
			}
		
			//req.session.profile = profile;
		//	console.log(accessToken);
*/
			return done(null, profile);
		}
	)
)
passport.use(
	'kakao',
	new KakaoStrategy({
		clientID: process.env.KAKAO_CLIENT_ID,
		callbackURL: '/auth/kakao',
		clientSecret: process.env.KAKAO_CLINET_SECRET
	},async function(accessToken, refreshToken, profile, done){
		console.log(profile);
		return done(null,profile);
	}
	)
)

// 소셜 로그인 연동 관련 라우터 
authRouter.get("/naver/login", passport.authenticate('naver',{authType: 'reprompt'}));
authRouter.get("/naver", passport.authenticate('naver',{failureRedirect:'/auth/naver/login'}),userController.redirectToMain);
authRouter.get("/kakao/login", passport.authenticate('kakao'));
authRouter.get("/kakao", passport.authenticate('kakao',{failureRedirect:'/auth/kakao/login'}),userController.redirectToMain);
authRouter.get("/google/login", passport.authenticate("google", {scope: ["email", "profile"]}));
authRouter.get("/google", passport.authenticate("google", {
                      failureRedirect: "/auth/google/login",
                     successRedirect: "/",
                      failureFlash:true
}));

// 문자 인증 관련 라우터 
authRouter.post("/email/code", authController.sendEmail);
module.exports = authRouter;
