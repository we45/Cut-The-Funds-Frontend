<template>
      <div>
        <b-col md="6" class="my-1">
          <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
        </b-col>
        <b-table striped hover :items="obj_user_items" :current-page="currentPage"
             :per-page="perPage" v-if="user_role==='org_admin' " >
        </b-table>
      </div>
</template>

<script>
    import axios from 'axios';
    export default {
        components: {
          'name': 'OrgUserTable'
        },
        data() {
          return {
            /*fields: ['name', 'num_users'],*/
            obj_user_items: [],
            user_role:"",
            currentPage:1,
            totalRows:0,
            perPage:5,
          }
        },
        created() {
          this.user_role = localStorage.getItem('user_role')
          var org_path = process.env.API_URL + 'get_org_users/';
          axios
            .get(org_path, {
              headers: {
                "Authorization": localStorage.getItem('user_auth_token')
              }
            })
            .then(response => {
              var check_role = localStorage.getItem('user_role')
              if (check_role === 'org_admin'){
                if (response.status===200){
                  this.obj_user_items = response.data
                  this.totalRows = this.obj_user_items.length;
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
                  this.$router.push('/bad_request');
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
    }
</script>

<style scoped>

</style>
