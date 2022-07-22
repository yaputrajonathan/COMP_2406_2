const express = require("express");
const app = express();

const fridgeRouter = require("./fridges-router.js");
const fridgesMod = require("./a3-fridges.js");

fridgesMod.initialize();

//Mount the catalogRouter router to the path /users
//All requests starting with /catalog will be forwarded to this router
// console.log("Test");
app.use("/", fridgeRouter);
//app.use("/users", userRouter);

//Serve static resources from public, if they exist
app.use(express.static("public"));

//Handle a single request here
app.get("/", function(req, res, next){
  res.send("Welcome to the community fridge web application!")
});

app.listen(8000);
console.log("Server running at http://localhost:8000");
