<template>
    <div >
      <app-nav></app-nav>
      <b-container fluid class="py-5" v-if="user_role==='org_admin' ">
      <b-card border-variant="primary"
               header="List of Unapproved Expenses"
               header-bg-variant="primary"
               header-text-variant="white"
               align="left">
               <b-col md="6" class="my-1">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>


      <b-table striped hover :items="expList" :fields="fields" :current-page="currentPage"
             :per-page="perPage" ref="approveTable">
        <template slot="approve" slot-scope="row">
          <b-button size="sm" class="mr-2" @click.stop="approveItem(row.item, row.index)" variant="success">Approve</b-button>
        </template>
      </b-table>
    </b-card>
  </b-container>
    </div>
</template>

<script>
    import axios from 'axios';
    import swal from 'sweetalert';
    import AppNav from './AppNav.vue'
    export default {
      components:{
        'app-nav': AppNav
      },
      data() {
        return {
          expList: [],
          fields: ['id','name', 'reason', 'merchant', 'amount', 'project', 'user', 'approve'],
          currentPage:1,
          totalRows:0,
          perPage:5,
          user_role:"",
        }
      },
      created() {
        this.user_role = localStorage.getItem('user_role')
        var approve_expense_path = process.env.API_URL + 'project_expenses/';
        axios
          .get(approve_expense_path, { headers: {
            "Authorization": localStorage.getItem('user_auth_token')
            }})
          .then(response => {
            var check_role = localStorage.getItem('user_role')
            if (check_role === 'org_admin'){
              if (response.status===200){
                this.expList = response.data.expenses
                this.totalRows = this.expList.length;
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
        approveItem(item, index) {
          swal("Are you sure you want to approve this expense?", {
            buttons: ["Oh noez!", true],
          })
            .then((value) => {
              if (value === true) {
                var approve_path = process.env.API_URL + 'approve_expense/' + item.id + "/"
                axios
                  .get(approve_path, { headers: {
                    "Authorization": localStorage.getItem('user_auth_token')
                    }})
                  .then(response => {
                    var check_role = localStorage.getItem('user_role')
                    if (check_role === 'org_admin'){
                      if (response.status===200){
                      swal("Successfully Approved Expense ID: " + item.id + "!", "success")
                      // this.$refs.approveTable.refresh()
                      location.reload();
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
                          swal("Error Approving Expense ID: " + item.id + " :( ", "error")
                      }else if (error.response.status===401){
                          this.$router.push('/unauthorized');
                      }else if (error.response.status===403){
                        this.$router.push('/forbidden');
                      }else if (error.response.status===404){
                        this.$router.push('/not_found');
                      }

                    }else {
                      this.$router.push('/forbidden');
                    }
                  })
              }
              else {
                console.log("Selected Value False")
              }
            })
        }
      }
    }
</script>

<style scoped>

</style>
