<template>
    <b-navbar toggleable="md" type="dark" variant="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <!--<b-navbar-brand href="/home">Cut The Funds Expenser</b-navbar-brand>-->

      <b-collapse is-nav id="nav_collapse">

        <!--<b-navbar-nav v-if="user_profile === 'superuser'" >-->
          <!--&lt;!&ndash; <b-nav-item href="/home" >Home</b-nav-item> &ndash;&gt;-->
          <!--<b-nav-item href="/manage_orgs" >Organizations </b-nav-item>-->
          <!--<b-nav-item href="/manage_org_admin" >Organizations Admins </b-nav-item>-->
        <!--</b-navbar-nav>-->

        <b-navbar-nav v-if="userType === 'manager'" >
          <b-nav-item href="/home" >Home</b-nav-item>
          <b-nav-item href="/project_master" >Projects</b-nav-item>
          <b-nav-item href="/approve_expenses" >Approve Expenses</b-nav-item>
          <b-nav-item href="/manage_org_user" >Add User</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav v-if="userType === 'user'">
          <b-nav-item href="/home" >Home</b-nav-item>
          <b-nav-item href="/expense_master" >Manage Expenses</b-nav-item>
          <b-nav-item href="/manage_cards" >Manage Cards</b-nav-item>
          <b-nav-item href="/get_my_coupons" >Get My Coupons</b-nav-item>
        </b-navbar-nav>



        <!--&lt;!&ndash; Right aligned nav items &ndash;&gt;-->
        <!--<b-navbar-nav class="ml-auto">-->
          <!--<b-nav-item-dropdown right>-->
            <!--&lt;!&ndash; Using button-content slot &ndash;&gt;-->
            <!--<template slot="button-content">-->
              <!--<strong v-if="user_profile === 'avg_user'" style="color:#FFFFFF;">User</strong>-->
              <!--<strong v-if="user_profile === 'org_admin'" style="color:#FFFFFF;">Admin User</strong>-->
              <!--<strong v-if="user_profile === 'superuser'" style="color:#FFFFFF;">Super User</strong>-->
            <!--</template>-->
            <!--<b-dropdown-item href="/login">Signout</b-dropdown-item>-->
          <!--</b-nav-item-dropdown>-->
        <!--</b-navbar-nav>-->

      </b-collapse>
    </b-navbar>
</template>

<script>
    export default {
        name: "AppNav",
        data() {
          return {
            userType: ''
          }
        },
      created() {
          this.userType = localStorage.getItem('userType')
      }
    }
</script>
