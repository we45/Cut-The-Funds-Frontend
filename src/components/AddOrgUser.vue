<template>
   <div>
      <app-nav></app-nav>
      <!--navbar-->
      <div class="py-5" v-if="user_role==='org_admin' ">
         <b-container fluid>
          <b-button @click="showModal" variant="primary" >
                     Add User
                  </b-button>
           <br>
            <br>
            <b-card border-variant="primary"
               header="List of Users"
               header-bg-variant="primary"
               header-text-variant="white"
               align="left">
               <org-user-table></org-user-table>
            </b-card>
         </b-container>
      </div>
      <div class="py-5" v-if="user_role==='org_admin' ">
         <div class="container">
            <div class="row">
               <div class="col-md-12">

                  <b-modal ref="myModalRef" hide-footer title="Add User">
                     <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                        <b-form-group id="nameGroup"
                           label="Username"
                           label-for="userNameInput"
                           description="Please enter the username" class="text-left">
                           <b-form-input id="nameInput"
                              type="text"
                              v-model="form.orgUsername"
                              required
                              placeholder="username">
                           </b-form-input>
                        </b-form-group>
                        <b-form-group id="emailGroup"
                           label="Email"
                           label-for="emailInput"
                           description="Please enter the email" class="text-left">
                           <b-form-input id="emailInput"
                              type="email"
                              v-model="form.orgEmail"
                              required
                              placeholder="Enter email">
                           </b-form-input>
                        </b-form-group>
                        <b-form-group id="designationGroup"
                           label="Designation"
                           label-for="desInput"
                           description="Please enter the Designation" class="text-left">
                           <b-form-input id="desInput"
                              type="text"
                              v-model="form.orgDesignation"
                              required
                              placeholder="Enter Designation">
                           </b-form-input>
                        </b-form-group>
                        <b-button type="submit" variant="primary">Submit</b-button>
                        <b-button type="reset" variant="danger">Reset</b-button>
                        <b-alert :show="showErrors" variant="danger">{{ form_error }}</b-alert>
                        <b-alert :show="showSuccessMessage">{{ success_message }}</b-alert>
                     </b-form>
                  </b-modal>
                  <!--table-->
               </div>
            </div>
         </div>
      </div>


   </div>
</template>
<script>
   import OrgUserTable from './OrgUserTable.vue'
   import AppNav from './AppNav.vue'
   import axios from 'axios'
     export default {
       components: {
         'org-user-table': OrgUserTable,
         'app-nav': AppNav
       },
       data() {
         return {
           form: {
             orgUsername: "",
             orgEmail: "",
             orgDesignation: ""
           },
           showErrors: false,
           form_error: "",
           show: true,
           showSuccessMessage: false,
           success_message: "",
           org_map:[],
           user_role:""
         }
       },
       created() {
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
             var expense_add_path = process.env.API_URL + 'create_org_user/'
             axios
               .post(expense_add_path, {
                 'username': this.form.orgUsername,
                 'email': this.form.orgEmail,
                 'designation': this.form.orgDesignation
               }, { headers: {
                 'Authorization': localStorage.getItem('user_auth_token')
                 }})
               .then(response => {
                var check_role = localStorage.getItem('user_role')
                if (check_role === 'org_admin'){
                  if (response.status===200){
                   this.showSuccessMessage = true;
                   this.success_message = 'Org User created successfully'
                   this.showErrors = false;
                   this.form_error = ''
                  }
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
                    this.showExpErrors = true;
                    this.form_error = 'Failed to create Org User'
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
           onReset() {
             evt.preventDefault();
           }
       }
     }
</script>
<style scoped>
</style>
