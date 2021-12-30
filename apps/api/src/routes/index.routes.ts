import { Router } from "express";
import {
  getLibrary,
  index,
  getHome,
  getRead,
  getDetails,
  getPage,
} from "../controllers";

const router = Router();

router.get("/", index);
router.get("/home", getHome);
router.get("/read/:id", getRead);
router.get("/page/:id/:page", getPage);
router.post("/library/:page", getLibrary);
router.get("/details/:route", getDetails);

export default router;
