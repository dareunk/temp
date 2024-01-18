const db = require("../main.js");

module.exports ={
    searching: async(req,res) => {
        // 사용자가 검색창에 입력한 내용
        let search = 'py';
        console.log(search);
        const dbConnection = await db.getConnection();
    
        // 데이터베이스로 부터 일기장 불러오기
        const [ diary ]  = await db.query('select * from diary');
        //console.log(diary);
        var count = 0;

        var diarys = [];
     
        // 제목과 동일한 경우
        diary.forEach( (d) => {
            if(d.title.indexOf(search) != -1){
                //console.log(chatRoom);
                diarys[count] = d;
                count++;
            }});

      
       // 내용과 동일한 경우
       diary.forEach((d) => {
         
           if(d.content.indexOf(search)!=-1){
             diarys.forEach((include) => {
                if(include.diary_id != d.diary_id ){
                    diarys[count] = d;
                    count++;
                }
             });
           }
       });
       console.log(diarys);
  
       
    }
}