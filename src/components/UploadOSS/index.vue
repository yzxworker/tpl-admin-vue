<template>
  <div class="UploadOSS">
    <el-upload
      ref="$uploadOSS"
      :name="uploadName"
      :action="uploadUrl"
      :show-file-list="false"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :on-error="uploadFail"
      :on-success="uploadSuccess"
      :file-list="fileList"
      :auto-upload="autoUpload"
      :limit="fileLimit"
      :data="params"
      :on-exceed="handleLimit"
      class="file-uploader"
    >
      <div
        v-if="imageUrl"
        :style="{ backgroundImage: 'url('+imageUrl+')', backgroundPosition: 'center center', backgroundSize: 'contain',backgroundRepeat:'no-repeat'}"
        class="file-previw"/>
      <i v-else class="el-icon-plus file-uploader-icon"/>
    </el-upload>
    <el-button v-if="!autoUpload" :disabled="processing" type="primary" class="upload-oss-btn" size="mini" @click="submitUpload">
      {{ submitTips }}<i class="el-icon-upload el-icon--right"/>
    </el-button>
  </div>
</template>

<script>
const imgTypes = ['.jpg', '.jpeg', '.png', '.gif']
export default {
  name: 'UploadOSS',
  components: {},
  props: {
    uploadName: {
      type: String,
      default: 'imgData'
    },
    uploadUrl: {
      type: String,
      default: ''
    },
    // 上传文件类型
    fileType: {
      type: Array,
      default: function() {
        return imgTypes
      }
    },
    // 上传最大尺寸(KB)
    fileMaxSize: {
      type: Number,
      default: 1024
    },
    // 上传个数
    fileLimit: {
      type: Number,
      default: null
    },
    // 是否开启自动上传
    autoUpload: {
      type: Boolean,
      default: false
    },
    // 编辑状态图片
    imgEditUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageUrl: '',
      base64Str: '', // 转换成base64
      fileList: [],
      errorResults: [],
      withCredentials: true,
      currentFile: null,
      currentFileSuffix: null, // 当前选择的文件后缀
      // 是否上传中
      processing: false,
      params: {}
    }
  },
  computed: {
    isSupportImg: function() {
      return this.currentFile ? imgTypes.indexOf(this.currentFileSuffix) !== -1 : false
    },
    submitTips: function() {
      return this.processing ? '正在上传' : '上传'
    }
  },
  watch: {
    imageUrl: function(val, oldVal) {
      if (val) {
        this.$emit('on-img-url', val)
      }
    },
    imgEditUrl: function(val, oldVal) {
      console.log('imgEditUrl:', val)
      this.imageUrl = val
    }
  },
  // 挂载
  mounted() {
    this.imageUrl = this.imgEditUrl
  },
  // 销毁
  destroyed() {

  },
  methods: {
    submitUpload() {
      this.$refs.$uploadOSS.submit()
    },
    // 自定义上传请求 http-request 请求 'Content-Type': 'multipart/form-data' 类型无效
    uploadRequest(item) {
      console.log('=uploadRequest=')
      this.processing = true
      this.$emit('on-upload-request', item, this.params)
    },
    handlePreview(file) {
      // 可以通过 file.response 拿到服务端返回数据
      console.log(file)
    },
    handleChange(file, fileList) {
      // console.log('handleChange:', file)
      // todo 错误的文件也包含在fileList中
      this.processing = false
      const checkedStatus = this.checkFileType(file)
      if (!checkedStatus) {
        const tmpArr = fileList.filter(item => {
          return item.name !== file.name
        })
        this.fileList = tmpArr
        return false
      }
      this.$emit('on-handle-change', file)
    },
    handleRemove(file, fileList) {
      console.log('====handleRemove====', file, fileList)
    },
    handleLimit(files, fileList) {
      this.$message.error(`上传文件最多${this.fileLimit}个`)
    },
    // 上传前检查
    async beforeUpload(file) {
      const checkedStatus = this.checkFileType(file)
      if (!checkedStatus) {
        this.processing = false
        return false
      } else {
        this.processing = true
        this.params = {
          imgData: file
        }
        // console.log('正在处理中,请稍后...', this.params)
      }
    },
    // 上传成功
    uploadSuccess(response, file, fileList) {
      this.processing = false
      this.imageUrl = URL.createObjectURL(file.raw)
      this.$refs.$uploadOSS.clearFiles()
      this.currentFile = null
      this.currentFileSuffix = null

      if (response['rspCode'] === 'success') {
        this.$message({
          message: `上传成功`,
          type: 'success'
        })
      } else {
        this.$message({
          message: `上传失败:${response.rspDesc}`,
          type: 'error'
        })
      }

      this.$emit('on-upload-success', response)
    },
    // 上传错误
    uploadFail(err, file, fileList) {
      if (Array.isArray(err)) {
        this.errorResults = err
      }
      this.processing = false
      this.$message({
        message: `上传失败:${file.name}`,
        type: 'error'
      })
      console.warn(`${JSON.stringify(err)}`)
      const t = setTimeout(() => {
        this.errorResults = []
      }, 3000)

      this.currentFile = null
      this.currentFileSuffix = null
      t && clearTimeout(t)

      this.$emit('on-upload-fail', err)
    },
    // 获取base64
    async getBase64(file) {
      let res = false
      try {
        this.base64Str = await this.loadFileDataToBase64String(file)
        // console.warn(this.base64Str)
        this.params = {
          base64Str: this.base64Str,
          imgData: file
        }
        res = true
      } catch (e) {
        console.warn(e)
        res = false
      }
      return res
    },
    // 文件限制
    checkFileType(file) {
      const typeFileExtend = this.fileType.join(',')// 设置文件格式
      const fileExtend = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      const notSupport = typeFileExtend.indexOf(fileExtend) <= -1
      // 大小判断
      const fileKB = file.size / 1024 // 转化为字节KB
      const isLtKB = fileKB < this.fileMaxSize
      // 当前文件图片类型处理
      this.handleCurrentImg(file, fileExtend)
      if (notSupport) {
        this.$message.error(`上传文件格式错误,上传文件只能是 ${typeFileExtend}格式!`)
        this.handleCurrentImg(file, fileExtend, false)
        return false
      }
      if (!isLtKB) {
        this.handleCurrentImg(file, fileExtend, false)
        // this.$message.error(`上传文件大小不能超过 ${this.fileMaxSize}KB (${this.fileMaxSize / 1024}M)!`)
        this.$message.error(`上传文件大小不能超过 ${this.fileMaxSize}KB !`)
        return false
      }
      return !notSupport && isLtKB
    },
    // 做base64的转换
    loadFileDataToBase64String(fileBlob) {
      return new Promise((resolve, reject) => {
        // 读取文件
        const reader = new FileReader()
        reader.onload = function(e) {
          const result = this.result.split('base64,')[1]
          resolve(result)
        }
        reader.onerror = reject
        if (!fileBlob.type || /^text\//i.test(fileBlob.type)) {
          reader.readAsText(fileBlob)
        } else {
          reader.readAsDataURL(fileBlob)
        }
      })
    },
    // 当前文件是否图片
    async handleCurrentImg(file, fileSuffix, bool = true) {
      if (bool) {
        // 当前文件记录
        this.currentFileSuffix = fileSuffix
        this.currentFile = file
        this.imageUrl = this.isSupportImg ? file.url : null
      } else {
        this.currentFile = null
        this.imageUrl = null
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
    .UploadOSS{
       display: flex;
       align-items: center;
      .file-previw{
        max-width: 100%;
        width: 48px;
        height: 48px;
      }
      .file-uploader{
        height: 50px;
        margin-right: 10px;
      }
      .file-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .file-uploader .el-upload:hover {
        border-color: #409EFF;
      }
      .file-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 48px;
        height: 48px;
        line-height: 48px;
        text-align: center;
      }
    }
</style>
