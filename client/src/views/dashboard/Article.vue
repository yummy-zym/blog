<template>
  <n-tabs v-model:value="tabValue" justify-content="start" type="line">

    <n-tab-pane name="list" tab="文章列表">
      <div v-for="blog in blogList" :key="blog.id" style="margin-bottom: 15px">
        <n-card :title="blog.title">
          {{blog.content}}
          <template #footer>
            <n-space align="center">
              <div>发布时间：{{blog.create_time}}</div>
              <n-button @click="toUpdate(blog.id)">修改</n-button>
              <n-button @click="toDelete(blog.id)">删除</n-button>
            </n-space>
          </template>
        </n-card>
      </div>
      <n-space>
        <n-pagination
            v-model:page="pageInfo.page"
            :page-count="pageInfo.pageCount"
            v-model:page-size="pageInfo.pageSize"
            :page-sizes="[5,10, 20]"
            size="medium"
            show-quick-jumper
            show-size-picker
        />
      </n-space>
    </n-tab-pane>

    <n-tab-pane name="add" tab="添加文章">
      <n-form>
        <n-form-item path="title" label="标题">
          <n-input v-model:value="addArticle.title" placeholder="请输入标题"/>
        </n-form-item>
        <n-form-item path="category" label="分类">
          <n-select v-model:value="addArticle.categoryId" :options="options" placeholder="请选择分类"/>
        </n-form-item>
        <n-form-item path="content" label="内容">
          <RichTextEditor v-model:valueHtml="addArticle.content" @handleContent="handleContent"></RichTextEditor>
        </n-form-item>
        <n-form-item>
          <n-button @click="add">提交</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>
    <n-tab-pane name="update" tab="修改">
      <n-form>
        <n-form-item path="title" label="标题">
          <n-input v-model:value="updateArticle.title" placeholder="请输入标题"/>
        </n-form-item>
        <n-form-item path="category" label="分类">
          <n-select v-model:value="updateArticle.categoryId" :options="options" placeholder="请选择分类"/>
        </n-form-item>
        <n-form-item path="content" label="内容">
          <RichTextEditor v-model:valueHtml="updateArticle.content" @handleContent="handleContent"></RichTextEditor>
        </n-form-item>
        <n-form-item>
          <n-button @click="update">提交</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>
  </n-tabs>
</template>


<script setup>
import {ref,reactive,inject, onMounted,watch} from "vue";
import {AdminStore} from "../../stores/AdminStore";
import RichTextEditor from "../../components/RichTextEditor.vue"

import {useRouter,useRoute} from "vue-router"
const router=useRouter()
const route=useRoute()

const message=inject("message")
const axios=inject("axios")
const dialog=inject("dialog")
const adminStore=AdminStore()

const tabValue=ref("list")

const addArticle=reactive({
  title:"",
  content:"hello",
  categoryId:null
})
const updateArticle=reactive({
  title:"",
  content:"hello",
  categoryId:null,
  id:0
})

const handleContent=(value)=>{
  addArticle.content=value
}

onMounted(()=>{
  loadBlogs()
  loadCategory()
})

const options=ref([])
const loadCategory=async ()=>{
  let res=await axios.get("/category/list")
  options.value=res.data.rows.map((item)=>{
    return {
      label:item.name,
      value:item.id
    }
  })
  console.log(options.value)
}
const add=async ()=>{
  // console.log(addArticle)
  let res=await axios.post("/blog/_token/add",addArticle)
  if(res.data.code===200){
    message.info(res.data.msg)
    addArticle.title=""
    addArticle.content="hello"
    addArticle.categoryId=null
  }else{
    message.error(res.data.msg)
  }
}

const toUpdate=async (id)=>{
  tabValue.value='update'
  let res=await axios.get(`/blog/detail?id=${id}`)
  console.log(res)
  let data=res.data.rows[0]
  updateArticle.id=id
  updateArticle.title=data.title
  updateArticle.categoryId=data.category_id
  updateArticle.content=data.content
}
const update=async (id)=>{
  let res=await axios.put("/blog/_token/update",updateArticle)
  if(res.data.code===200){
    message.info(res.data.msg)
    updateArticle.id=null
    updateArticle.title=""
    updateArticle.content=""
    updateArticle.categoryId=null
    loadBlogs()
    tabValue.value="list"
  }else{
    message.error(res.data.msg)
  }
}

const toDelete=async (id)=>{
  dialog.warning({
    title: '警告',
    content: '确定删除？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      let res=await axios.delete("/blog/_token/delete?id="+id)
      if(res.data.code===200){
        message.info(res.data.msg)
        loadBlogs()
      }else{
        message.error(res.data.msg)
      }
    },
    onNegativeClick: () => {}
  })
}

const pageInfo=reactive({
  page:1,
  pageSize:5,
  pageCount:0,
  count:0
})

watch([() => pageInfo.pageSize, () => pageInfo.page], (newValue, oldValue) => {
  // 此时newValue为数组
  loadBlogs()
});
const blogList=ref([])
const loadBlogs=async ()=>{
  let res=await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
  let temp_rows=res.data.data.rows
  for(let row of temp_rows){
    row.content+="..."
    let d=new Date(row.create_time)
    row.create_time=`${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`
  }
  pageInfo.count=res.data.data.count
  pageInfo.pageCount=Math.ceil(pageInfo.count/pageInfo.pageSize)
  blogList.value=res.data.data.rows
}


</script>

<style scoped>

</style>