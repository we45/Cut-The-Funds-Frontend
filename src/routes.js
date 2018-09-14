import OrgAdminTable from './components/OrgAdminTable.vue'
import Home from './views/home/index.vue'
import Login from './views/login/index.vue'
import Projects from './views/projects/index.vue'
import Expenses from './views/expenses/index.vue'
import SingleExpenses from './views/expenses/SingleExpenses.vue'
import Profile from './views/profile/index.vue'


import RegisterOTP from './components/RegisterOTP.vue'
import ProjectMaster from './components/ProjectMaster.vue'
import ExpenseMaster from './components/ExpenseMaster.vue'
import SingleExpenseView from './components/SingleExpenseView.vue'
import ManageCards from './components/ManageCards.vue'
import ValidateOtp from './components/ValidateOtp.vue'
import OrganizationMaster from './components/OrganizationMaster.vue'
import OrgAdminMaster from './components/OrgAdminMaster.vue'
import PasswordReset from './components/PasswordReset.vue'
import ApproveExpenses from './components/ApproveExpenses.vue'
import AddOrgUser from './components/AddOrgUser.vue'
import InternalError from './components/InternalError.vue'
import Forbidden from './components/Forbidden.vue'
import UnAuthorized from './components/UnAuthorized.vue'
import BadRequest from './components/BadRequest.vue'
import NotFound from './components/NotFound.vue'
import GetMyCoupons from './components/GetMyCoupons.vue'

export const routes = [
  {path: '/', component: Login }, //for all
  {path: '/home', component: Home }, //for all - options are aet based on role
  {path: '/login', component: Login }, //for all
  {path: '/register_otp', component: RegisterOTP }, //for all
  {path: '/projects', component: Projects},
  {
    path: '/expenses/:projectId',
    name:'expenses',
    component: Expenses
  },
    {
    path: '/expenses',
    name:'userexpenses',
    component: Expenses
  },
   {
    path: '/single_expense/:expenseId',
    name:'SingleExpenses',
    component: SingleExpenses
  },
  {path: '/profile', component: Profile }, //org_admin


  {path: '/project_master', component: ProjectMaster }, //org_admin
  {path: '/expense_master', component: ExpenseMaster }, //avg_user
  {path: '/single_expense/:id', component: SingleExpenseView, props: (route) => ({
      id: route.params.id
    })}, //avg_user
  {path: '/manage_cards', component: ManageCards }, //avg_user
  {path: '/validate_otp', component: ValidateOtp }, //for all
  {path: '/manage_orgs', component: OrganizationMaster }, //superadmin
  {path: '/manage_org_admin', component: OrgAdminMaster }, //superadmin
  {path: '/manage_org_user', component: AddOrgUser }, //org_admin
  {path: '/set_reset_pwd/:url_token', component: PasswordReset, props: (route) => ({
      url_token: route.params.url_token
    }) }, //for all
  // {path: '/my_exps', component: MyExpenseVisualization }, //avg_user
  {path: '/approve_expenses', component: ApproveExpenses }, //org_admin
  {path: '/server_error', component: InternalError },
  {path: '/forbidden', component: Forbidden },
  {path: '/unauthorized', component: UnAuthorized },
  {path: '/bad_request', component: BadRequest },
  {path: '/not_found', component: NotFound },
  {path: '/get_my_coupons', component: GetMyCoupons }, //org_admin

]

