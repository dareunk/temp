const db = require("../app.js");
const getDiariesDTO = require("../dtos/searchDTO.js");
const getDiaryFromDB = require("../models/searchDAO.js");

module.exports = {
    getDiaries: async(search) => {
        
       // console.log(search);
        // 데이터베이스로부터 전체 일기목록 가지고 오기 
        const diary = await getDiaryFromDB(search);

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
               console.log(d.content);

            if(diarys.length==0) {
                diarys[count] = d;
                count++;
            }
            else{
                  // 검색반환 결과로 이미 추가된 경우에는 제외(중복 제외)
                diarys.forEach((include) => {
                    console.log(`diary_id: ${include.diary_id}`);
                   if(include.diary_id != d.diary_id ){
                       diarys[count] = d;
                       count++;
                   }
                });
            }
          
       
           }
       });
       console.log("검색결과",diarys);
       return await getDiariesDTO(diarys);
  
       
    }
    
}
