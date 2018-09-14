<template>
  <b-container class="bv-example-row py-5">
    <b-row class="vdivide">
        <b-col>
          <div class="card-body">
            <h3 class="mb-0 text-left">Register OTP</h3>
            <b-form @submit="onSubmit" @reset="onReset">

              <b-form-group id="userNameGroup"
                            label="Your Username:">
                <b-form-input id="usernameInput"
                              type="text"
                              v-model="form.username"
                              required
                              placeholder="Enter Username">
                </b-form-input>
              </b-form-group>
              <b-form-group id="passwordGroup" label="Your Password:">
                <b-form-input id="passwordInput"
                              type="password"
                              v-model="form.password"
                              required
                              placeholder="Enter Password">
                </b-form-input>
              </b-form-group>
              <b-alert :show="showAuthErrors" variant="danger">{{ form_error }}</b-alert>
              <b-button type="submit" variant="primary">Login</b-button>
            </b-form>
          </div>
        </b-col>
        <b-col>
          <div v-if="qrVisible">
            <p>{{ otp_code }}</p>
            <qrcode :value="otp_link" :options="{ size: 200 }"></qrcode>
            <p>Please use the Google Authenticator App to manually enter/scan QR Code. Enter the code that appears there.</p>
            <b-form @submit="onQrSubmit" @reset="onQrReset">

              <b-form-group id="otpGroup"
                            label="OTP Code as appears in Google Authenticator">
                <b-form-input id="otpCodeInput"
                              type="text"
                              v-model="otpForm.otpCode"
                              required
                              placeholder="Enter OTP Code from Mobile App">
                </b-form-input>
              </b-form-group>
              </b-form-group>
              <b-alert :show="showOtpAuthErrors" variant="danger">{{ otp_error }}</b-alert>
                <b-alert variant="success" :show="showOtpSuccess">OTP Linked Successfully! Proceed to login and authenticate to the app</b-alert>
              <b-button type="submit" variant="primary">Validate OTP</b-button>
            </b-form>
          </div>
        </b-col>
    </b-row>
</b-container>
</template>

<script>
    import VueQrcode from '@xkeshi/vue-qrcode';
    import axios from 'axios';
    export default {
      components: {
        'qrcode': VueQrcode
      },
      data() {
      return {
        form: {
          username: '',
          password: '',
        },
        showAuthErrors: false,
        form_error: '',
        otp_code: "",
        otp_link: "",
        qrVisible: false,
        otpForm: {
          otpCode: ""
        },
        showOtpAuthErrors: false,
        otp_error: "",
        showOtpSuccess: false

      }
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault();
        var login_path = process.env.API_URL + 'register_otp/';
        axios
          .post(login_path, {'username': this.form.username, 'password': this.form.password})
          .then(response => {
            this.otp_code = response.data.otp_token;
            this.otp_link = response.data.link;
            this.qrVisible = true;
            localStorage.setItem('otp_register_token', response.data.token);
          })
          .catch(error => {
            this.showAuthErrors = true;
            this.form_error = 'Invalid credentials. Please try again';
            console.log(error);
          })
      },
      onReset(evt) {
        evt.preventDefault();
        localStorage.removeItem('user_auth_token');
        this.form.username = '';
        this.form.password = '';
        this.showAuthErrors = false;
        this.form_error = '';

      },
      onQrSubmit(evt) {
        evt.preventDefault();
        var otp_path = process.env.API_URL + 'register_otp/';
        axios
          .put(otp_path, {'otp_pass': this.otpForm.otpCode}, {
            headers: {
              "Authorization": localStorage.getItem('otp_register_token')
            }
          })
          .then(response => {
            if (response.status===200){
             this.showOtpSuccess = true;
            }else{
              this.$router.push('/forbidden');
            }
          })
          .catch(error => {
            if (error.response === undefined){
              this.$router.push('/server_error');
            }else if (error.response.status===400){
              this.$router.push('/bad_request');
            }else if (error.response.status===401){
              this.$router.push('/unauthorized');
            }else if (error.response.status===403){
              this.$router.push('/forbidden');
            }else if (error.response.status===404){
              this.$router.push('/not_found');
            }else if (error.response.status===500){
              this.$router.push('/login');
            }else{
              this.$router.push('/login');
            }
            this.showOtpAuthErrors = true;
            this.otp_error = "OTP Sync failed for this user."
          })
      },
      onQrReset(evt) {
        evt.preventDefault();
        localStorage.removeItem('otp_register_token');
        this.otpForm.otpCode = ""
        this.showOtpAuthErrors = false;
        this.qrVisible = false;
        this.otp_error = '';

      }

    }
    }
</script>

<style scoped>
  .vdivide.row [class*='col-']:not(:last-child):after {
  background: #e0e0e0;
  width: 1px;
  content: "";
  display:block;
  position: absolute;
  top:0;
  bottom: 0;
  right: 0;
  min-height: 70px;
}
</style>
