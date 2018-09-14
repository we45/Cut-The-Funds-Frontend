<template>
<div>
      <b-col md="6" class="my-1">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
        <b-table striped hover :items="expenseItems" :fields="fields" :current-page="currentPage"
             :per-page="perPage">
          <template slot="view" slot-scope="row">
            <b-button size="sm" class="mr-2" @click.stop="getItem(row.item, row.index)">View</b-button>
          </template>
        </b-table>
      </div>
</template>

<script>
  import axios from 'axios';
    export default {
      components: {
          'name': 'ExpenseTable'
        },
      data() {
        return {
          fields: ['id', 'name', 'reason', 'merchant', 'amount', 'project', 'approved', 'view'],
          expenseItems: [],
          show_details: true,
          currentPage:1,
          totalRows:0,
          perPage:5,
        }

      },
      created() {
        var project_fetch = process.env.API_URL + 'my_expenses/';
        axios
          .get(project_fetch, { headers: {
            "Authorization": localStorage.getItem('user_auth_token')
            }})
          .then(response => {
            if (response.status===200){
              this.expenseItems = response.data.expenses;
              this.totalRows = this.expenseItems.length;
            }else{
              this.$router.push('/forbidden');
            }
          })
          .catch(error => {
            if (error.response === undefined){
              this.$router.push('/server_error');
            }else if (error.response.status===401){
              this.$router.push('/unauthorized');
            }else if (error.response.status===403){
              this.$router.push('/forbidden');
            }else if (error.response.status===404){
              this.$router.push('/not_found');
            }
          })
      },
      methods: {
        getItem(item, index) {
          var url_push = "/single_expense/" + item.id
          this.$router.push(url_push)
        }
      }
    }
</script>

<style scoped>

</style>
