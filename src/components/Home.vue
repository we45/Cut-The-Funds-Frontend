<template>
   <div id="container">
      <app-nav></app-nav>
      <b-container fluid v-if="userType==='﻿user'" class="py-5">
         <b-row>
            <b-col>
               <b-card border-variant="default"
                  header="Your Expenses by Reason"
                  header-bg-variant="default"
                  header-text-variant="black"
                  align="left">
                  <exp-chart></exp-chart>
               </b-card>
            </b-col>
            <b-col>
              <b-card border-variant="default"
                  header="Expenses by Amount"
                  header-bg-variant="default"
                  header-text-variant="black"
                  align="left">
                  <amt-chart></amt-chart>
               </b-card>
            </b-col>
            <b-col>
              <b-card border-variant="default"
                  header="Approved v/s Unapproved Expenses"
                  header-bg-variant="default"
                  header-text-variant="black"
                  align="left">
                  <approved-chart></approved-chart>
               </b-card>
            </b-col>
         </b-row>
      </b-container>

      <b-container fluid v-if="userType==='manager'" class="py-5">
         <b-row>
            <b-col>
               <b-card border-variant="default"
                  header="Your Expenses by Reason"
                  header-bg-variant="default"
                  header-text-variant="black"
                  align="left">
                  <org-chart></org-chart>
               </b-card>
            </b-col>
            <b-col>
              <b-card border-variant="default"
                  header="Approved v/s Unapproved Expenses"
                  header-bg-variant="default"
                  header-text-variant="black"
                  align="left">
                  <approved-chart></approved-chart>
               </b-card>
            </b-col>
         </b-row>
      </b-container>

   </div>
</template>
<script>
   import AppNav from './AppNav.vue'
   // import ExpenseVisualization from './MyExpenseVisualization.vue'
   // import AmountVisualization from './ExpenseSumAmount.vue'
   import OrgProjectVisualization from './OrgProjectVisualization.vue'
   import ApprovedUnapprovedVisualization from './ApprovedUnApprovedExpenses.vue'

   export default {
     components: {
       'app-nav': AppNav,
       // 'exp-chart': ExpenseVisualization,
       // 'amt-chart': AmountVisualization,
       // 'approved-chart': ApprovedUnapprovedVisualization,
       // 'org-chart': OrgProjectVisualization,

     },
     data() {
       return {
         // form: {
         //   groupname: "",
         //   numusers: ""
         // },
         // items: {},
         // showFormErrors: false,
         // form_error: "",
         // successOrgCreate: false,
         // org_create_message: "Organization successfully created",
         userType: ""

       }
     },
     created() {
       // is_token_present = localStorage.getItem('user_auth_token')
       this.userType = localStorage.getItem('userType')
     },
     // methods: {
     //   showModal() {
     //     this.$refs.myModalRef.show();
     //   },
     //   hideModal() {
     //     this.$refs.myModalRef.hide()
     //   },
     //   onSubmit(evt) {
     //     evt.preventDefault()
     //     var orgCreatePath = 'http://localhost:8000/organizations/'
     //     axios.post(orgCreatePath, {
     //       "name": this.form.groupname,
     //       "num_users": parseInt(this.form.numusers)
     //     },
     //       {
     //       headers: {
     //         "Authorization": localStorage.getItem('user_auth_token')
     //       }
     //     })
     //       .then(response => {
     //        if (response.status===200){
     //         this.hideModal();
     //         this.successOrgCreate = true;
     //        }
     //       })
     //       .catch(error => {
     //        var check_role = localStorage.getItem('user_role')
     //        if (check_role === 'superadmin'){
     //          if (error.response===undefined){
     //              location.href = '/server_error';
     //          }else if (error.response.status===400){
     //              location.href = '/bad_request';
     //          }else if (error.response.status===401){
     //              location.href = '/unauthorized';
     //          }else if (error.response.status===403){
     //            location.href = '/forbidden';
     //          }else if (error.response.status===404){
     //            location.href = '/not_found';
     //          }else if (error.response.status===500){
     //              location.href = '/login';
     //          }else{
     //              location.href = '/login';
     //          }
     //          this.showFormErrors = true;
     //          this.form_error = 'Error creating Organization';
     //        }else{

     //        }
     //       })

     //   }
     // }
   }
</script>
<style>
</style>
