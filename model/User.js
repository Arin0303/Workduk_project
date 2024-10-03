/* ./model/User.js */
const mysql = require("mysql"); //mysql 패키지 불러오기 
const cnn = mysql.createConnection({ //DB서버와 연결
    /*연결할 DB정보들*/
    host: 'localhost', 
    port: '3306',
    user: 'root',
    password: '0000',
    database: 'user'
});

//프로필 정보 입력
exports.insertProfile = ( data, userId, cb ) => { //insert함수를 다른 파일에서 사용할 수 있도록 exports객체에 추가. 따라서 이 파일을 가져오는 다른 모듈에서는 insert함수 사용 가능 
    //cb: 콜백함수(비동기 작업이 완료된 후에 호출될 함수)
    
    /*main테이블에 데이터 삽입*/
    //main 테이블에 data객체의 속성 값들을 삽입 
    var sql = `INSERT INTO main (id, nickname, school_register, major, grade_major, grade_whole, interested_field, spec, introduce) VALUES ( 
    '${userId}',
    '${data.nickname}',
    '${data.school_register}',
    '${data.major}',
    '${data.grade_major}',
    '${data.grade_whole}',
    '${data.interested_field}',
    '${data.spec}',
    '${data.introduce}'
    );`; 
    cnn.query(sql, (err, result) => { //앞에서 정의한 sql쿼리문 실행, (err,rows): 쿼리가 완료되었을 떄 호출되는 콜백함수
        if ( err ) throw err;//만약 오류(err)가 발생하면, 예외를 발생시켜 프로세스를 종료
        console.log("db에 마이프로필 정보 저장 완료");
        console.log(result);
        cb(result);
    });
}

//회원가입 정보 입력
exports.insert = ( data, cb ) => { //insert함수를 다른 파일에서 사용할 수 있도록 exports객체에 추가. 따라서 이 파일을 가져오는 다른 모듈에서는 insert함수 사용 가능 
    //cb: 콜백함수(비동기 작업이 완료된 후에 호출될 함수)
    
    /*main테이블에 데이터 삽입*/
    //main 테이블에 data객체의 속성 값들을 삽입 
    var sql = `INSERT INTO signup (id, pw, nickname, usertype) VALUES ( 
    '${data.id}', 
    '${data.pw}', 
    '${data.nickname}',
    '${data.usertype}'
    );`; 
    cnn.query(sql, (err, rows) => { //앞에서 정의한 sql쿼리문 실행, (err,rows): 쿼리가 완료되었을 떄 호출되는 콜백함수
        if ( err ) throw err;//만약 오류(err)가 발생하면, 예외를 발생시켜 프로세스를 종료
        cb(data.id);//콜백 함수로 data.id 전달
    });
}

//총 게시글 수 조회
exports.count_com_board_lists = () => {
    return new Promise((resolve, reject) => {
        //총 게시물 수 가져오기
        let sql = 'SELECT COUNT(num) AS total_num FROM comboard';
        cnn.query(sql, (err, rows) => {
            if(err){
                return reject(err);
            }
            resolve(rows[0]['total_num']);// 예: { total_num: 15 } 형식에서 값인 15를 반환 
        });
    });
} 

//10개의 게시글 리스트 가져오기
exports.com_board_lists = (page) => {
    const limit = 10;
    const offset = (page - 1) * limit;//가져올 게시글 데이터의 시작 위치(1페이지: 0행부터, 2페이지: 10행부터...)
    return new Promise((resolve, reject) => {
        let sql = "SELECT author, likes, title, content, tags, DATE_FORMAT(date, '%y-%m-%d') AS date FROM comboard ORDER BY num DESC LIMIT ? OFFSET ?";
        
        cnn.query(sql, [limit, offset], (err, rows) => {
            if(err){
                return reject(err);
            }
            resolve(rows);
        });
    });
}


