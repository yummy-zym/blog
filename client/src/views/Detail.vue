<template>
  <div class="container">
    <n-button @click="back">返回</n-button>
    <n-h1>{{blogInfo.title}}</n-h1>
    <div class="blog-content">
      <div v-html="blogInfo.content">
      </div>
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

onMounted(()=>{
  loadBlog()
})
const blogInfo=ref({})
const loadBlog=async ()=>{
  console.log(route)
  let id=route.query.id
  let res=await axios.get(`/blog/detail?id=${id}`)
  blogInfo.value=res.data.rows[0]
}
const back=()=>{
  router.push("/")
}
</script>
<style>
.blog-content img{
  max-width: 100% !important;
}
</style>
<style scoped>
.container{
  width: 1200px;
  margin: 0 auto;
}
</style>