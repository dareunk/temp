require("dotenv").config();

const port = process.env.PORT || 3000,
	express = require("express"),
	app = express();
const userRouter  = require("./routes/userRoute.js");
const expressSession = require("express-session");
const passport = require("passport"),
	LocalStrategy = require("passport-local").Strategy,
	//{Strategy: NaverStrategy, Profile:NaverProfile} = require("passport-naver-v2");
	NaverStrategy = require('passport-naver').Strategy,
	KakaoStrategy = require('passport-kakao').Strategy,
	GoogleStrategy = require("passport-google-oauth2").Strategy;
	app.use(express.static("public"));
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'daon'
});
module.exports = db;

app.use(expressSession({
	secret: "secret_password",
	cookie:{
		maxAge:4000000
	},
	resave:false,
	saveUninitialized:true
}));
app.use(
	express.urlencoded({
		extended: false
	})
);

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
/*
passport.use(new LocalStrategy({
	usernameField: "email",
	passwordField:"password",
	session:true,
	passReqToCallback: false,
},async function(email,password, done) {
	try{
		let user = await User.findByPk(email);
		if(user){

			if(await User.passwordComparison(user, password)) {return done(null,user);
		}else{
			//The user information is in DB and entered password is the same from DB
			return done(null,false, {message: "password is wrong"});
		}
	}else { return done(null,false, {message: "Your account does not exist. Sign up first"});}
	}catch(error){
		return done(error);
	}
}));
*/


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
app.get("/", (req,res) => {
	res.send("main page");
})
// 네이버 구현
// 네이버 라우터
app.get("/auth/naver/login", passport.authenticate('naver',{authType: 'reprompt'}));
app.get("/auth/naver", passport.authenticate('naver',{failureRedirect:'/auth/naver/login'}),
(req,res) => {
	res.redirect("/");
},
);
app.get("/auth/kakao/login", passport.authenticate('kakao'));
app.get("/auth/kakao", passport.authenticate('kakao',{failureRedirect:'/auth/kakao/login'}),
(req,res)=>{
	res.redirect("/");
}
);
app.get("/auth/google/login", passport.authenticate("google", {scope: ["email", "profile"]}));
app.get("/auth/google", passport.authenticate("google", {
                      failureRedirect: "/auth/google/login",
                     successRedirect: "/",
                      failureFlash:true
}));

// 인증코드 전송 테스트
const auth  = require("./services/authService.js");

app.post("/auth/email/code", auth.sendEmail);

// 검색 테스트
const search = require("./services/search.js");

app.get("/search/diary", search.searching);

passport.serializeUser(function(user,done){
	done(null,user);
});
passport.deserializeUser( async function(user, done){
	//const user = await User.findOne({
	//	where: { email:email}
	//});
	done(null,user);
});


// 검색 테스트


// 라우터 이름 예시
//app.use("/user", userRouter);

app.listen(port);
console.log("Running on the port number:" + port);




