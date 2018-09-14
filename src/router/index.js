import Vue from 'vue'
import Router from 'vue-router'
import OrganizationTable from '../components/OrganizationTable.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/org_table',
      name: 'OrganizationTable',
      component: OrganizationTable
    }
  ]
})
