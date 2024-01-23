const searchService = require("../services/searchService.js");
const response = require("../config/response.js");
const status = require("../config/responseStatus.js");

module.exports = {
    searchInDiary : async(req,res,next) => {
        console.log("searching in Diary board");
        // 사용자에게 검색내용 입력받음
        let search = req.body.search;
      //  console.log(search);
        let result = await searchService.getDiaries(search);
        console.log(`result: ${result}`);
        if(result.length!=0) res.send(response(status.SUCCESS, JSON.stringify(result)));
      // 해당 검색 내용에 일치하는 결과가 없는 경우(result: 0)
        else res.send(response(status.ARTICLE_NOT_FOUND));

    }
}