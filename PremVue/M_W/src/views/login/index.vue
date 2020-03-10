<template>
  <div class="login-container">
      <el-alert
      v-if="loading >0"
    :title="loading===1? 'Logging In...':loading===2?'Successfully Logged In':'Loggin Error'"
    :type="loading===1?'warning':loading===2?'success': loading===3?'error':''"
    effect="dark">
  </el-alert> 
 <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container" >
        <center><Adslogo :width="250" :height="250" style="margin:0 0;" /></center>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.username"
          :placeholder="'Operator'"
          name="username"
          type="text"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="loginForm.password"
          :type="passwordType"
          :placeholder="'Password'"
          name="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item prop="entity">
        <span class="svg-container">
          <svg-icon icon-class="building" />
        </span>
        <el-input
          v-model="loginForm.entity"
          :placeholder="'Entity'"
          name="entity"
          type="number"
          max="99"
          auto-complete="on"
        />
      </el-form-item>
      <el-button
        :id="'login_button'"
        :loading="loading > 0"
        type="primary"
        style="width:100%;margin-bottom:10px;"
        @click.native.prevent="handleLogin"
      >{{ loading===0? 'Log In':loading===1? 'Logging In...':loading===2?'Successfully Logged In':'Loggin Error' }}</el-button>
      <div class="title-container">
        <h3 class="title">Advanced Data Systems</h3>
      </div>
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import Adslogo from '@/components/Adslogo'
import { Loading } from 'element-ui';

export default {
  name: 'Login',
  components: {
    Adslogo
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('Please a valid operator code'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('Password cannot be empty'))
      } else {
        callback()
      }
    }
    const validateEntity = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('Entity cannot be empty'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        entity: 1
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        entity: [{ required: true, trigger: 'blur', validator: validateEntity }]
      },
      passwordType: 'password',
      loading: 0,
      showDialog: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  created() {
    const SES = this.$route.query.SES || this.getQueryVariable('SES')
    const JWT = this.$route.query.JWT || this.getQueryVariable('JWT');

    if (SES) {
      this.loading = true
     this.$loading();
      this.$store
        .dispatch('LoginBySES', SES)
        .then(() => {
          this.loading = false
          this.$router.push({
            path: this.redirect || '/',
            query: this.$route.query
          })
        })
        .catch(() => {
          this.loading = false
        })
    } else if (JWT){
      this.loading = 1
       Loading.service({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
       })
        this.$store
        .dispatch('app/setAppLoading', true)


      this.$store
        .dispatch('LoginByJWT', JWT)
        .then(() => {
          this.loading = 2
          this.$router.push({
            path: this.redirect || '/',
            query: this.$route.query
          })
        })
        .catch(() => {
          this.loading = 3
        })
    }


  },
  methods: {
    getQueryVariable(variable) {
      var query = window.location.search.substring(1)
      var vars = query.split('&')
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        if (decodeURIComponent(pair[0]) == variable) {
          return decodeURIComponent(pair[1])
        }
      }
    },

    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = 1
          this.$store
            .dispatch('LoginByUsername', this.loginForm)
            .then(() => {
              this.loading = 2
              this.$router.push({ path: this.redirect || '/' })
            })
            .catch(() => {
              this.loading = 3
            setTimeout(()=>{
                this.loading = 0;
              },1000)
            })
        } else {
          // console.log("error submit!!");
          return false
        }
      })
    },
    afterQRScan() {}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.international-icon {
  display: none;
}

$bg: #283443;
$light_gray: #eee;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    &::first-line {
      color: $light_gray;
    }
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 380px;
    max-width: 100%;
    padding: 20px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
}
</style>
