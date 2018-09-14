<template>
   <div>
      <app-nav></app-nav>
      <!--navbar-->
      <div class="py-5" v-if=" user_role==='superuser' ">
        <b-container fluid>
          <b-button @click="showModal" variant="outline-primary" size="md" key-nav="left">
               Add Organization
            </b-button>
            <br>
            <br>
            <b-card border-variant="primary"
               header="List of Organizations"
               header-bg-variant="primary"
               header-text-variant="white"
               align="left">
                <org-table></org-table>
            </b-card>
        </b-container>



      </div>
      <div class="py-5" v-if=" user_role==='superuser' ">
         <div class="container">
            <div class="row">
               <div class="col-md-12">
                  <b-button @click="showModal">
                     Add Organization
                  </b-button>
                  <b-modal ref="myModalRef" hide-footer title="Add Organization">
                     <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                        <b-form-group id="nameGroup"
                           label="Organization Name"
                           label-for="nameInput"
                           description="Please enter the name of the Organization">
                           <b-form-input id="nameInput"
                              type="text"
                              v-model="form.orgName"
                              required
                              placeholder="Enter name of Organization">
                           </b-form-input>
                        </b-form-group>
                        <b-form-group id="numGroup"
                           label="Number of Users"
                           label-for="numInput"
                           description="Please enter the number of users">
                           <b-form-input id="numInput"
                              type="text"
                              v-model="form.numUsers"
                              required
                              placeholder="Enter Number of Users">
                           </b-form-input>
                        </b-form-group>
                        <b-button type="submit" variant="primary">Submit</b-button>
                        <b-button type="reset" variant="danger">Reset</b-button>
                        <b-alert :show="showExpErrors" variant="danger">{{ form_error }}</b-alert>
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
   import OrganizationTable from './OrganizationTable.vue'
   import AppNav from './AppNav.vue'
   import axios from 'axios'
     export default {
       components: {
         'org-table': OrganizationTable,
         'app-nav': AppNav
       },
       data() {
         return {
           form: {
             orgName: "",
             numUsers: 0,
           },
           showExpErrors: false,
           form_error: "",
           show: true,
           showSuccessMessage: false,
           success_message: "",
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
             var expense_add_path = process.env.API_URL + 'organizations/'
             axios
               .post(expense_add_path, {
                 'name': this.form.orgName,
                 'num_users': parseInt(this.form.numUsers),
               }, { headers: {
                 'Authorization': localStorage.getItem('user_auth_token')
                 }})
               .then(response => {
                var check_role = localStorage.getItem('user_role')
                if (check_role === 'superuser'){
                  if (response.status===200){
                   this.showSuccessMessage = true;
                   this.success_message = 'Organization created successfully'
                   this.showExpErrors = false;
                   this.form_error = ''
                 }
                }else{
                  this.$router.push('/forbidden');
                }
               })
               .catch(error => {
                var check_role = localStorage.getItem('user_role')
                if (check_role === 'superuser'){
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
                  this.showExpErrors = true;
                  this.form_error = 'Failed to create expense'
                }else{
                  this.$router.push('/forbidden');
                }
               })
           },
           onReset() {
             evt.preventDefault();
             this.form.orgName = '';
             this.form.numUsers = 0;
           }
       }
     }
</script>
<style scoped>
</style>
