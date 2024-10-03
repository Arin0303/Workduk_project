/* .routes/index.js */
const express = require("express");//express모듈 불러오기
const user = require("../controller/UserController");//UserController모듈 불러오기
const router = express.Router();//express.Router()를 사용하여 라우터 객체를 생성

router.get("/sign_up1", user.sign_up1);//sign_up1 화면
router.get("/sign_up2", user.sign_up2);//sign_up2 화면
router.get("/sign_up3", user.sign_up3);//sign_up3 화면

router.get("/login", user.login); //로그인 화면
router.post("/login", user.post_login); 

router.get("/home_login", user.home_login);//home_login 화면
router.get("/home_logout", user.home_logout)//home_logout 화면
router.get("/", user.home_logout);//home_logout 화면
router.get("/myProfile", user.myProfile);//화면
router.post("/saveMyProfile", user.post_user_Profile);//마이프로필 저장
router.get("/myProfile_Mentor", user.myProfile_Mentor);//화면
router.get("/myProfile_professor", user.myProfile_professor);//화면
router.get("/profile", user.profile);//화면

router.get("/com_board", user.render_com_board);//게시판 페이지


router.get("/com_board_writeNew", user.com_board_writeNew);//화면

router.post("/signup", user.post_user);
router.get("/top_project_team", user.top_project_team);//화면
router.post("/postComBoard",user.postComBoard);
router.post("/edit", user.edit);//'/edit' 경로로 POST 요청이 들어오면 user.edit 함수가 실행됩니다.
router.patch("/edit", user.patch_user);//'/edit' 경로로 PATCH 요청이 들어오면 user.patch_user 함수가 실행됩니다.
router.delete("/delete", user.delete_user);//'/delete' 경로로 DELETE 요청이 들어오면 user.delete_user 함수가 실행됩니다. 


module.exports = router;//router 객체를 모듈로 내보냅니다. 이렇게 하면 이 모듈을 다른 파일에서 불러와 사용할 수 있습니다.
