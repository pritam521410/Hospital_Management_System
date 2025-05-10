const express=require("express");
const app = express();
const users=require("./routes/user.js");
const posts=require("./routes/post.js");
const session=require("express-session");
const flash=require("connect-flash");


app.use(session({secret: "mysupersecret"}));
app.use(flash());
app.get("/",(req, res)=>{
    res.send("test successfull");
})

app.listen(3000, ()=>{
    console.log("server is listening port 3000");
})