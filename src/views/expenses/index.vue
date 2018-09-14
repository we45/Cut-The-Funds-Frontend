<template>
    <div>
        <br/>
        <b-button variant="outline-primary" size="md" key-nav="left" @click="createExpense()" v-if="this.userType === 'user'">
            Add Expenses
        </b-button>
        <br>
        <br>
        <b-container fluid>
            <b-card border-variant="primary"
                header="List of Expenses"
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
                      <template slot="approved" slot-scope="row">
                        <p v-if="row.item.isApproved">Approved</p>
                        <p v-else>Waiting for Approval</p>
                      </template>
                        <template slot="_id" slot-scope="row">
                            <template v-if="userType==='manager'">
                                <b-button size="sm" @click="approveExpenses(row.item._id)" class="mr-1"
                                    v-if="row.item.isApproved===false">
                                    Approve
                                </b-button>
                            </template>
                            <template v-if="userType==='user'">
                                <b-button size="sm"
                                    @click="editExpenses(row.item._id, row.item.name, row.item.amount, row.item.reason, row.item.merchant)"
                                    class="mr-1">
                                    Edit
                                </b-button>
                                <router-link :to="{ path: '/single_expense/'+ row.item._id }" class="btn btn-sm btn-primary" size="sm">View</router-link>
                            </template>
                        </template>
                    </b-table>
                </b-container>
            </b-card>
            <!--Modals-->
            <b-modal ref="createExpense" hide-footer title="Create Expense">
                <h3  class="modal-title">Create Expense</h3>
                <div >
                    <form @submit.prevent="submitExpenseModal">
                        <b-row class="my-1">
                            <b-col sm="2"><label for="input-small">Name:</label></b-col>
                            <b-col sm="10">
                                <b-form-input id="input-small" size="sm" type="text" v-model="expenseName"></b-form-input>
                            </b-col>
                        </b-row>
                        <br>
                        <b-row class="my-1">
                            <b-col sm="2"><label for="input-small">Amount:</label></b-col>
                            <b-col sm="10">
                                <b-form-input id="input-small" size="sm" type="number" v-model="expenseAmount"></b-form-input>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="2"><label for="input-small">Merchant:</label></b-col>
                            <b-col sm="10">
                                <b-form-input id="input-small" size="sm" type="text" v-model="expenseMerchant"></b-form-input>
                            </b-col>
                        </b-row>
                        <br>
                        <b-row class="my-1">
                            <b-col sm="2"><label for="input-small">Reason:</label></b-col>
                            <b-col sm="10">
                                <b-form-select id="natureInput"
                                    :options="reasonChoices"
                                    required
                                    v-model="expenseReason">
                                </b-form-select>
                            </b-col>
                        </b-row>
                        <br>
                        <b-row class="my-1">
                            <b-col sm="2"><label for="input-small">Project:</label></b-col>
                            <b-col sm="10">
                                <b-form-select id="natureInput"
                                    :options="projectList"
                                    required
                                    v-model="expenseProject">
                                </b-form-select>
                            </b-col>
                        </b-row>
                        <br>
                    </form>
                </div>
                <div>
                    <button type="button" class="btn btn-danger" @click=" closeModal() "> Close</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" @click=" submitExpenseModal() ">
                    Submit
                    </button>
                </div>
            </b-modal>
            <b-modal ref="updateExpense" hide-footer title="Update Expense">
                <h3 class="modal-title">Update Expense</h3>
                <div>
                    <form @submit.prevent="submitEditExpenseModal">
                        <input type="hidden" v-model="editExpenseId">
                        <b-row class="my-1">
                            <b-col sm="2"><label for="input-small">Expense Name:</label></b-col>
                            <b-col sm="10">
                                <b-form-input id="input-small" size="sm" type="text" v-model="editExpenseName"></b-form-input>
                            </b-col>
                        </b-row>
                        <br>
                        <b-row class="my-1">
                            <b-col sm="2"><label for="input-small">Amount:</label></b-col>
                            <b-col sm="10">
                                <b-form-input id="input-small" size="sm" type="number" v-model="editAmount"></b-form-input>
                            </b-col>
                        </b-row>
                        <b-row class="my-1">
                            <b-col sm="2"><label for="input-small">Reason:</label></b-col>
                            <b-col sm="10">
                                <b-form-select id="natureInput"
                                    :options="reasonChoices"
                                    required
                                    v-model="editReason">
                                </b-form-select>
                            </b-col>
                        </b-row>
                        <br>
                        <b-row class="my-1">
                            <b-col sm="2"><label for="input-small">Mechant:</label></b-col>
                            <b-col sm="10">
                                <b-form-input id="input-small" size="sm" type="text" v-model="editMerchant"></b-form-input>
                            </b-col>
                        </b-row>
                    </form>
                </div>
                <div>
                    <button type="button" class="btn btn-danger" @click=" closeEditModal() "> Close</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" @click=" submitEditExpenseModal() ">
                    Update
                    </button>
                </div>
            </b-modal>
        </b-container>
    </div>
