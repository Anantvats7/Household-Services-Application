export default {
    template : `
  <div >
    <h2 align="center">Are you want to logout??</h2>
    <button  class="container d-flex justify-content-center btn btn-danger w-50 mb-3 " @click="logout">Logout</button>
  </div>
`,
  methods: {
    async logout() {
      try {
        const res = await fetch(location.origin+'/logout', {
          method: 'POST',
          headers: {
            'Authentication-Token': this.$store.state.access_token,
          },
        });
        
        if (res.ok) {
          //localStorage.removeItem('user');
          this.$store.commit('logout')
          this.$router.push('/login'); // Redirect to login page
        } else {
          console.error('Logout failed');
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    },
  },
};

