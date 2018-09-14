<template>
   <div>
      <app-nav></app-nav>
      <!--navbar-->
      <div class="py-5" v-if=" user_role==='org_admin' ">
         <b-container fluid>
            <b-button @click="showModal" variant="outline-primary" size="md" key-nav="left">
               Add Project
            </b-button>
            <br>
            <br>
            <b-card border-variant="primary"
               header="List of Projects"
               header-bg-variant="primary"
               header-text-variant="white"
               align="left">
               <project-table></project-table>
            </b-card>
            <b-modal ref="myModalRef" hide-footer title="Add Project">
               <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                  <b-form-group id="nameGroup"
                     label="Project Name"
                     label-for="nameInput"
                     description="Please enter the name of the Project" class="text-left">
                     <b-form-input id="nameInput"
                        type="text"
                        v-model="form.projectName"
                        required
                        placeholder="Enter name of Project">
                     </b-form-input>
                  </b-form-group>
                  <b-form-group id="descriptionGroup"
                     label="Project Description"
                     label-for="descriptionInput"
                     description="Description" class="text-left">
                     <b-form-textarea id="descriptionInput"
                        type="text"
                        placeholder="Description for Project"
                        :rows="3"
                        v-model="form.projectDesc"
                        :max-rows="6"></b-form-textarea>
                     </b-form-input>
                  </b-form-group>
                  <b-form-group id="limitsGroup"
                     label="Limits per Expense Item"
                     label-for="limitsInput">
                     <b-form-input id="nameInput"
                        type="text"
                        v-model="form.projectLimit"
                        required
                        placeholder="Enter Limits per Expense Item in the Project"></b-form-input>
                  </b-form-group>
                  <b-button type="submit" variant="primary">Submit</b-button>
                  <b-button type="reset" variant="danger">Reset</b-button>
                  <b-alert :show="showProjErrors" variant="danger">{{ form_error }}</b-alert>
                  <b-alert show dismissible :show="successProjCreate">
                     {{ proj_create_message }}
                  </b-alert>
               </b-form>
            </b-modal>
         </b-container>
      </div>
   </div>
</template>
<script>
   import ProjectTable from './ProjectTable.vue'
   import axios from 'axios';
   import AppNav from './AppNav.vue'
     export default {
         components: {
           'project-table': ProjectTable,
           'app-nav': AppNav
         },
         data() {
           return {
             form: {
               projectName: "",
               projectDesc: "",
               projectLimit:"",
             },
             form_error: "",
             showProjErrors: false,
             successProjCreate: false,
             proj_create_message: "",
             show:true,
             user_role:""

           }
         },
         created() {
       // is_token_present = localStorage.getItem('user_auth_token')
       this.user_role = localStorage.getItem('user_role')
     },
         methods: {
           showModal() {
             this.$refs.myModalRef.show();
           },
           hideModal() {
             this.$refs.myModalRef.hide();
           },
           onSubmit(evt) {
             evt.preventDefault();
             var projectCreatePath = process.env.API_URL + 'create_project/'
             axios
               .post(projectCreatePath, {
                 'name': this.form.projectName,
                 'description': this.form.projectDesc,
                 'limit_per_item': parseFloat(this.form.projectLimit)
               }, {
                 headers: {
                 'Authorization': localStorage.getItem('user_auth_token')
                 }})
               .then(response => {
                if (response.status===200){
                 this.successProjCreate = true;
                 this.proj_create_message = "Project successfully created";
                }else{
                  this.$router.push('/forbidden');
                }
               })
               .catch(error => {
                var check_role = localStorage.getItem('user_role')
                if (check_role === 'org_admin'){
                if (error.response === undefined){
                  this.$router.push('/server_error');
                }else if (error.response.status===400){
                  this.showProjErrors = true;
                  this.form_error = "HTTP 400 Unable to create project"
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
             this.form.projectName = '';
             this.form.projectDesc = '';
             this.form.projectLimit = '';
             this.successProjCreate = false;
             this.proj_create_message = '';
             this.showProjErrors = false;
             this.form_error = '';

           }
         }
     }
</script>
<style scoped>
</style>
