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
                  <b-form @submit="onSubmit" @reset="onReset">

                    <b-form-group id="userNameGroup"
                                  label="Your Username" class='text-left'>
                      <b-form-input id="usernameInput"
                                    type="text"
                                    v-model="form.username"
                                    required
                                    placeholder="Enter Username">
                      </b-form-input>
                    </b-form-group>
                    <b-form-group id="passwordGroup" label="Your Password" class="text-left">
                      <b-form-input id="passwordInput"
                                    type="password"
                                    v-model="form.password"
                                    required
                                    placeholder="Enter Password">
                      </b-form-input>
                    </b-form-group >
                    <br>
                    <b-alert :show="showAuthErrors" variant="danger">{{ form_error }}</b-alert>
                    <b-button type="submit" variant="primary" size="md" block>Login</b-button>
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
    created() {
      localStorage.removeItem('user_auth_token')
      localStorage.removeItem('user_role')
      localStorage.removeItem('otp_register_token')
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault();
        var login_path = process.env.API_URL + 'login/';
        axios
          .post(login_path, {'username': this.form.username, 'password': this.form.password})
          .then(response => {
            if (response.data.preauth === true) {
              localStorage.setItem('pre_auth_token', response.data.token);
              this.$router.push('/validate_otp')
            }
            else  {
                // console.log(response.data)
                localStorage.setItem('user_auth_token', response.data.token);
                localStorage.setItem('user_role', response.data.role)
                this.$router.push('/home')
            }
          })
          .catch(error => {
            if (error.response.status === 400) {
              this.$router.push('/register_otp')
            } else if (error.response.status === 403) {
              this.showAuthErrors = true;
              this.form_error = 'Invalid credentials. Please try again';
              localStorage.removeItem('user_auth_token');
            } else {
              this.showAuthErrors = true;
              this.form_error = 'Invalid credentials. Please try again';
              localStorage.removeItem('user_auth_token');
            }

          })
      },
      onReset(evt) {
        evt.preventDefault();
        localStorage.removeItem('user_auth_token');
        this.form.username = '';
        this.form.password = '';
        this.showAuthErrors = false;
        this.form_error = '';

      }

    }

  }
</script>

<style scoped>

</style>
