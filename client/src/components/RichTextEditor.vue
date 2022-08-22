<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
    />
    <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
        @onChange="handleChange"
    />
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {ref,reactive,inject,defineProps,defineEmits,onMounted,shallowRef,onBeforeUnmount} from "vue";
import {Editor,Toolbar} from "@wangeditor/editor-for-vue"

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

const toolbarConfig = {
  excludeKeys:["uploadVideo"]
}
const editorConfig = { placeholder: '请输入内容...' }
editorConfig.MENU_CONF=[]
const server_url=inject("server_url")
editorConfig.MENU_CONF['uploadImage'] = {
  server: server_url+'/upload/rich_editor_upload',
  // 小于该值就插入 base64 格式（而不上传），默认为 0
  base64LimitSize: 10 * 1024 // 10kb
}

//插入图片前钩子
editorConfig.MENU_CONF['insertImage'] = {
  parseImageSrc: (src)=>{
    if(src.indexOf("http")!==0){
      return `${server_url}${src}`
    }
    return src
  }
}

const mode=ref( 'default')

//子组件接收父组件的值
const props=defineProps({
  valueHtml:{
    type:String,
    default:""
  }
})
const emit=defineEmits(["handleContent"])

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  // console.log('change:', editor)
}
const handleChange = (editor) => {
  // console.log('change:', editor.children)
  //子组件向父组件传值
    emit("handleContent",props.valueHtml)
}


</script>

<style scoped>

</style>