</template>

<script>
  import modal from '@/components/Modal/modal'
  import axios from '@/utils/auth'
  import swal from 'sweetalert';

  const items = []
  export default {
    name: 'Expenses',
    data() {
      return {
        items: [],
        fields: [
          {key: 'name', label: 'Name', sortable: true},
          {key: 'amount', label: 'Amount', sortable: true, 'class': 'text-center'},
          {key: 'reason', label: 'Reason'},
          {key: 'merchant', label: 'Merchant'},
          {key: 'approved', label: 'Approved'},
          {key: '_id', label: ' Action'}
        ],
        currentPage: 1,
        perPage: 5,
        totalRows: items.length,
        pageOptions: [5, 10, 15],
        sortBy: null,
        sortDesc: false,
        filter: null,
        modalInfo: {title: '', content: ''},
        param: '',
        isExpenseEdit: false,
        isExpenseCreate: false,
        expenseName: '',
        expenseAmount: 0,
        expenseMerchant: '',
        reasonChoices: ['Food and Entertainment', 'Travel', 'Fuel Expenditure', 'Other Consumables'],
        expenseReason: '',
        projectList: [],
        expenseProject: '',
        editExpenseId: '',
        editReason: '',
        editAmount:'',
        editMerchant: '',
        editExpenseName:'',
        userType: ''
      }
    },
    created() {
      this.userType = localStorage.getItem('userType')
      this.param = this.$route.params.projectId
      this.fetchData()
    },
    methods: {
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      approveExpenses(id) {
        swal("Are you sure you want to approve this expense?", {
          buttons: ["No", true],
        })
          .then((value) => {
            if (value === true) {
              axios.patch('/expenses/approve_expense/' + id + '/', {
                isApproved: true
              })
                .then(response => {
                  var check_role = localStorage.getItem('userType')
                  if (check_role === 'manager') {
                    if (response.status === 200) {
                      swal("Successfully Approved Expense ID: " + id + "!", "success")
                      // this.$refs.approveTable.refresh()
                      location.reload();
                    }
                  } else {
                    this.$router.push('/forbidden');
                  }
                })
                .catch(error => {
                  console.log('error')
                })
            }
            else {
              console.log("Selected Value False")
            }
          })
      },
      editExpenses(id, name, amount, reason, merchant) {
        // this.isExpenseEdit = true
        this.$refs.updateExpense.show()
        this.editExpenseName = name
        this.editAmount = amount
        this.editReason = reason
        this.editMerchant = merchant
        this.editExpenseId = id
      },
      closeEditModal() {
        // this.isExpenseEdit = false
        this.$refs.updateExpense.hide()
      },
      submitEditExpenseModal() {
        axios.post('/expenses/update_expense/' + this.editExpenseId + '/', {
          name: this.editExpenseName,
          amount: this.editAmount,
          reason: this.editReason,
          merchant: this.editMerchant
        })
          .then(res => {
            this.$router.push({path: '/expenses'})
            this.$refs.updateExpense.hide()
          }).catch(error => {
          console.log(error)
        })
      },
      createExpense() {
        this.$refs.createExpense.show()
      },
      closeModal() {
        this.$refs.createExpense.hide()
      },
      submitExpenseModal() {
        axios.post('/expenses/create_expense/', {
          name: this.expenseName,
          projectId: this.expenseProject,
          merchant: this.expenseMerchant,
          reason: this.expenseReason,
          amount: this.expenseAmount
        })
          .then(res => {
            this.$router.push({path: '/expenses'})
            this.$refs.createExpense.hide()
          }).catch(error => {
          console.log(error)
        })
      },
      fetchData() {
        if (this.userType === 'manager') {
          axios.get('/expenses/project_expenses/' + this.param)
            .then(res => {
              if (res.status === 200) {
                for ([key, val] of Object.entries(res.data)) {
                  this.items.push({
                    name: val.name,
                    amount: val.amount,
                    reason: val.reason,
                    merchant: val.merchant,
                    _id: val._id,
                    isApproved: val.isApproved
                  })
                }
              } else {
                this.$router.push('/forbidden')
              }
            }).catch(error => {
            if (error.response.status === 404) {
              this.$router.push('/not_found')
            } else if (error.response.status === 403) {
              this.$router.push('/forbidden')
            } else {
              this.$router.push('/forbidden')
            }
          })
        }
        else if (this.userType === 'user') {
          axios.get('/expenses/get_my_expenses/')
            .then(res => {
              if (res.status === 200) {
                for ([key, val] of Object.entries(res.data)) {
                  this.items.push({
                    name: val.name,
                    amount: val.amount,
                    reason: val.reason,
                    merchant: val.merchant,
                    _id: val._id,
                    isApproved: val.isApproved
                  })
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

          axios.get('/projects/user_projects/')
            .then(res => {
              if (res.status === 200) {
                for ([key, val] of Object.entries(res.data)) {
                  this.projectList.push({value: val._id, text: val.name})
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
      }
    }
  }
</script>

<style scoped>

</style>
