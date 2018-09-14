<template>
    <div class="container py-5">
    <div class="row">
      <div class="col-md-12">
        <h2 class="text-center mb-4">Validate OTP</h2>
         <div class="row">
           <div class="col-md-6 mx-auto">
              <div class="card rounded-0">
                  <div class="card-header">
                    <h3 class="mb-0 text-left">Login</h3>
                  </div>
                <div class="card-body">
                  <b-form @submit="onSubmit" @reset="onReset">

                    <b-form-group id="otpGroup" label="OTP as synchronized with your Google Authenticator App">
                      <br>
                      <b-form-input id="otpInput"
                                    type="text"
                                    v-model="form.otp_code"
                                    required
                                    placeholder="Enter OTPCode">
                      </b-form-input>
                    </b-form-group>
                    <b-alert :show="showAuthErrors" variant="danger">{{ form_error }}</b-alert>
                    <br>
                    <b-button type="submit" variant="primary" size="md" block>Validate OTP Code</b-button>
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

    data() {
      return {
        form: {
          username: '',
          password: '',
        },
        showAuthErrors: false,
        form_error: ''

      }
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault();
        var login_path = process.env.API_URL + 'validate_otp/';
        axios
          .post(login_path, {'otp_code': parseInt(this.form.otp_code)}, {
            headers: {
              "Authorization": localStorage.getItem("pre_auth_token")
            }
          })
          .then(response => {
            localStorage.setItem('user_auth_token', response.data.token)
            localStorage.setItem('user_role', response.data.role)
            localStorage.removeItem('pre_auth_token')
            this.$router.push('/home')
          })
          .catch(error => {
            this.showAuthErrors = true;
            this.form_error = 'Invalid OTP Code. Please try again';
            console.log(error.response);
          })
      },
      onReset(evt) {
        evt.preventDefault();
        this.form.otp_code = '';
        this.showAuthErrors = false;
        this.form_error = '';

      }

    }

  }
</script>

<style scoped>

</style>
