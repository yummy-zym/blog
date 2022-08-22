<template>
  <n-button @click="showAddModal=true">添加</n-button>
  <n-table :bordered="false" :single-line="false">
    <thead>
    <tr>
      <th>编号</th>
      <th>名称</th>
      <th>操作</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="category in categoryList">
      <td>{{ category.id }}</td>
      <td>{{ category.name }}</td>
      <td>
        <n-space>
          <n-button @click="toUpdate(category)">修改</n-button>
          <n-button @click="deleteCategory(category)">删除</n-button>
        </n-space>
      </td>
    </tr>
    </tbody>
  </n-table>
  <n-modal v-model:show="showAddModal" preset="dialog" title="Dialog">
    <template #header>
      <div>添加分类</div>
    </template>
    <div>
      <n-input v-model:value="addCategoryList.name" type="text" placeholder="请输入名称"/>
    </div>
    <template #action>
      <div>
        <n-button @click="addCategory">提交</n-button>
      </div>
    </template>
  </n-modal>
  <n-modal v-model:show="showUpdateModal" preset="dialog" title="Dialog">
    <template #header>
      <div>修改分类</div>
    </template>
    <div>
      <n-input v-model:value="updateCategoryList.name" type="text" placeholder="请输入名称"/>
    </div>
    <template #action>
      <div>
        <n-button @click="updateCategory">提交</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup>
import {ref,reactive,inject, onMounted} from "vue";
import {AdminStore} from "../../stores/AdminStore";

import {useRouter,useRoute} from "vue-router"
const router=useRouter()
const route=useRoute()

const message=inject("message")
const axios=inject("axios")
const dialog=inject("dialog")
const adminStore=AdminStore()

onMounted(()=>{
  loadDatas()
})

const categoryList=ref([])
const loadDatas= async ()=>{
  let res=await axios.get("/category/list")
  categoryList.value=res.data.rows
  console.log(res)
}

const showAddModal=ref(false)
const addCategoryList=reactive({
  name:"",
})
const addCategory=async ()=>{
  let res=await axios.post("/category/_token/add",{name:addCategoryList.name})
  if(res.data.code===200){
    loadDatas()
    message.info(res.data.msg)
  }else{
    message.error(res.data.msg)
  }
  showAddModal.value=false
}
const deleteCategory= async (category)=>{
  dialog.warning({
    title: '警告',
    content: '确定删除？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      let res=await axios.delete(`/category/_token/delete?id=${category.id}`)
      if(res.data.code===200){
        loadDatas()
        message.info(res.data.msg)
      }else{
        message.error(res.data.msg)
      }
    },
    onNegativeClick: () => {}
  })
}

const showUpdateModal=ref(false)
const updateCategoryList=reactive({
  id:"",
  name:""
})
const toUpdate=async (category)=>{
  updateCategoryList.id=category.id
  updateCategoryList.name=category.name
  showUpdateModal.value=true
}
const updateCategory=async ()=>{
  let res=await axios.put('/category/_token/update',{id:updateCategoryList.id,name:updateCategoryList.name})
  if(res.data.code===200){
    loadDatas()
    message.info(res.data.msg)
  }else{
    message.error(res.data.msg)
  }
  showUpdateModal.value=false
}
</script>

<style scoped>

</style>