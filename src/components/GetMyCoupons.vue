<template>
    <div >
      <app-nav></app-nav>
      <b-container fluid class="py-5">
      <b-card border-variant="primary"
               header="List of Coupons for you"
               header-bg-variant="primary"
               header-text-variant="white"
               align="left">
               <b-col md="6" class="my-1">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
      <b-table striped hover :items="couponList" :current-page="currentPage" :per-page="perPage">
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
          couponList: [],
          currentPage:1,
          totalRows:0,
          perPage:5,

        }
      },
      created() {
        var approve_expense_path = process.env.API_URL + 'get_my_coupons/';
        axios
          .get(approve_expense_path, { headers: {
            "Authorization": localStorage.getItem('user_auth_token')
            }})
          .then(response => {
              this.couponList = response.data
              this.totalRows = this.couponList.length;
              console.log("AWS S3 KEY ID: AKIAJ5N6Q47LNNS62OWA")
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
      }
    }
</script>

<style scoped>

</style>
