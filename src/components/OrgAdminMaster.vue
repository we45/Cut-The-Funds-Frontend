<template>
 <div>
  <app-nav></app-nav>
    <!--navbar-->
    <div class="py-5" v-if="user_role==='superuser' ">
        <b-container fluid>
          <b-button @click="showModal" variant="outline-primary" size="md" key-nav="left">
              Add Organization Admin Users
          </b-button>
            <br>
            <br>
            <b-card border-variant="primary"
               header="List of Organization Users"
               header-bg-variant="primary"
               header-text-variant="white"
               align="left">
                <org-admin-table></org-admin-table>
            </b-card>
        </b-container>
    </div>
    <div class="py-5" v-if="user_role==='superuser' ">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <b-button @click="showModal">
              Add Organization Admin Users
          </b-button>
            <b-modal ref="myModalRef" hide-footer title="Add Org Admin Users">
              <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                  <b-form-group id="nameGroup"
                                label="Username"
                                label-for="userNameInput"
                                description="Please enter the username">
                    <b-form-input id="nameInput"
                                  type="text"
                                  v-model="form.orgAdminUsername"
                                  required
                                  placeholder="Enter name of Expense">
                    </b-form-input>
                  </b-form-group>
                  <b-form-group id="emailGroup"
                                label="Email"
                                label-for="emailInput"
                                description="Please enter the email">
                    <b-form-input id="emailInput"
                                  type="email"
                                  v-model="form.orgAdminEmail"
                                  required
                                  placeholder="Enter email of the Org Admin">
                    </b-form-input>
                  </b-form-group>
                  <b-form-group id="designationGroup"
                                label="Designation"
                                label-for="desInput"
                                description="Please enter the Designation of the User">
                    <b-form-input id="desInput"
                                  type="text"
                                  v-model="form.orgAdminDesignation"
                                  required
                                  placeholder="Enter Designation">
                    </b-form-input>
                  </b-form-group>
                    <b-form-group id="orgGroup"
                                label="Organization:"
                                label-for="orgInput">
                    <b-form-select id="orgInput"
                                  :options="orgList"
                                  required
                                  v-model="form.orgAdminOrg">
                    </b-form-select>
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
  import OrgAdminTable from './OrgAdminTable.vue'
  import AppNav from './AppNav.vue'
  import axios from 'axios'
    export default {
      components: {
        'org-admin-table': OrgAdminTable,
        'app-nav': AppNav
      },
      data() {
        return {
          form: {
            orgAdminUsername: "",
            orgAdminEmail: "",
            orgAdminDesignation: "",
            orgAdminOrg: ""
          },
          showErrors: false,
          form_error: "",
          show: true,
          orgList: [],
          showSuccessMessage: false,
          success_message: "",
          user_role:""
        }
      },
      created() {
        this.user_role = localStorage.getItem('user_role')
        var project_fetch = process.env.API_URL + 'organizations/';
        axios
          .get(project_fetch, { headers: {
            "Authorization": localStorage.getItem('user_auth_token')
            }})
          .then(response => {
            var check_role = localStorage.getItem('user_role')
            if (check_role === 'superuser'){
              if (response.status===200){
                var org_map = response.data;
                for (var single in org_map) {
                  console.log("Single" + single)
                  this.orgList.push({value: org_map[single].shortname, text: org_map[single].name})
                }
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
            }else{
              this.$router.push('/forbidden');
            }
          })
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
            var expense_add_path = process.env.API_URL + 'create_org_admin/'
            axios
              .post(expense_add_path, {
                'username': this.form.orgAdminUsername,
                'email': this.form.orgAdminEmail,
                'designation': this.form.orgAdminDesignation,
                'organization': this.form.orgAdminOrg
              }, { headers: {
                'Authorization': localStorage.getItem('user_auth_token')
                }})
              .then(response => {
                var check_role = localStorage.getItem('user_role')
                if (check_role === 'superuser'){
                  if (response.status===200){
                    this.showSuccessMessage = true;
                    this.success_message = 'Org Admin User created successfully'
                    this.showErrors = false;
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
                  this.form_error = 'Failed to create Org Admin User'
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
