var express = require("express");
var router = express.Router();
var employee = require("../controllers/employeeController");

// Employee endpoints per spec
router.post("/loginEmail", employee.loginEmail);
router.get("/getAllEmployees", employee.getAllEmployees);
router.put("/updateEmployee", employee.updateEmployee);

module.exports = router;


