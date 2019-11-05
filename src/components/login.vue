<template>
  <div class="login-container">
      <div class="login-box">
          <div class="avater">
              <img src="../assets/logo.png" alt="登录">
          </div>
          <div class="login-form">
            <el-form :label-position="labelPosition" label-width="80px" :model="ruleForm" :rules="rules" ref="ruleForm">
                <el-form-item prop="username">
                    <el-input v-model.trim="ruleForm.username" prefix-icon="iconfont icon-icon_gangwei"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                     <el-input v-model.trim="ruleForm.password" type="password" prefix-icon="iconfont icon-icon_mima"></el-input>
                </el-form-item>
                <div class="btn">
                    <el-form-item>
                        <el-button type="primary" @click="login_click">登录</el-button>
                        <el-button @click="reset_click">重置</el-button>
                     </el-form-item>
                </div>
        </el-form>
        </div>
      </div>
  </div>
</template>
<script>
import { login } from '../assets/api/login'
import router from '../router/index'
export default {
  data () {
    return {
      labelPosition: 'right',
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset_click: function () {
      // 清空表单字段
      this.$refs.ruleForm.resetFields()
    },
    login_click: function () {
      // 判断验证合不合法
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const { data: res } = await login(this.ruleForm)
          // 通过状态码判断是否登录成功
          if (res.meta.status === 200) {
            router.push('/home')
          } else {
            alert('用户名密码不正确')
          }
        } else {
          alert('请按规则填写用户名和密码')
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
    .login-container{
        height: 100%;
        background-color: #2b4b6b;
    }
    .login-container .login-box{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 600px;
        height: 300px;
        background-color: #fff;
        transform: translate(-50%,-50%)
    }
    .login-container .avater{
        width: 100px;
        height: 100px;
        position: absolute;
        left: 50%;
        top: -30%;
        transform: translate(-50%,50%);
        border-radius: 100px 50%;
        z-index: 2;
    }
    .login-container .avater img{
        width: 100%;
        height: 100%;
    }
    .login-container .login-form {
        margin-top: 100px;
        margin-right: 100px
    }
    .login-container .btn{
        margin-left: 250px
    }
</style>
