<template>
 <div>
  <app-nav></app-nav>
    <!--navbar-->
    <div class="py-5" v-if=" user_role==='avg_user' ">
      <b-container fluid>
        <b-button @click="showModal" variant="primary">
              Add Expense
          </b-button>
          <br>
          <br>
        <b-card border-variant="primary"
               header="Expenses Master"
               header-bg-variant="primary"
               header-text-variant="white"
               align="left">
               <expense-table ref="exp_table"></expense-table>
        </b-card>
      </b-container>
    </div>


    <div class="py-5" v-if=" user_role==='avg_user' ">
      <div class="container">
        <div class="row">
          <div class="col-md-12">

            <b-modal ref="myModalRef" hide-footer title="Add Expense">
              <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                  <b-form-group id="nameGroup"
                                label="Expense Name"
                                label-for="nameInput"
                                description="Please enter the name of the Expense" class="text-left">
                    <b-form-input id="nameInput"
                                  type="text"
                                  v-model="form.expName"
                                  required
                                  placeholder="Enter name of Expense">
                    </b-form-input>
                  </b-form-group>
                  <b-form-group id="merchantGroup"
                                label="Expense Name"
                                label-for="merchantInput"
                                description="Please enter the merchant name" class="text-left">
                    <b-form-input id="merchantInput"
                                  type="text"
                                  v-model="form.expMerchant"
                                  required
                                  placeholder="Enter name of Merchant">
                    </b-form-input>
                  </b-form-group>
                  <b-form-group id="amountGroup"
                                label="Expense Amount"
                                label-for="amountInput"
                                description="Please enter the amount of the expense" class="text-left">
                    <b-form-input id="amountInput"
                                  type="text"
                                  v-model="form.expAmount"
                                  required
                                  placeholder="Enter Amount">
                    </b-form-input>
                  </b-form-group>
                  <br>
                  <b-form-group id="natureGroup"
                                label="Nature of Expense"
                                label-for="natureInput" class="text-left">
                    <b-form-select id="natureInput"
                                  :options="natureChoices"
                                  required
                                  v-model="form.expNature">
                    </b-form-select>
                    </b-form-group>
                    <b-form-group id="projectGroup"
                                label="Project"
                                label-for="projectInput" class="text-left">
                    <b-form-select id="projectInput"
                                  :options="projectList"
                                  required
                                  v-model="form.expProject">
                    </b-form-select>
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
  import ExpenseTable from './ExpenseTable.vue'
  import AppNav from './AppNav.vue'
  import axios from 'axios'
    export default {
      components: {
        'expense-table': ExpenseTable,
        'app-nav': AppNav
      },
      data() {
        return {
          form: {
            expName: "",
            expMerchant: "",
            expNature: "",
            expAmount: 0,
            expProject: 0,
          },
          showExpErrors: false,
          form_error: "",
          natureChoices: ['Food and Entertainment', 'Travel', 'Fuel Expenditure', 'Other Consumables'],
          show: true,
          projectList: [],
          showSuccessMessage: false,
          success_message: "",
          user_role:""
        }
      },
      created() {
        this.user_role = localStorage.getItem('user_role')
        var project_fetch = process.env.API_URL + 'projects/';
        axios
          .get(project_fetch, { headers: {
            "Authorization": localStorage.getItem('user_auth_token')
            }})
          .then(response => {
          var check_role = localStorage.getItem('user_role')
          if (check_role === 'avg_user'){
            if (response.status===200){
              var project_map = response.data.projects;
              for (var single in project_map) {
                this.projectList.push({value: project_map[single].id, text: project_map[single].name})
              }
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
              }
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
            var expense_add_path = process.env.API_URL + 'create_expense/'
            axios
              .post(expense_add_path, {
                'name': this.form.expName,
                'reason': this.form.expNature,
                'merchant': this.form.expMerchant,
                'amount': parseFloat(this.form.expAmount),
                'project': parseInt(this.form.expProject)
              }, { headers: {
                'Authorization': localStorage.getItem('user_auth_token')
                }})
              .then(response => {
                var check_role = localStorage.getItem('user_role')
                if (check_role === 'avg_user'){
                  if (response.status===200){
                    this.showSuccessMessage = true;
                    this.success_message = 'Expense created successfully'
                    this.showExpErrors = false;
                    this.form_error = ''
                    this.$refs.exp_table.refresh()
                  }
                }else{
                  this.$router.push('/forbidden');
                }

              })
              .catch(error => {
                var check_role = localStorage.getItem('user_role')
                if (check_role === 'avg_user'){
                  if (error.response.status===400){
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
          }
      }
    }
</script>

<style scoped>

</style>
