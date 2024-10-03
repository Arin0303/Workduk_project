const User = require("../model/User");//User에 있는 모듈 불러오기(DB정보)
const path = require('path');
const fs = require('fs');


//sign_up1 화면
exports.sign_up1 = (req, res) => {
    res.render("sign_up1.html");
}
//sign_up2 화면
exports.sign_up2 = (req, res) => {
    res.render("sign_up2.html");
}
//sign_up3 화면
exports.sign_up3 = (req, res) => {
    res.render("sign_up3.html");
}
//로그인 화면
exports.login = (req, res) => {
    res.render("login.html");
}
//로그인 후 홈화면
exports.home_login = (req,res) => {
    res.render('home_login.html');
}
//로그아웃 후 홈화면
exports.home_logout = (req,res) => {  
    res.render("home_logout.html");   
}
exports.myProfile_Mentor = (req,res) => {
    res.render('myProfile_Mentor.html');
}
exports.myProfile_professor = (req,res) => {
    res.render('myProfile_professor.html');
}
exports.myProfile = (req,res) => {
    res.render('myProfile.html', {
        sessionId: req.session.user.id // 서버에서 세션 정보 전달
    });
}
exports.com_board_writeNew = (req,res) => {
    res.render('com_board_writeNew.html');//화면
}

exports.top_project_team = (req,res) => {
    res.render("top_project_team.html");
}

//프로필 정보 저장하기
exports.post_user_Profile = (req, res) => {
    const userId = req.session.user.id;
    /*
    req.body: POST 요청의 본문(body) 데이터
    User.insert: req.body로 전달된 데이터를 데이터베이스에 저장하는 함수이다. 
    result: 데이터베이스 삽입 작업의 결과(여기서는 사용자가 입력한 ID)
    */
    User.insertProfile( req.body, userId, function (result) {   
        res.send(result);//클라이언트에게 JSON 형태로 응답함 
    });
}
// exports.count_com_board_lists = (req,res) => {
//     res.render("com_board.html");
// }



// //닉네임 조회
// exports.get_nickname = (req, res) =>{
//     const userId = req.session.user.id;
//     User.select_nickname(userId, (err, result) => {
//         if(err){
//             console.error("닉네임 조회 중 오류 발생:", err);
//             return res.status(500).send("서버 내부 오류");
//         }
//         res.send(result);
//     })
// }

//페이지 수 구하기
exports.count_com_board_lists = async () => {
    const limit = 10;//한 페이지당 표시할 최대 게시글 수
    try {
        const result = await User.count_com_board_lists();//result=총 게시글 수
        const total_pages = Math.ceil(result / limit);//total_pages=총 페이지 수
        return total_pages;
    } catch(err) {
        console.log("게시글의 개수를 찾는 중 오류 발생", err);
        throw new Error("게시글의 개수를 찾는 중 오류 발생"); // 에러 발생
    }
};


// 요청한 페이지의 게시글들 가져오기
exports.com_board_lists = async (req, res) => {
    const page = parseInt(req) || 1; // 요청한 페이지
    try {
        // 요청한 페이지의 게시글들 조회
        const result = await User.com_board_lists(page);
        return result;
    } catch (err) {
        console.log("요청한 페이지의 게시글 조회 중 오류", err);
        throw new Error("요청한 페이지의 게시글 조회 중 오류"); // 에러 발생
    }
};

// 게시판 렌더링
exports.render_com_board = async (req, res) => {
    try{
    // 페이지 수 먼저 구하기
    const data1 = await exports.count_com_board_lists();// exports를 명시하여 함수 참조

    // 페이지 수를 구한 후 게시글 리스트 가져오기
    const data2 = await exports.com_board_lists(req.query.page, res);//req.query.page: 요청할 때 보낸 페이지
        //두 데이터를 합쳐서 렌더링
        res.render('com_board.html',{
            data1,
            data2
        });
        console.log(data1,data2);
    } catch (err) {
        console.error("오류 발생:",err);
        res.status(500).send("서버 오류");
    }
};

// 게시글 등록 (Promise)
exports.postComBoard = (req, res) => {
    const userId = req.session.user.id;
    User.select_nickname(userId)//닉네임 추출
        .then(result => { // result = rows[0].nickname
            return User.insert_comboard(result, req.body.title, req.body.content, req.body.tags); // Promise 반환
        })
        .then(result => { // result = User.inser_comboard의 삽입 결과
            res.send(result); 
        })
        .catch(err => {
            console.error("게시글 등록 중 오류 발생:", err);
            res.status(500).send("게시글 등록 중 오류가 발생했습니다."); 
        });
}

