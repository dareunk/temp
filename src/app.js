require("dotenv").config();

const port = process.env.PORT || 3000,
	express = require("express"),
	app = express();
const userRouter  = require("./routes/userRoute.js"),
	authRouter = require("./routes/authRoute.js"),
	searchRouter = require("./routes/searchRoute.js");

const expressSession = require("express-session");
const passport = require("passport"),
	LocalStrategy = require("passport-local").Strategy,
	//{Strategy: NaverStrategy, Profile:NaverProfile} = require("passport-naver-v2");
	NaverStrategy = require('passport-naver').Strategy,
	KakaoStrategy = require('passport-kakao').Strategy,
	GoogleStrategy = require("passport-google-oauth2").Strategy;
	app.use(express.static("public"));

const specs = require("./config/swaggerConfig.js");
const SwaggerUi = require("swagger-ui-express");

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

app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(specs));

app.get("/", (req,res) => {
	res.send("main page");
});

// 소셜 로그인 및 이메일 인증 요청하는 경우 
app.use("/auth", authRouter);

// 검색기능 이용하는 경우
app.use("/search", searchRouter);

passport.serializeUser(function(user,done){
	done(null,user);
});
passport.deserializeUser( async function(user, done){
	//const user = await User.findOne({
	//	where: { email:email}
	//});
	done(null,user);
});




// 라우터 이름 예시
//app.use("/user", userRouter);

app.listen(port);
console.log("Running on the port number:" + port);




