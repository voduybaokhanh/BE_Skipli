var express = require("express");
var router = express.Router();

var ownerRoutes = require("./ownerRoutes");
var employeeRoutes = require("./employeeRoutes");
var common = require("../controllers/commonController");

router.use("/", ownerRoutes);
router.use("/", employeeRoutes);

// Unified validateAccessCode for both roles
router.post("/validateAccessCode", common.validateAccessCode);

module.exports = router;