//마이프로필 구분
exports.profile = (req, res) => {

    console.log(req.session.user.id);
    if (!req.session || !req.session.user) {
        return res.status(401).send({ error: "로그인이 필요합니다." });
    }
    User.select_usertype(req.session.user.id, function(err, result) {
        if (err) {
            return res.status(500).send({ error: "데이터베이스 오류 발생" });
        }
        if (!result) {
            // 조회 결과가 없을 때
            return res.status(404).send({ error: "해당 사용자를 찾을 수 없습니다." });
        }
        if(result.usertype == "재학생/졸업생")  res.send({result: result, usertype: "student"});
        else if(result.usertype == "교직원") res.send({result: result, usertype: "professor"});
        else res.send({result: result, usertype: "null"});
    });
}

//User 정보 저장하기
exports.post_user = (req, res) => {
    /*
    req.body: POST 요청의 본문(body) 데이터
    User.insert: req.body로 전달된 데이터를 데이터베이스에 저장하는 함수이다. 
    result: 데이터베이스 삽입 작업의 결과(여기서는 사용자가 입력한 ID)
    */
    User.insert(req.body, function (result) {   
        res.send(result); //result는 data.id
    });
}


//login 시도
exports.post_login = (req, res) => {
    User.select( req.body.id, req.body.pw, function (result) { //result는 db에서 준 cb(회원정보)

        if (result == null) {//db에 일치하는 id가 없을 때
            return res.send({result: result, code: "false"});
        } 
        else if ((req.body.id != result.id) || (req.body.pw != result.pw)) {//id와 pw정보가 일치하지 않을 떄
            return res.send({result: result, code: "false"});
        }
        else{//id와 pw정보가 모두 일치할 때
            if(result.status == "pending"){//status가 "pending"일 때
                return res.send({result: result, code: "pending"})
            }else if (result.status === "active") {//status가 "active"일 때
                req.session.user = {//세션에 사용자 id 저장
                    id: result.id
                }
                return res.send({result: result, code: "true"});
            } else {
                return res.send({result: result, code: "false"}); // 그 외 상태는 로그인 실패로 처리
            }
        }
    });
}


//회원정보 수정 화면(기존에 저장된 회원정보를 화면에 띄워주는 화면)
exports.edit = (req, res) => {// edit 함수가 모듈로서 외부에 제공됨(이 함수는 라우팅에서 호출되어 특정 경로로 들어온 요청에 대한 처리를 담당)
    /*
    req.body.id를 통해 요청된 사용자의 ID를 얻어온다. 
    해당 ID로 User.get_user 메서드를 호출하여 데이터를 조회한 후, 조회된 결과를 edit 템플릿에 전달한다.
    */
    User.get_user( req.body.id, function (result) {//사용자의 요청에서 id 값을 추출->데이터베이스에서 사용자를 조회한 후, 결과(result)를 콜백 함수로 전달
        res.render("edit", {data: result[0]});//조회된 결과 중 첫 번째 요소를 data라는 이름으로 edit이름을 가진 파일의 템플릿에 전달
    });
}

//정보 수정
exports.patch_user = (req, res) => {
    User.update( req.body, function (result) {//req.body는 클라이언트가 보낸 데이터이다. 이를 User.update 메서드에 전달하여 데이터베이스에 반영한 후, 결과(result)가 이 콜백 함수로 전달된다.
        console.log("update result:" , result);//업데이트 작업의 결과를 서버 콘솔에 출력한다. 이 로그는 개발 또는 디버깅 과정에서 업데이트가 제대로 이루어졌는지 확인하는 데 사용된다.
        res.send("수정완료");//클라이언트에게 '수정완료'라는 메시지를 응답으로 보낸다. 
    });
}

//정보 삭제
exports.delete_user = (req, res) => {
    /*
    삭제하려는 사용자의 id 값을 요청의 본문에서 추출(req.body는 주로 POST 요청에서 폼 데이터를 포함하는 객체이다)
    User.js에서 delete함수에서 콜백함수 cb에 'rows'라는 결과를 전달했으므로 이 'rows'가 delet_user함수의 'result'에 해당하는 값이 된다. 
    */
    User.delete( req.body.id, function (result) { //result: 삭제된 행에 대한 정보를 갖고있음
        console.log("delete result:" , result);
        res.send("success Delete!");
    });
};

// 이미지 업로드 처리 함수
exports.image_upload = (req, res) => {
    if (!req.file) {
        return res.status(400).send("파일 업로드 실패");
    }
    if(req.body.id){
        req.body.id = req.body.id.replace(/['"]/g, ""); // 따옴표 제거
        let id = req.body.id;
        const newFilename = id + path.extname(req.file.originalname); // id + 파일 확장자
        const filePath = path.join(__dirname, '../public/portal_uploads', newFilename);

        // 파일명을 새로운 이름으로 변경
        fs.rename(req.file.path, filePath, (err) => {
            if (err) {
                return res.status(500).send('파일명 변경 실패');
            }
            req.file.filename = newFilename;
            console.log('req.body:',req.body);
            console.log('req.file:',req.file);
            res.send('파일 업로드 성공');
        });
    }else{
        res.status(400).send("ID가 없습니다.");
    }
};
