/**
 * multer  处理上传功能的中间件p'p
 * sqlite3 数据库
 * uuid  不重复的唯一标识
 */


//引入express
const express = require("express")
//引入multer
const multer=require("multer")
//引入路径
const path=require("path")
const {db} = require("./db/DbUtils");
//实例化
const app=express();
//接口
const port=8080

//开放跨域请求
app.use(function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的Header类型
    res.header("Access-Control-Allow-Headers","*");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if(req.method=="OPTIONS") res.sendStatus(200);//让options尝试请求快速结束
    else next();
})

//json
app.use(express.json())
//上传
const update = multer({
    //目录
    dest:"./public/upload/temp"
})
app.use(update.any())
//指定静态资源路径
app.use(express.static(path.join(__dirname,"public")))

//添加路由中间件验证登录
//category/_token/update
const ADMIN_TOKEN_PATH="/_token"
app.all("*",async (req,res,next)=>{
    if(req.path.indexOf(ADMIN_TOKEN_PATH)>-1){
        // console.log(req.headers)
        let token=req.headers.token;
        console.log(token)

        let admin_token_sql="SELECT * FROM `admin` WHERE `token`=?"
        let adminResult=await db.async.all(admin_token_sql,[token])
        console.log(adminResult)
        if(adminResult.err!=null||adminResult.rows.length===0){
            res.send({
                code:403,
                msg:"请先登录"
            })
            return;
        }else{
            next()
        }
    }else{
        next()
    }
})

app.use("/test",require("./routers/TestRouter"))
app.use("/admin",require("./routers/AdminRouter"))
app.use("/category",require("./routers/CategoryRouter"))
app.use("/blog",require("./routers/BlogRouter"))
app.use("/upload",require("./routers/UploadRouter"))

app.get('/',(req,res)=>{
    res.send("hello")
})
app.listen(port,()=>{
    console.log(`启动成功：http://localhost:${port}/`)
})