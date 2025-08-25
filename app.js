var express = require("express");
var app = express();
var cors = require("cors");
var helmet = require("helmet");
var morgan = require("morgan");
require("dotenv").config();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// DB Connection
var connectDb = require("./src/config/db");
connectDb();

// Routes
var apiRoutes = require("./src/routes");
app.use("/", apiRoutes);

// 404 handler
app.use(function(req, res) {
 return res.status(404).json({ error: "Not Found" });
});

// Global error handler
app.use(function(err, req, res, next) {
 console.error(err);
 var status = err.statusCode || 500;
 return res.status(status).json({ error: err.message || "Internal Server Error" });
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
 console.log("Server running on port " + PORT);
});