const express=require("express")
const router=express.Router()
const {db,genid}=require("../db/DbUtils")

//添加博客
router.post("/_token/add", async (req,res)=>{
    let {title,categoryId,content}=req.body;
    let id=genid.NextId();
    let create_time=new Date().getTime();

    const insert_sql="INSERT INTO `blog` (`id`,`title`,`category_id`,`content`,`create_time`) VALUES (?,?,?,?,?)"
    let params=[id,title,categoryId,content,create_time];

    let {err,rows}=await db.async.run(insert_sql,params)

    if(err==null){
        res.send({
            code:200,
            msg:"添加成功",
            rows
        })
    }else{
        res.send({
            code:500,
            msg:"添加失败"
        })
    }
})

//修改博客
router.put("/_token/update", async (req,res)=>{
    let {id,title,categoryId,content}=req.body;

    const insert_sql="UPDATE `blog` SET `title`=?,`category_id`=?,`content`=? WHERE `id`=?"
    let params=[title,categoryId,content,id];

    let {err,rows}=await db.async.run(insert_sql,params)

    if(err==null){
        res.send({
            code:200,
            msg:"修改成功",
            rows
        })
    }else{
        res.send({
            code:500,
            msg:"修改失败"
        })
    }
})

//删除博客
router.delete("/_token/delete",async (req,res)=>{
    let id=req.query.id
    let delete_sql="DELETE FROM `blog` WHERE `id`=? "

    let {err,rows}=await db.async.run(delete_sql,id);

    if(err==null){
        res.send({
            code:200,
            msg:"删除成功"
        })
    }else{
        res.send({
            code:500,
            msg:"删除失败"
        })
    }
})

//查询博客列表
router.get("/search",async (req,res)=>{
    /*
    * keyword 关键字
    * categoryId 分类
    *
    * 分页：
    * page 页码
    * pageSize 每页大小
    *
    */
    let {keyword,categoryId,page,pageSize}=req.query
    //校验
    page = page==null?1:page;
    pageSize = pageSize==null?10:pageSize;
    keyword = keyword==null?"":keyword;
    categoryId = categoryId==null?0:categoryId;
    //设置sql判断，生成sql
    let whereSqls=[];
    let params=[];
    if(categoryId!=0){
        whereSqls.push("`category_id`=?")
        params.push(categoryId)
    }
    if(keyword!=''){
        whereSqls.push("(`title` LIKE ? OR `content` LIKE ?)")
        params.push('%'+keyword+'%')
        params.push('%'+keyword+'%')
    }
    let whereSqlStr=""
    if(whereSqls.length>0){
        whereSqlStr="WHERE "+whereSqls.join(" AND ")
    }
    //查分页内容sql
    let searchSql="SELECT `id`, `category_id`, `create_time`,`title`, substr(`content`,0,50) AS `content` FROM `blog` "+whereSqlStr+"ORDER BY `create_time` DESC LIMIT ?,?"
    let searchParams=params.concat([(page-1)*pageSize,pageSize])
    //查数据总数sql
    let searchCountSql="SELECT count(*) AS `count` FROM `blog` "+whereSqlStr
    //查分页数据结果
    let searchResult=await db.async.all(searchSql,searchParams)
    //查数据总数结果
    let searchCountRes=await db.async.all(searchCountSql,params)

    // console.log(searchResult)
    // console.log(searchCountRes)

    if(searchResult.err==null&&searchCountRes.err==null){
        res.send({
            code:200,
            msg:"查询成功",
            data:{
                keyword,
                categoryId,
                page,
                pageSize,
                rows:searchResult.rows,
                count:searchCountRes.rows[0].count
            }
        })
    }else{
        res.send({
            code:500,
            msg:"查询失败"
        })
    }
})

//查询单个博客
router.get("/detail",async (req,res)=>{
    let {id}=req.query
    let detail_sql="SELECT * FROM `blog` WHERE `id`=?"
    let {err,rows}=await db.async.all(detail_sql,[id])
    if(err==null){
        res.send({
            code:200,
            msg:"查询成功",
            rows
        })
    }else{
        res.send({
            code:500,
            msg:"查询失败"
        })
    }
})

module.exports=router