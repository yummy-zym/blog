<template>
  <div class="container">
    <div class="nav">
      <div @click="homePage">首页</div>
      <n-popselect
          v-model:value="selectCategory"
          :options="options"
          trigger="click"
          @update:value="searchCategory"
      >
        <div>分类
          <span>{{categoryName}}</span>
        </div>
      </n-popselect>
      <div @click="dashboard">后台</div>
    </div>
    <n-divider/>

    <n-space class="search">
      <n-input v-model:value="pageInfo.keyword" :style="{width:'500px'}" placeholder="请输入关键字"/>
      <n-button type="primary" ghost @click="loadBlogs">搜索</n-button>
    </n-space>
    <div v-for="blog in blogList" :key="blog.id" style="margin-bottom: 15px;cursor: pointer">
      <n-card :title="blog.title" @click="toDetail(blog.id)">
        {{blog.content}}
        <template #footer>
          <n-space align="center">
            <div>发布时间：{{blog.create_time}}</div>
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

    <n-divider/>
    <div class="footer">
      <div>Power by zym</div>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, inject, onMounted, computed, watch} from "vue";
import {useRouter,useRoute} from "vue-router"

const router=useRouter()
const route=useRoute()

const message=inject("message")
const axios=inject("axios")
const dialog=inject("dialog")

const homePage=()=>{
  router.push("/")
}
const dashboard=()=>{
  router.push("/login")
}

const searchCategory=(value)=>{
  pageInfo.categoryId=value
  loadBlogs()
}

onMounted(()=>{
  loadCategory()
  loadBlogs()
})
const categoryName=computed(()=>{
  let option=options.value.find((item)=>{
    return item.value===selectCategory.value
  })
  return option?option.label:""
})
const selectCategory=ref(0)
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

const toDetail=(id)=>{
  router.push({path:"/detail",query:{id:id}})
}

const pageInfo=reactive({
  page:1,
  pageSize:5,
  pageCount:0,
  count:0,
  keyword:"",
  categoryId:0
})
const blogList=ref([])

watch([() => pageInfo.pageSize, () => pageInfo.page], (newValue, oldValue) => {
  // 此时newValue为数组
  loadBlogs()
});
const loadBlogs=async ()=>{
  let res=await axios.get(`/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&categoryId=${pageInfo.categoryId}`)
  let temp_rows=res.data.data.rows
  console.log(temp_rows)
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

<style lang="scss" scoped>
.container{
  width: 1200px;
  margin: 0 auto;
}
.nav{
  display: flex;
  font-size: 20px;
  padding-top: 20px;
  color: #64676a;
  div{
    cursor: pointer;
    margin-right: 15px;
    &:hover{
      color: orange;
    }
    span{
      font-size: 12px;
    }
  }
}
.footer{
  text-align: center;
  line-height: 25px;
  color: #64676a;
}
.search{
  margin-bottom: 15px;
}
</style>