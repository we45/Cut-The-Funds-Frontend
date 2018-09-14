<template v-if="token">
    <b-navbar toggleable="md" type="dark" variant="dark" v-if="token">
      <template v-if="token">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav v-if="userType === 'manager'" >
          <b-nav-item href="/home" >Home</b-nav-item>
          <b-nav-item href="/projects" >Projects</b-nav-item>
          <!--<b-nav-item href="/manage_org_user" >Add User</b-nav-item>-->
        </b-navbar-nav>

        <b-navbar-nav v-if="userType === 'user'">
          <b-nav-item href="/home" >Home</b-nav-item>
          <b-nav-item href="/expenses" >Manage Expenses</b-nav-item>
          <!--<b-nav-item href="/manage_cards" >Manage Cards</b-nav-item>-->
          <!--<b-nav-item href="/get_my_coupons" >Get My Coupons</b-nav-item>-->
        </b-navbar-nav>



        <!--&lt;!&ndash; Right aligned nav items &ndash;&gt;-->
        <b-navbar-nav class="ml-auto" v-if="token">
          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <strong style="color:#FFFFFF;">{{ email }}</strong>
            </template>
            <b-dropdown-item>
              <router-link to="/profile">Profile</router-link>
            </b-dropdown-item>
            <b-dropdown-item  @click="signout">Signout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>
        </template>
    </b-navbar>
</template>

<script>
    export default {
        name: 'AppNav',
        data() {
          return {
            userType: '',
            email: '',
            token: ''
          }
        },
      created() {
          this.userType = localStorage.getItem('userType')
          this.email = localStorage.getItem('email')
          this.token = localStorage.getItem('token')
      },
      methods: {
          signout() {
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
            localStorage.removeItem('email');
            // this.$router.push({path: '/'})
            window.location.href = "/"
          }
      }
    }
</script>
