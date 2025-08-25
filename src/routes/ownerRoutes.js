var express = require("express");
var router = express.Router();
var owner = require("../controllers/ownerController");

// Owner endpoints per spec
router.post("/createNewAccessCode", owner.createNewAccessCode);
router.post("/getEmployee", owner.getEmployee);
router.post("/createEmployee", owner.createEmployee);
router.post("/deleteEmployee", owner.deleteEmployee);

module.exports = router;


