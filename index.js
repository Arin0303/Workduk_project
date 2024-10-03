/* index.js */
const express = require("express");//express모듈 불러오기
const app = express();//express 앱 생성
const port = 8080;
const bodyParser = require("body-parser"); 
const path = require("path");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser"); 
const cors = require('cors');//모든 도메인에서 서버에게 요청하도록

/*
extended: false로 옵션을 주면 NodeJs에 기본으로 내장된 querystring모듈을 사용
extended: true를 하면 추가로 설치가 필요한 qs모듈을 사용(express에 설치되어있음)
*/
//view 경로 설정
app.set("views", __dirname + "/views");
//정적 파일 경로 설정
app.use(express.static(path.join(__dirname, 'public')));
// 화면 engine을 ejs로 설정
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//미들웨어 설정
app.use(express.urlencoded({extended: true}));//x-www-form-urlencoded형태의 데이터를 해석해준다 
app.use( bodyParser.json() );//JSON형태의 데이터를 해석해준다

app.use(cookieParser());
app.use(
    expressSession({
        secret: "your_secret_key",// [필수] SID를 생성할 때 사용되는 비밀키로 String or Array 사용 가능.
        resave: false, // true(default): 변경 사항이 없어도 세션을 다시 저장, false: 변경시에만 다시 저장
        saveUninitialized: false// true: 어떠한 데이터도 추가되거나 변경되지 않은 세션 설정 허용, false: 비허용
    })
);

app.use(cors({
    origin: 'http://localhost:8080', // 클라이언트 도메인
    credentials: true                 // 쿠키 전송을 허용
}));

const indexRouter = require("./routes"); //= require('./routes/index') 
const uploadRouter = require("./routes/upload");

app.use("/", indexRouter); // '/'경로 이후에 들어오는 모든 요청은 indexRouter가 처리
app.use("/upload", uploadRouter);// '/upload'로 시작하는 모든 요청은 uploadRouter로 전달. 기본 경로로 '/upload'를 지정하는 역할을 한다. 따라서 upload.js 파일에서 설정한 모든 경로는 자동으로 /upload로 시작

app.listen(port, () => {    
    console.log( "Server Port: ", port);
})