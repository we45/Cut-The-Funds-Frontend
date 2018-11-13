<template>
    <div class="container py-5">
    <div class="row">
      <div class="col-md-12">
        <h2 class="text-center mb-4">Cut The Funds Expense Management App</h2>
         <div class="row">
           <div class="col-md-6 mx-auto">
              <div class="card rounded-0">
                  <div class="card-header">
                    <h3 class="mb-0 text-left">Login</h3>
                  </div>
                <div class="card-body">
                  <b-form @submit.prevent="onSubmit" method="post">
                      <p v-if="errors.length">
                        <ul>
                          <li v-for="error in errors" style="color: #F44336;">{{ error }}</li>
                        </ul>
                      </p>
                    <b-form-group id="userNameGroup"
                                  label="Your Email" class='text-left'>
                      <b-form-input id="usernameInput"
                                    type="text"
                                    required
                                    v-model="email"
                                    placeholder="Enter Email">
                      </b-form-input>
                    </b-form-group>
                    <b-form-group id="passwordGroup" label="Your Password" class="text-left">
                      <b-form-input id="passwordInput"
                                    type="password"
                                    required
                                    v-model="password"
                                    placeholder="Enter Password">
                      </b-form-input>
                    </b-form-group >
                    <br>
                    <b-button type="submit" variant="primary" size="md" block >Login</b-button>
                  </b-form>
                </div>
              </div>
           </div>
         </div>
      </div>
  </div>
  </div>
</template>

<script>
import conf from '../../../configure.json'
  import axios from 'axios'
    export default {
      name: 'Login',
      data() {
        return {
          email: '',
          password: '',
          errors:[]
        }
      },
      mounted() {
          const token = localStorage.getItem('token')
          if (token != null) {
            this.$router.push({path: '/home'})
          } else {
            this.$router.push({path: '/'})
          }
      },
      methods: {

        onSubmit() {
        let api_url = conf.API_URL
          let fullLoginUrl = api_url+'/users/login/'
          const formData = {
            email: this.email,
            password: this.password
          }
          this.errors = [];
          if(!this.email) this.errors.push("Email required.");
          if(!this.password) this.errors.push("Password required.");
          axios.post(fullLoginUrl, {
              email: this.email,
              password: this.password
            })
           .then(res => {
          localStorage.setItem('email', res.data.email)
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userType', res.data.userType)
           let token = localStorage.getItem('token')
          if (token != null) {
              window.location.href = "/home"
              // this.$router.push({path: '/home'})
            } else {
              this.$router.push({path: '/'})
              // this.$router.push({path: '/'})
              this.errors.push('Invalid Email or Password')
            }
        }).catch(error => {
             this.errors.push('Invalid Email or Password')
            this.$router.push({path: '/'})
        })
          // this.$store.dispatch('login', formData).then(res => {
          //   let myVar = setInterval(myTimer, 1000);
          //   let token = localStorage.getItem('token')
          //   console.log(token)
          //   if (token != null) {
          //     window.location.href = "/home"
          //     // this.$router.push({path: '/home'})
          //   } else {
          //     this.$router.push({path: '/'})
          //     // this.$router.push({path: '/'})
          //     this.errors.push('Invalid Email or Password')
          //   }
          // }).catch(() => {
          //   this.errors.push('Invalid Email or Password')
          //   this.$router.push({path: '/'})
          // })
        }
      }
    }
</script>

<style scoped>

</style>
