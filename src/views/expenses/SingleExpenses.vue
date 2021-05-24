<template>
    <div>
        <br>
        <b-container fluid>
            <b-card title="Expense View">
                <hr>
                <br>
                <b-form-group
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Name : "
                    label-for="inputHorizontal">
                    <p class="text-left">{{ name }}</p>
                </b-form-group>
                <b-form-group
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Merchant : "
                    label-for="inputHorizontal">
                    <p class="text-left">{{ merchant }}</p>
                </b-form-group>
                <b-form-group
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Reason : "
                    label-for="inputHorizontal">
                    <p class="text-left">{{ reason }}</p>
                </b-form-group>
                <b-col cols="4">
                    <b-button size="sm" variant="primary" style="float: left;" @click="uploadFle()">Upload</b-button>
                </b-col>
                <b-col cols="8"></b-col>
            </b-card>
            <br>
            <b-row>
                <b-col cols="8"></b-col>
                <b-col cols="4">
                    <b-form-input type="text"
                        v-model="search"
                        placeholder="Search"
                        style="float: right;margin-right: 10px;"></b-form-input>
                </b-col>
            </b-row>
            <br>
            <b-container fluid>
                <b-row>
                    <template v-for="file in fileList">
                        <b-card :title="file.url"
                            style="max-width: 20rem;"
                            class="mb-2">
                            <hr>
                            <p class="card-text">
                                {{ file.desc }}
                            </p>
                            <p v-html="search"></p>
                        </b-card>
                    </template>
                </b-row>
            </b-container>
        </b-container>
      <modal v-if=" isExpenseFile ">
        <h3 slot="header" class="modal-title">Upload File</h3>
        <div slot="body">
          <form @submit.prevent="submitUploadExpenseModal">
            <input type="hidden" v-model="id">
            <b-row class="my-1">
              <b-col sm="2"><label for="input-small">Upload Expenses:</label></b-col>
              <b-col sm="10">
                <b-form-file v-model="uploadExp" placeholder="Choose a file..."></b-form-file>
              </b-col>
            </b-row>
            <br>
            <b-row class="my-1">
              <b-col sm="2"><label for="input-small">Description:</label></b-col>
              <b-col sm="10">
                <b-form-textarea
                     v-model="expDesc"
                     :rows="3"
                     :max-rows="6">
    </b-form-textarea>
              </b-col>
            </b-row>
            <br>
          </form>
        </div>
        <div slot="footer">
          <button type="button" class="btn btn-danger" @click=" closeUploadModal() "> Close</button>
          <button type="button" class="btn btn-primary" data-dismiss="modal" @click=" submitUploadExpenseModal() ">
            Update
          </button>
        </div>
      </modal>
    </div>
</template>

<script>
  import modal from '@/components/Modal/modal'
  import axios from '@/utils/auth'

  export default {
    components: {modal},
    name: 'SingleExpenses',
    data() {
      return {
        name: '',
        merchant: '',
        reason: '',
        id: '',
        fileList: [],
        isExpenseFile: false,
        uploadExp: '',
        expDesc: '',
        search: ''
      }
    },

    created() {
      this.userType = localStorage.getItem('userType')
      this.param = this.$route.params.expenseId
      this.fetchData()
    },
    methods: {
      fetchData() {
        if (this.userType === 'user') {
          axios.get('/expenses/single_expense/' + this.param)
            .then(res => {
              if (res.status === 200) {
                this.name = res.data.name
                this.merchant = res.data.merchant
                this.reason = res.data.reason
                this.id = res.data._id
                for (const [key, val] of Object.entries(res.data.files)) {
                  const fileUrl = val.fileUri
                  const arr = fileUrl.split('/');
                  const lastItem = arr.pop();
                  this.fileList.push({url: lastItem, desc: val.description})
                }

              } else {
                this.$router.push('/forbidden')
              }
            }).catch(error => {
            if (error.response.status === 404) {
              this.$router.push('/not_found')
            } else if (error.response.status === 403) {
              localStorage.removeItem('token');
              localStorage.removeItem('userType');
              localStorage.removeItem('email');
              // this.$router.push({path: '/'})
              window.location.href = "/"
            } else {
              this.$router.push('/forbidden')
            }
          })
        }
      },
      uploadFle() {
        this.isExpenseFile = true

      },
      closeUploadModal() {
        this.isExpenseFile = false
      },
      submitUploadExpenseModal() {
        let form_data = new FormData()
        form_data.append('expenseFile', this.uploadExp)
        form_data.append('description', this.expDesc)

        console.log(form_data)
        axios.post('/expenses/upload_file/' + this.id, form_data, {
          headers: {
            "Content-Type": 'multipart/form-data'
          }
        })
          .then(response => {
            if (response.status === 200) {
              this.isExpenseFile = false
              this.$router.push('/single_expense/' + this.id)
              this.fetchData()
            }
          })
          .catch(error => {
            if (error.response === undefined) {
              location.href = '/server_error';
            } else if (error.response.status === 400) {
              location.href = '/bad_request';
            } else if (error.response.status === 401) {
              location.href = '/unauthorized';
            } else if (error.response.status === 403) {
              localStorage.removeItem('token');
              localStorage.removeItem('userType');
              localStorage.removeItem('email');
              // this.$router.push({path: '/'})
              window.location.href = "/"
            } else if (error.response.status === 404) {
              location.href = '/not_found';
            } else if (error.response.status === 500) {
              location.href = '/login';
            } else {
              location.href = '/login';
            }

          })

      }
    }

  }
</script>

<style scoped>

</style>
