<template>
    <div>
      <b-alert :show="showErrors" variant="danger">{{ form_error }}</b-alert>
      <pie-chart :data="chartData" :donut="true" :legend="false"></pie-chart>
    </div>
</template>

<script>
  import axios from 'axios'
  import Chartkick from 'chartkick'
  import VueChartkick from 'vue-chartkick'

  export default {
    components:{
      "name":'ExpenseVisualization'
    },
    data() {

      return {
        expenseItems:{},
        chartData: [],
        showErrors: false,
        form_error: "",

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
              this.expenseItems = JSON.parse(response.data.analytics);
              for (var i = 0; i < this.expenseItems.length; i++) {
                this.chartData.push([this.expenseItems[i].reason, this.expenseItems[i].the_count])
            }
          }else{
            this.$router.push('/forbidden');
          }
        })
        .catch(error => {
          var check_role = localStorage.getItem('user_role')
          if (check_role === 'avg_user'){
            if (error.response.status===400){
              this.showErrors = true;
              this.form_error = "No data to populate chart."
            }else if (error.response.status===401){
              this.$router.push('/unauthorized');
            }else if (error.response.status===403){
              this.$router.push('/forbidden');
            }else if (error.response.status===404){
              this.$router.push('/not_found');
            }else if (error.response.status===500){
              this.showErrors = true;
              this.form_error = "Unable to populate chart."
            }else{
              this.showErrors = true;
              this.form_error = "Unable to populate chart."
            }
          }else{
            this.$router.push('/forbidden');
          }
        })
    },
  }

</script>

<style scoped>

</style>
