<template>
  <div id="container">
    <b-container fluid class="py-5">
      <b-row>
        <b-col>
          <b-card border-variant="default"
                  header="Your Expenses by Reason"
                  header-bg-variant="default"
                  header-text-variant="black"
                  align="left">
            <pie-chart :data="expendeReasonChart" :donut="true" :legend="false"></pie-chart>
          </b-card>
        </b-col>
        <b-col>
          {{ ApprovedAllData }}
          <b-card border-variant="default"
                  header="Approved v/s Unapproved Expenses"
                  header-bg-variant="default"
                  header-text-variant="black"
                  align="left">
            <bar-chart :data="ApprovedAllData"></bar-chart>
          </b-card>
        </b-col>
      </b-row>
    </b-container>

  </div>
</template>

<script>
  import axios from 'axios'
  import conf from '../../../configure.json'
  export default {
    name: 'Home',
    data() {
      return {
        userType: "",
        ApprovedAllData: [],
        expendeReasonChart: [],
        approveCount: 0,
        disApproveCount: 0,
        reasonObj: {}
      }
    },
    mounted() {
      this.userType = localStorage.getItem('userType')
      this.fetchData()
    },
    methods: {
      fetchData() {
        // let api_url = process.env.API_URL;
        let api_url = conf.API_URL
        let dashboard_url = api_url+'/expenses/dash';
        axios.get(dashboard_url,{headers: {
            'Authorization': localStorage.getItem('token')
          }})
            .then(res => {
              if (res.status === 200) {
                if(this.userType === 'user'){
                const approved  = res.data.approvedStats.approved
                const total  = res.data.approvedStats.total
                const disApproved = (total-approved)
                this.ApprovedAllData.push(['Approved', approved], ['UnApproved', disApproved])
                for (const [key, val] of Object.entries(res.data.expReason)) {
                  this.expendeReasonChart.push([val._id,val.total])
                }
                }else if(this.userType === 'manager'){
                  for (const [key, val] of Object.entries(res.data)) {
                    for (let exp of val){
                      if (exp.isApproved === true){
                        this.approveCount += 1
                      }else if (exp.isApproved === false){
                        this.disApproveCount += 1
                      }
                      if (exp.reason in this.reasonObj) {
                        this.reasonObj[exp.reason] += 1;
                      } else {
                        this.reasonObj[exp.reason] = 0;
                        this.reasonObj[exp.reason] += 1;
                      }

                    }
                  }
                  for (const [key, val] of Object.entries(this.reasonObj)) {
                    this.expendeReasonChart.push([key,val])
                  }
                 this.ApprovedAllData.push(['Approved', this.approveCount], ['UnApproved', this.approveCount])
                 console.log('ApprovedAllData', this.ApprovedAllData)
                }
              }
               else {
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
</script>

<style scoped>

</style>
