<template>
  <div>
    <div class="py-5" v-if=" userType==='manager' ">
      <b-container fluid>
        <b-button variant="outline-primary" size="md" key-nav="left" @click="createProject()">
          Add Project
        </b-button>
        <br>
        <br>
        <b-card border-variant="primary"
                header="List of Projects"
                header-bg-variant="primary"
                header-text-variant="white"
                align="left">
          <b-container fluid>
            <b-row>
              <b-col md="6" class="my-1">
                <b-form-group horizontal label="Filter" class="mb-0">
                  <b-input-group>
                    <b-form-input v-model="filter" placeholder="Type to Search"/>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col md="6" class="my-1">
              </b-col>
            </b-row>
            <br>
            <b-row>
              <b-col md="6" class="my-1">
                <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0"/>
              </b-col>
              <b-col md="6" class="my-1">
                <b-form-group horizontal label="Per page" class="mb-0">
                  <b-form-select :options="pageOptions" v-model="perPage"/>
                </b-form-group>
              </b-col>
            </b-row>

            <!-- Main table element -->
            <b-table show-empty
                     stacked="md"
                     :items="items"
                     :fields="fields"
                     :current-page="currentPage"
                     :per-page="perPage"
                     :filter="filter"
                     :sort-by.sync="sortBy"
                     :sort-desc.sync="sortDesc"
                     @filtered="onFiltered"
            >
              <!--<template slot="remarks" slot-scope="row">-->
                <!--<p v-html="row.item.remarks"></p>-->
              <!--</template>-->
              <template slot="_id" slot-scope="row">
                <b-button size="sm" @click="editProject(row.item._id, row.item.name, row.item.limit)" class="mr-1">
                 Edit
                </b-button>
                <router-link :to="{ path: '/expenses/'+ row.item._id }" class="btn btn-primary">Expenses</router-link>
              </template>

            </b-table>


          </b-container>
        </b-card>
        <modal v-if=" isProjectCreate ">
          <h3 slot="header" class="modal-title">Create Project</h3>
          <div slot="body">
            <form @submit.prevent="submitProjectModal">
              <b-row class="my-1">
                <b-col sm="2"><label for="input-small">Project Name:</label></b-col>
                <b-col sm="10">
                  <b-form-input id="input-small" size="sm" type="text" v-model="projectName"></b-form-input>
                </b-col>
              </b-row>
              <br>
              <b-row class="my-1">
                <b-col sm="2"><label for="input-small">Limit:</label></b-col>
                <b-col sm="10">
                  <b-form-input id="input-small" size="sm" type="number" v-model="limit"></b-form-input>
                </b-col>
              </b-row>
              <b-row class="my-1">
                <b-col sm="2"><label for="input-small">Remarks:</label></b-col>
                <b-col sm="10">
                  <b-form-textarea id="remarks"
                     v-model="remarks"
                     :rows="3"
                     :max-rows="6">
                </b-form-textarea>
                </b-col>
              </b-row>
            </form>
          </div>
          <div slot="footer">
            <button type="button" class="btn btn-danger" @click=" closeModal() "> Close</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" @click=" submitProjectModal() ">
              Submit
            </button>
          </div>
        </modal>


        <modal v-if=" isProjectEdit ">
          <h3 slot="header" class="modal-title">Update Project</h3>
          <div slot="body">
            <form @submit.prevent="submitEditProjectModal">
              <input type="hidden" v-model="editProjectId">
              <b-row class="my-1">
                <b-col sm="2"><label for="input-small">Project Name:</label></b-col>
                <b-col sm="10">
                  <b-form-input id="input-small" size="sm" type="text" v-model="editProjectName"></b-form-input>
                </b-col>
              </b-row>
              <br>
              <b-row class="my-1">
                <b-col sm="2"><label for="input-small">Limit:</label></b-col>
                <b-col sm="10">
                  <b-form-input id="input-small" size="sm" type="number" v-model="editLimit"></b-form-input>
                </b-col>
              </b-row>
              <b-row class="my-1">
                <b-col sm="2"><label for="input-small">Remarks:</label></b-col>
                <b-col sm="10">
                  <b-form-textarea id="remarks"
                     v-model="editRemarks"
                     :rows="3"
                     :max-rows="6">
                </b-form-textarea>
                </b-col>
              </b-row>
            </form>
          </div>
          <div slot="footer">
            <button type="button" class="btn btn-danger" @click=" closeEditModal() "> Close</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" @click=" submitEditProjectModal() ">
              Update
            </button>
          </div>
        </modal>
      </b-container>
    </div>
  </div>
</template>

<script>
  import modal from '@/components/Modal/modal'
  import userAxios from '@/utils/auth'

  const items = []
  export default {
    name: 'Projects',
    components: {
      // ProjectsTable,
      modal
    },
    data() {
      return {
        items: [],
        isProjectCreate: false,
        isProjectEdit: false,
        projectName: '',
        editProjectName: '',
        editLimit: 0,
        editProjectId: '',
        editRemarks: '',
        remarks: '',
        limit: 0,
        fields: [
          {key: 'name', label: 'Project name', sortable: true},
          {key: 'manager', label: 'Manager', sortable: true, 'class': 'text-center'},
          {key: 'limit', label: 'Limit'},
          {key: 'remarks', label: 'Remarks'},
          {key: '_id', label: ' Action'}
        ],
        currentPage: 1,
        perPage: 5,
        totalRows: items.length,
        pageOptions: [5, 10, 15],
        sortBy: null,
        sortDesc: false,
        filter: null,
        modalInfo: {title: '', content: ''}
      }
    },
    created() {
      this.userType = localStorage.getItem('userType')
      this.fetchData()
    },
    // computed: {
    //   projectData : fetchData()
    // },
    methods: {
      fetchData() {
        userAxios.get('/projects/list_projects/')
          .then(res => {
            for (const val of res.data){
            this.items.push({name: val.name, manager: val.manager.email, limit: val.limit, remarks: val.remarks, _id: val._id})
              }
          }).catch(error => {

        })
      },
      createProject() {
        this.isProjectCreate = true
      },
      closeModal() {
        this.isProjectCreate = false
      },
      submitProjectModal() {
        userAxios.post('/projects/create_project/', {
          projectName: this.projectName,
          limit: this.limit,
          remarks: this.remarks
        })
          .then(res => {
            this.$router.push({path: '/projects'})
            this.isProjectCreate = false
          }).catch(error => {
          console.log(error)
        })
      },
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      editProject(id, name, limit) {
        this.isProjectEdit =  true
        this.editProjectName = name
        this.editLimit = limit
        this.editRemarks = remarks
        this.editProjectId = id
      },
      closeEditModal() {
        this.isProjectEdit = false
      },
      submitEditProjectModal() {
         userAxios.post('/projects/update_project/'+this.editProjectId+'/', {
          name: this.editProjectName,
          limit: this.editLimit,
           remarks: this.editRemarks
        })
          .then(res => {
            this.$router.push({path: '/projects'})
            this.isProjectEdit = false
          }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped>

</style>
