<template>
<div>
    <b-col md="6" class="my-1">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
        <b-table striped hover :items="projectItems" :fields="fields" :current-page="currentPage"
             :per-page="perPage">
          <!-- <template slot="edit" scope="row"> -->
            <!-- <b-button size="sm" class="mr-2">Edit</b-button> -->
          <!-- </template> -->
        </b-table>
      </div>
</template>

<script>
  import axios from 'axios';
    export default {
      components: {
          'name': 'ProjectTable'
        },
      data() {
        return {
          fields: ['id', 'name','manager', 'limit'],
          projectItems: [],
          show_details: true,
          currentPage:1,
          totalRows:0,
          perPage:5,
        }

      },
      created() {
        var project_fetch = process.env.API_URL + 'projects/';
        axios
          .get(project_fetch, { headers: {
            "Authorization": localStorage.getItem('user_auth_token')
            }})
          .then(response => {
            var check_role = localStorage.getItem('user_role')
            if (check_role==='org_admin'){
              if (response.status===200){
                this.projectItems = response.data.projects;
                this.totalRows = this.projectItems.length;
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
              }
            }else{
              this.$router.push('/forbidden');
            }
          })
      }
    }
</script>

<style scoped>

</style>
