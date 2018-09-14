<template>
    <div>
     <app-nav></app-nav>

    <div class="py-5">
      <b-container fluid>
            <div class="card">
              <div class="card-header"> Expense ID: {{ expID }}</div>
              <div class="card-body">
                <h4>{{ expName }}</h4>
                <h6 class="text-muted">{{ expMerchant }}</h6>
                <p class=" p-y-1">Nature of Expense: {{ expReason }}</p>
                <p class=" p-y-1">Amount in $: {{ expAmount }}</p>
                <p class=" p-y-1">Approved?: {{ expApproved }}</p>
              </div>
            </div>
        </b-container>
    </div>



    <div class="py-5">
      <b-container fluid>
            <h2 class="">Add Expense File</h2>
            <hr>
            <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                    <b-form-group id="fileGroup"
                                  label="Upload File"
                                  label-for="fileInput"
                                  description="Please upload file name" class="text-left">
                      <b-form-file id="fileInput"
                                    v-model="form.file"
                                    required
                                    placeholder="Upload File">
                      </b-form-file>
                    </b-form-group>
                    <b-form-group id="descriptionGroup"
                                  label="Description"
                                  label-for="descInput" class="text-left">
                      <b-form-input id="descInput"
                                    type="text"
                                    v-model="form.description"
                                    required
                                    placeholder="Enter Description">
                      </b-form-input>
                    </b-form-group>
                    <b-button type="submit" variant="primary">Submit</b-button>
                    <b-alert :show="showErrors" variant="danger">{{ form_error }}</b-alert>
                    <b-alert show dismissible :show="successCreate">{{ create_message }}
                </b-alert>
              </b-form>
            </b-container>
    </div>
    <div class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <b-table striped hover :items="expenseFileList"></b-table>
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import AppNav from './AppNav.vue'
    import axios from 'axios';
    export default {
      components: {
        'app-nav': AppNav
      },
        props: ['id'],
        data() {
          return {
            form: {
              file: null,
              description: ""
            },
            expenseFileList: [],
            expID: 0,
            expName: "",
            expMerchant: "",
            expReason:"",
            expAmount: 0,
            expApproved: false,
            show:true,
            showErrors: false,
            form_error: "",
            successCreate: false,
            create_message: ""
          }
        },
        created() {
          var specific_exp_path = process.env.API_URL + 'my_expenses/' + this.id + "/"
          axios
            .get(specific_exp_path, { headers: {
              'Authorization': localStorage.getItem('user_auth_token')
              }})
            .then(response => {
              if (response.status===200){
                this.expID = response.data.id;
                this.expName = response.data.name;
                this.expMerchant = response.data.merchant;
                this.expReason = response.data.reason;
                this.expAmount = response.data.amount;
                this.expApproved = response.data.approved;
              }
            })
            .catch(error => {
              if (error.response === undefined){
                location.href = '/server_error';
              }else if (error.response.status===400){
                  location.href = '/bad_request';
              }else if (error.response.status===401){
                  location.href = '/unauthorized';
              }else if (error.response.status===403){
                location.href = '/forbidden';
              }else if (error.response.status===404){
                location.href = '/not_found';
              }else if (error.response.status===500){
                  location.href = '/login';
              }else{
                  location.href = '/login';
              }
            })
        },
        mounted() {
          var specific_exp_path = process.env.API_URL + 'get_files_for_exp/' + this.id + "/"

          axios
            .get(specific_exp_path, { headers: {
              'Authorization': localStorage.getItem('user_auth_token')
              }})
            .then(response => {
              if (response.status===200){
                this.expenseFileList = response.data
              }
            })
            .catch(error => {
              if (error.response === undefined){
                location.href = '/server_error';
              }else if (error.response.status===400){
                  location.href = '/bad_request';
              }else if (error.response.status===401){
                  location.href = '/unauthorized';
              }else if (error.response.status===403){
                location.href = '/forbidden';
              }else if (error.response.status===404){
                location.href = '/not_found';
              }else if (error.response.status===500){
                  location.href = '/login';
              }else{
                  location.href = '/login';
              }
            })
        },
        methods: {
          onSubmit(evt) {
            evt.preventDefault();
            var projectCreatePath = process.env.API_URL + 'create_efile/'
            var form_data = new FormData()
            form_data.append('file', this.form.file)
            form_data.append('description', this.form.description)
            form_data.append('expense', parseInt(this.expID))
            axios
              .post(projectCreatePath, form_data, {
                headers: {
                'Authorization': localStorage.getItem('user_auth_token'),
                "Content-Type": 'multipart/form-data'
                }})
              .then(response => {
                if (response.status===200){
                  this.successCreate = true;
                  this.create_message = "Expense File successfully created";
                  console.log('http://analytics.hackertactic.com/main?route=valid call failed')
                }
              })
              .catch(error => {
                if (error.response === undefined){
                  location.href = '/server_error';
                }else if (error.response.status===400){
                    location.href = '/bad_request';
                }else if (error.response.status===401){
                    location.href = '/unauthorized';
                }else if (error.response.status===403){
                  location.href = '/forbidden';
                }else if (error.response.status===404){
                  location.href = '/not_found';
                }else if (error.response.status===500){
                    location.href = '/login';
                }else{
                    location.href = '/login';
                }
                this.showErrors = true;
                this.form_error = "Unable to create Expense File"
              })
          },
          onReset(evt) {
            evt.preventDefault();
            this.form.file = null;
            this.form.description = '';
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
