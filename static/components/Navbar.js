export default {
    template : `
    <!--<div>
        <p> v-if="$store.state.loggedIn> Welcome {{$store.state.fullname}}
        <router-link v-if="$store.state.loggedIn && $store.state.role == 'admin'" to='/admin-dashboard'>Dashboard</router-link>
        <router-link v-if="$store.state.loggedIn && $store.state.role == 'admin'" to='/admin-search'>Search</router-link>
        <router-link v-if="$store.state.loggedIn" to="/logout">Logout</router-link>
         </p>
    </div>-->
  <div class="d-flex justify-content-between align-items-center" style="background-color: #ff7f50; color: #ffffff;">
    <!-- Display 'Welcome' message only when logged in -->
    
    <p v-if="$store.state.loggedIn" >Welcome {{$store.state.fullname}}</p>
      <router-link v-if="$store.state.loggedIn && $store.state.role === 'admin'" to="/admin-dashboard" style="color: #ffffff;">Dashboard</router-link>
      <router-link v-if="$store.state.loggedIn && $store.state.role === 'admin'" to="/admin-search" style="color: #ffffff;">Search</router-link>
      <router-link v-if="$store.state.loggedIn && $store.state.role === 'admin'" to="/admin-chart" style="color: #ffffff;">Chart</router-link>
      <router-link v-if="$store.state.loggedIn && $store.state.role === 'customer'" to="/customer-dashboard" style="color: #ffffff;">Dashboard</router-link>
      <router-link v-if="$store.state.loggedIn && $store.state.role === 'customer'" to="/customer-search" style="color: #ffffff;">Search</router-link>
      <router-link v-if="$store.state.loggedIn" to="/logout" style="color: #ffffff;">Logout</router-link>
    
  </div>

 
`,
style: `
    .welcome-message {
      display: inline-block; /* Keeps it inline with the links */
      margin-right: 20px; /* Adds some space to the right of the message */
    }

    .links-container {
      display: inline-block; /* Keeps the links inline */
    }
  `
}
