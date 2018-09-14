<template>
<div>
  <app-nav></app-nav>
    <!--navbar-->
<div class="py-5" v-if=" user_role==='avg_user' ">
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h2 class="">Manage Cards</h2>
       <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                  <b-form-group id="shortNameGroup"
                                label="Card's Short Name"
                                label-for="shortNameInput"
                                description="Please enter the Short Name of the Card">
                    <b-form-input id="shortNameInput"
                                  type="text"
                                  v-model="form.cardShortName"
                                  required
                                  placeholder="Enter name of Card">
                    </b-form-input>
                  </b-form-group>
                  <b-form-group id="numberGroup"
                                label="Card Number"
                                label-for="cardNumberInput"
                                description="Card Number">
                    <b-form-input id="cardNumberInput"
                                 type="text"
                                 placeholder="Card Number"
                                 v-model="form.cardNumber"
                                 ></b-form-input>
                    </b-form-input>
                  </b-form-group>
                <b-button type="submit" variant="primary">Submit</b-button>
                <b-button type="reset" variant="danger">Reset</b-button>
                <b-alert :show="showErrors" variant="danger">{{ form_error }}</b-alert>
                <b-alert show dismissible :show="successCreate">
                {{ create_message }}
                </b-alert>
              </b-form>
      </div>
    </div>
  </div>
</div>
<div class="py-5" v-if=" user_role==='avg_user' ">
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <b-table striped responsive :items="allCardsForUser">
        </b-table>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
  import axios from 'axios'
  import AppNav from './AppNav.vue'
    export default {
        components: {
          'app-nav': AppNav
        },
        data() {
          return {
            form: {
              cardShortName: "",
              cardNumber: ""
            },
            showErrors: false,
            form_error: "",
            successCreate: false,
            create_message: "",
            allCardsForUser: [],
            show: true,
            user_role:""

          }
        },
        created() {
          this.user_role = localStorage.getItem('user_role')
          var get_my_cards = process.env.API_URL + 'my_cards/'
          axios
            .get(get_my_cards, { headers: {
              "Authorization": localStorage.getItem('user_auth_token')
              }})
            .then(response => {
              var check_role = localStorage.getItem('user_role')
              if (check_role === 'avg_user'){
                if (response.status===200){
                  this.allCardsForUser = response.data;
                }
              }else{
                  this.$router.push('/forbidden');
                }
            })
            .catch(error => {
              var check_role = localStorage.getItem('user_role')
              if (check_role === 'avg_user'){
                if (error.response === undefined){
                  this.$router.push('/server_error');
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
              }else{
                this.$router.push('/forbidden');
                }
            })
        },
        methods: {
          onSubmit(evt) {
            evt.preventDefault();
            var projectCreatePath = process.env.API_URL + 'create_card/'
            axios
              .post(projectCreatePath, {
                'short_name': this.form.cardShortName,
                'number': this.form.cardNumber,
              }, {
                headers: {
                'Authorization': localStorage.getItem('user_auth_token')
                }})
              .then(response => {
                var check_role = localStorage.getItem('user_role')
                if (check_role === 'avg_user'){
                  if (response.status===200){
                    this.successCreate = true;
                    this.create_message = "Card successfully created";
                  }
                }else{
                  this.$router.push('/forbidden');
                }
              })
              .catch(error => {
                var check_role = localStorage.getItem('user_role')
                if (check_role === 'avg_user'){
                  if (error.response === undefined){
                    this.$router.push('/server_error');
                  }else if (error.response.status===400){
                    this.showErrors = true;
                    this.form_error = "Unable to create card"
                  }else if (error.response.status===401){
                    this.$router.push('/unauthorized');
                  }else if (error.response.status===403){
                    this.$router.push('/forbidden');
                  }else if (error.response.status===404){
                    this.$router.push('/not_found');
                  }
                }else{
                  this.$router.push('/forbidden');
                }
              })
          },
          onReset(evt) {
            evt.preventDefault();
            this.form.cardShortName = '';
            this.form.cardNumber = '';
            this.successCreate = false;
            this.create_message = '';
            this.showErrors = false;
            this.form_error = '';

          }
        }
     }
</script>

<style scoped>

</style>
