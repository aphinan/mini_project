const express = require("express");
const router = express.Router();
const {
  login,
  read,
  list,
  create,
  update,
  remove,
  search,
  listuser,
  createUser,
  deleteuser,
  updateuser,
  readuser,
} = require("../Controllers/product");

//API: http://localhost:5000/api/ตามด้วยparams
//devices
router.post("/login", login);
router.get("/devices", read);
router.get("/devices/:id", list);
router.post("/create", create);
router.put("/update/:id", update);
router.delete("/remove/:id", remove);
router.get("/search", search);
//user
router.get("/listuser", listuser);
router.get("/listuser/:userid", readuser);
router.post("/createuser", createUser);
router.delete("/delectuser/:userid", deleteuser);
router.put("/updateuser/:userid", updateuser);

module.exports = router;
