<template>
      <div>
        <b-col md="6" class="my-1">
          <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
        </b-col>
        <b-table striped hover :items="items" :current-page="currentPage"
             :per-page="perPage" v-if="user_role==='superuser' ">
          <template slot="show_details" slot-scope="row">
            <b-button size="sm" class="mr-2">Edit</b-button>
          </template>
        </b-table>
      </div>
</template>

<script>
    import axios from 'axios';

    export default {
        components: {
          'name': 'OrganizationTable'
        },
        data() {
          return {
            /*fields: ['name', 'num_users'],*/
            items: [],
            user_role:"",
            currentPage:1,
            totalRows:0,
            perPage:5,
          }
        },
        created() {
          this.user_role = localStorage.getItem('user_role')
          var org_path = process.env.API_URL + 'organizations/';
          axios
            .get(org_path, {
              headers: {
                "Authorization": localStorage.getItem('user_auth_token')
              }
            })
            .then(response => {
              var check_role = localStorage.getItem('user_role')
              if (check_role === 'superuser'){
                if (response.status===200){
                  this.items = response.data
                  this.totalRows = this.items.length;
                }
              }else{
                this.$router.push('/forbidden');
              }
            })
            .catch(error => {
              var check_role = localStorage.getItem('user_role')
              if (check_role === 'superuser'){
                if (error.response===undefined){
                this.$router.push('/server_error');
                  }
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
              }else{
                this.$router.push('/forbidden');
              }
            })
        },
    }
</script>

<style scoped>

</style>
