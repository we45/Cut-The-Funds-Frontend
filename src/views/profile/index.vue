<template>
    <div>
        <br>
        <b-container fluid>
            <b-row>
                <b-col cols="3"></b-col>
                <b-col cols="6">
                    <b-card border-variant="primary"
                        header="User Profile Info"
                        header-bg-variant="primary"
                        header-text-variant="white"
                        align="center">
                        <b-form-group
                            horizontal
                            :label-cols="4"
                            breakpoint="md"
                            label="First Name : "
                            label-for="inputHorizontal">
                            <p class="text-left">{{ userInfo.firstName }}</p>
                        </b-form-group>
                        <b-form-group
                            horizontal
                            :label-cols="4"
                            breakpoint="md"
                            label="Last Name : "
                            label-for="inputHorizontal">
                            <p class="text-left">{{ userInfo.lastName }}</p>
                        </b-form-group>
                        <b-form-group
                            horizontal
                            :label-cols="4"
                            breakpoint="md"
                            label="Email : "
                            label-for="inputHorizontal">
                            <p class="text-left">{{ userInfo.email }}</p>
                        </b-form-group>
                    </b-card>
                </b-col>
                <b-col cols="3"></b-col>
            </b-row>
            <br>
            <br>
            <b-row v-if="userType==='user'">
                <b-col cols="2"></b-col>
                <b-col cols="8">
                    <b-card border-variant="secondary"
                        header="User Cards"
                        header-bg-variant="secondary"
                        header-text-variant="white"
                        align="center">
                        <template >
                            <template  v-for="card in userInfo.cards ">
                                <b-list-group>
                                    <b-list-group-item>{{ card }}</b-list-group-item>
                                </b-list-group>
                            </template>
                        </template>
                    </b-card>
                </b-col>
                <b-col cols="2"></b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
  import axios from '@/utils/auth'

  export default {
    name: 'Profile',
    data() {
      return {
        userInfo: ''
      }
    },
    created() {
      this.userType = localStorage.getItem('userType')
      this.fetchData()
    },
    methods: {
      fetchData() {
        if (this.userType === 'manager') {
          axios.get('/users/get_profile/')
            .then(res => {
              if (res.status === 200) {
                this.userInfo = res.data
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
        else if (this.userType === 'user') {
          axios.get('/users/get_cards/')
            .then(res => {
              if (res.status === 200) {
                this.userInfo = res.data
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
