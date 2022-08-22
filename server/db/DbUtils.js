const sqlite3=require("sqlite3")
const path=require("path")
const GenId=require("../utils/SnowFlake")
const {param} = require("express/lib/router");

//连数据库
var db=new sqlite3.Database(path.join(__dirname,"blog.sqlite3"))
const genid=new GenId({WorkerId:1})

db.async={}

//sqlite3中，all查询多条语句
db.async.all=(sql,params)=>{
    return new Promise((reslove,reject)=>{
        db.all(sql,params,(err,rows)=>{
            reslove({err,rows})
        })
    })
}

//sqlite3中，run执行单条语句以创建/更改表格或插入/更新数据
db.async.run=(sql,params)=>{
    return new Promise((reslove,reject)=>{
        db.run(sql,params,(err,rows)=>{
            reslove({err,rows})
        })
    })
}

module.exports={db,genid}