import express from "express";
import {  CountAll  } from "../controllers/admincontroller.js";
import {  selectAll  } from "../controllers/selectmodule.js";
import {  comparebarcode  } from "../controllers/comparebarcode.js";
import {  insertmoduledata  } from "../controllers/insertmoduledata.js";




 
const router = express.Router();

router.get("/CountAll", CountAll);
router.get("/selectAll", selectAll);
router.get("/comparebarcode", comparebarcode);
router.get("/insertmoduledata", insertmoduledata);



 
 
export default router;
