const Home = {
    template: `<!--<img :src="'https://4.imimg.com/data4/KK/OI/MY-5670369/home-cleaning-services-500x500.png'" alt="Image not loading" >-->
                <div :style="{ backgroundImage: 'url(https://4.imimg.com/data4/KK/OI/MY-5670369/home-cleaning-services-500x500.png)', height: '100vh',backgroundSize: 'contain'}" @click="$router.push('/login')">
                </div>
        `
  };
  
import AdminDashboardPage from "../pages/Admin/AdminDashboardPage.js";
import ServicerequestdisplayPage from "../pages/Admin/ServicerequestdisplayPage.js";
import LoginPage from "../pages/Admin/LoginPage.js";
import LogoutPage from "../pages/LogoutPage.js";
import ProfessionaldisplayPage from "../pages/Admin/ProfessionaldisplayPage.js";
import NewservicePage from "../pages/Admin/NewservicePage.js";
import EditservicePage from "../pages/Admin/EditservicePage.js";
import CustomerdisplayPage from "../pages/Admin/CustomerdisplayPage.js";
import RegisterProfessionalPage from "../pages/Professional/RegisterProfessionalPage.js";
import LoginProfessionalPage from "../pages/Professional/LoginProfessionalPage.js";
import ProfessionalDashboardPage from "../pages/Professional/ProfessionalDashboardPage.js";
import SearchAdminPage from "../pages/Admin/SearchAdminPage.js";
import RegisterCustomerPage from "../pages/Customer/RegisterCustomerPage.js";
import CustomerDashboardPage from "../pages/Customer/CustomerDashboardPage.js";
import LoginCustomerPage from "../pages/Customer/LoginCustomerPage.js";
import BookingservicerequestPage from "../pages/Customer/BookingservicerequestPage.js";
import CustomerEditServicerRequestPage from "../pages/Customer/CustomerEditServicerRequestPage.js";
import CustomerRatingProfessionalPage from "../pages/Customer/CustomerRatingProfessionalPage.js";
import CustomerSearchPage from "../pages/Customer/CustomerSearchPage.js";

import store from "./store.js";
import paymentPage from "../pages/Customer/paymentPage.js";
import AdminChartDisplay from "../pages/Admin/AdminChartDisplay.js";

//import TokenRefreshPage from "../pages/TokenRefreshPage.js";


const routes = [
    {path : '/', component : Home},
    {path : '/login', component : LoginPage},
//     {path : '/feed', component : BlogsListPage, meta : {requiresLogin : true}},
    {path : '/newservice', component : NewservicePage ,meta : {requiresLogin : true}},
    {path : '/editservice/:service_id', component : EditservicePage, props : true ,meta : {requiresLogin : true}},
    {path : '/servicerequestdisplay/:id', component : ServicerequestdisplayPage, props : true ,meta : {requiresLogin : true}},
    {path : '/professionaldisplay/:professionalid', component : ProfessionaldisplayPage, props : true ,meta : {requiresLogin : true}},
    {path : '/customerdisplay/:customerid', component : CustomerdisplayPage, props : true ,meta : {requiresLogin : true}},
    {path : '/admin-dashboard', component : AdminDashboardPage,meta : {requiresLogin : true} ,meta : {requiresLogin : true}},
    {path: '/logout',component: LogoutPage},
    {path: '/register-professional',component: RegisterProfessionalPage},
    {path : '/login-professional',component:LoginProfessionalPage},
    {path : '/professional-dashboard',component:ProfessionalDashboardPage ,meta : {requiresLogin : true}},
    {path :'/admin-search',component:SearchAdminPage ,meta : {requiresLogin : true}},
    {path: '/register-customer',component: RegisterCustomerPage},
    {path : '/login-customer',component:LoginCustomerPage},
    {path : '/customer-dashboard',component:CustomerDashboardPage ,meta : {requiresLogin : true}},
    {path:'/customer-servicebooking/:id',component:BookingservicerequestPage,props:true ,meta : {requiresLogin : true}},
    {path:'/customer-edit-servicebooking/:id',component:CustomerEditServicerRequestPage,props:true ,meta : {requiresLogin : true}},
    {path:'/customer-request-rating/:sid/:prof_name/:service_name',component:CustomerRatingProfessionalPage,props:true ,meta : {requiresLogin : true}},
    {path:'/customer-search',component:CustomerSearchPage ,meta : {requiresLogin : true}},
    {path: '/customer-payement',component:paymentPage, meta : {requiresLogin : true}},
 //   {path: '/refresh',component: TokenRefreshPage},
    {path :'/admin-chart',component:AdminChartDisplay ,meta : {requiresLogin : true}},

 ]

const router = new VueRouter({
    routes
})

// navigation guards
router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresLogin)){
        if (!store.state.loggedIn){
            next({path : '/login'})
        } else if (to.meta.role && to.meta.role != store.state.role){
            alert('role not authorized')
             next({path : '/'})
        } else {
            next();
        }
    } else {
        next();
    }
})


export default router;