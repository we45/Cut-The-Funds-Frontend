<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-md-12">
        <h2 class="text-center mb-4">Cut The Funds Expense Management App</h2>
         <div class="row">
           <div class="col-md-6 mx-auto">
              <div class="card rounded-0">
                  <div class="card-header">
                    <h3 class="mb-0">Change/Reset Password</h3>
                    <b-alert :show="showExpErrors" variant="danger">{{ exp_error }}</b-alert>
                  </div>
                <div class="card-body" v-if="show">
                  <b-form @submit="onSubmit" @reset="onReset">

                    <b-form-group id="passwordGroup" label="Your Password:">
                      <b-form-input id="passwordInput"
                                    type="password"
                                    v-model="form.password"
                                    required
                                    placeholder="Enter Password">
                      </b-form-input>
                    </b-form-group>
                    <b-form-group id="passwordGroup2" label="Verify Password:">
                      <b-form-input id="passwordInput2"
                                    type="password"
                                    v-model="form.verify_password"
                                    required
                                    placeholder="Verify Password">
                      </b-form-input>
                    </b-form-group>
                    <b-alert :show="showAuthErrors" variant="danger">{{ form_error }}</b-alert>
                    <b-alert :show="showSuccess">{{ form_success }}</b-alert>
                    <b-button type="submit" variant="primary">Set Password</b-button>
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
  import axios from 'axios'

  export default {
    props: ['url_token'],
    data() {
      return {
        form: {
          password: '',
          verify_password: '',
        },
        showAuthErrors: false,
        form_error: '',
        password_link: '',
        show: false,
        showExpErrors: false,
        exp_error: '',
        showSuccess: false,
        form_success: ''

      }
    },
    created() {
      localStorage.removeItem('user_auth_token')
      localStorage.removeItem('user_role')
      localStorage.removeItem('otp_register_token')
      console.log(this.$router.params)
      var validate_password_link = process.env.API_URL + 'set_reset_pwd/' + this.url_token
      axios
        .get(validate_password_link)
        .then(response => {
          this.show = true;
        }).catch(error => {
          if (error.response.status === 404) {
            this.showExpErrors = true;
            this.exp_error = 'Password link has expired. Please try again.'
          }
      })

    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault();
        var password_reset_post = process.env.API_URL + 'set_reset_pwd/' + this.url_token + "/"
        axios
          .post(password_reset_post, {'password': this.form.password, 'verify_password': this.form.verify_password})
          .then(response => {
            this.showSuccess = true;
            this.form_success = 'Successfully changed password. Please setup TFA as required and login'
          })
          .catch(error => {
              if (error.response.status === 400) {
                this.showAuthErrors = true;
                this.form_error = 'Password keys failed validate or fields do not match'
              }
              else if (error.response.status === 403) {
                this.showAuthErrors = true;
                this.form_error = 'Password Link expired'
              }
              else {
                console.log(error)
              }
          })
      },
      onReset(evt) {
        evt.preventDefault();
        this.showAuthErrors=false,
        this.form_error='',
        this.password_link='',
        this.showExpErrors=false,
        this.exp_error='',
        this.showSuccess=false,
        this.form_success=''
      }

    }

  }
</script>

<style scoped>

</style>
