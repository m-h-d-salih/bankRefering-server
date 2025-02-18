import express from 'express';
import { createIntroducer, getIntroducer } from '../controllers/introduser.js';


const router=express.Router();
router.route("/accounts").post(createIntroducer).get(getIntroducer)
export default router
