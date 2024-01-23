const express = require("express");
const searchController = require("../controllers/searchController.js");

const searchRouter = express.Router();

searchRouter.post("/diary", searchController.searchInDiary);

module.exports = searchRouter;