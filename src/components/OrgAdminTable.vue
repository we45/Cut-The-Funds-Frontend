<template>
      <div>
        <b-col md="6" class="my-1">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
        <b-table striped hover :items="obj_admin_items" :current-page="currentPage"
             :per-page="perPage">
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
          'name': 'OrgAdminTable'
        },
        data() {
          return {
            /*fields: ['name', 'num_users'],*/
            obj_admin_items: [],
            currentPage:1,
            totalRows:0,
            perPage:5,
          }
        },
        created() {
          var org_path = process.env.API_URL + 'org_admins/';
          axios
            .get(org_path, {
              headers: {
                "Authorization": localStorage.getItem('user_auth_token')
              }
            })
            .then(response => {
              if (response.status===200){
                this.obj_admin_items = response.data.users
                this.totalRows = this.obj_admin_items.length;
              }else{
                this.$router.push('/forbidden');
              }
            })
            .catch(error => {
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
            })
        },
    }
</script>

<style scoped>

</style>