// 닉네임 정보 읽기 (Promise)
exports.select_nickname = (id) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT nickname FROM signup WHERE id = ? limit 1`;

        cnn.query(sql, [id], (err, rows) => {
            if (err) {
                return reject(err); // 에러 발생 시 reject
            }
            if (rows.length > 0) {
                resolve(rows[0].nickname); // 닉네임이 있을 경우 resolve
            } else {
                reject(new Error("닉네임이 발견되지 않음")); // 닉네임이 없을 경우 reject
            }
        });
    });
};

//게시글 등록(promise)
exports.insert_comboard = (author, title, content, tags) => {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO comboard (author, title, content, tags, date) VALUES (?, ?, ?, ?, NOW())`;

        cnn.query(sql, [author, title, content, tags], (err, result) => {
            if (err) {
                return reject(err); // 오류 발생 시 reject 호출
            }
            resolve(result); // 결과 반환
        });
    });
};

// //게시글 등록
// exports.insert_comboard = (data) => {
//     return new Promise((resolve, reject) => {
//     var sql = `INSERT INTO comboard (author, title, content, tags, date) VALUES ( 
//         VALUES (?, ?, ?, ?, NOW())`;
    
//     cnn.query(sql, [author, title, content, tags], (err, rows) => {
//         if(err){
//             console.log("데이터베이스에 게시글이 삽입되지 않음:",err);
//             return cb(err);
//         };
//         console.log(rows[0].author);
//         cb(rows[0])
//     })
    
//     });
// }
// //닉네임 정보 읽기
// exports.select_nickname = ( id, cb ) => {//cb: 응답함수(콜백함수)
//     var sql = `SELECT nickname FROM signup WHERE id = ? limit 1`;

//     cnn.query(sql, [id], (err, rows) => { //에러가 발생하면 err전달, 발생하지 않으면 결과값인 rows전달
//         if ( err ){//에러가 발생한 경우
//             console.log("쿼리 실행 중 오류:", err);
//             return cb(err);
//         };
//         if(rows.length>0){ //에러가 없는 경우
//             console.log("닉네임:", rows[0].nickname);
//             cb(rows[0].nickname); 
//         }
//     });
// }
// //게시글 등록
// exports.insert_comboard = ( data, cb ) => {
//     var sql = `INSERT INTO comboard (author, title, content, tags, date) VALUES ( 
//         VALUES (?, ?, ?, ?, NOW())`;

//     cnn.query(sql, [author, title, content, tags], (err, rows) => {
//         if ( err ){
//             console.log("데이터베이스에 게시글이 삽입되지 않음:", err);
//             return cb(err);
//         };
//         console.log(rows[0].author);
//         cb(rows[0]);
//     });
// }



//로그인 정보 읽기
exports.select = ( id, pw, cb ) => {
    let sql = `SELECT * FROM signup WHERE id='${id}' limit 1`; //id가 일치하는 한 행만 반환(배열로 처리)

    cnn.query(sql, (err, rows) => { 
        if ( err ) throw err;
        cb( rows[0] ); //배열로 처리된 요소에서 첫번째 요소(id가 일치하는 첫번째 행)
    });
}


//usertype 정보 읽기
exports.select_usertype = (sessionId, cb) => {
    let sql = `SELECT * FROM signup WHERE id = ? LIMIT 1`; // 파라미터화된 쿼리 사용

    cnn.query(sql, [sessionId], (err, rows) => { 
        if (err) {
            return cb(err, null); // 첫 번째 인자로 에러 전달
        }
        if (rows.length === 0) {
            return cb(null, null); // 조회 결과가 없을 때
        }
        cb(null, rows[0]); // 조회된 첫 번째 결과만 반환
    });
};

//회원정보 수정하는 화면에서 미리 저장되어 있는 정보를 view에 띄워주기 위해 해당 id로 전체 정보를 조회하는 쿼리 사용
exports.get_user = (id, cb) => {
    let sql = `SELECT * FROM user WHERE id='${id}' limit 1;`;

    cnn.query( sql, function(err, rows){
        if ( err ) throw err;
        cb(rows);
    });
}

//회원 정보 수정
exports.update = ( data,  cb ) => {
    let sql = `UPDATE user SET name='${data.name}', email='${data.email}', phoneNumber='${data.phoneNumber}', password='${data.password}' WHERE id='${data.id}';`;

    cnn.query(sql, (err, rows) => {
        if ( err ) throw err;
        cb( rows );
    });
}

//회원 탈퇴
exports.delete = ( id,  cb ) => {
    var sql = `DELETE FROM user WHERE id='${id}';`;

    cnn.query(sql, (err, rows) => {
        if ( err ) throw err;
        cb( rows );
    });
}

