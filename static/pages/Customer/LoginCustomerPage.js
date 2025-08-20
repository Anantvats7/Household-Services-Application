export default {
    template : `
    <div class="container d-flex justify-content-center align-items-center min-vh-100">
        <div class="col-12 col-md-6 col-lg-4 mx-auto rounded bg-dark text-white">
        <h1 class="text-center mt-3 mb-4"> Login Customer</h1>    
        <input class="form-control mb-3" placeholder="email"  v-model="email"/>  <br>
        <input class="form-control mb-3" placeholder="password"  v-model="password"/> <br>
        <button class='btn btn-primary w-100 mb-3' @click="submitLogin"> Login </button><br>
        </div>
    </div>
    `,
    data(){
        return {
            email : null,
            password : null,
        } 
    },
    methods : {
       
        async submitLogin(){
            if (!this.email || !this.password) {
                alert("Please fill in all fields");
                return;
            }
            if (!this.email.includes("@")) {
                alert("Please enter a valid email.");
                return;
            }
            

            const res = await fetch(location.origin+'/customer/login', 
                {
                    method : 'POST', 
                    headers: {'Content-Type' : 'application/json'}, 
                    body : JSON.stringify({'email': this.email,'password': this.password})
                });
                const data = await res.json();
            if (res.ok){
                console.log('we are logged in')
                
                //console.log(data)
                localStorage.setItem('user', JSON.stringify(data))
                
                this.$store.commit('setUser')
                this.$router.push('/customer-dashboard')
             }else{
                alert(data.message);
             }
        },
        // async register(){
        //     this.$router.push('/register-customer')
        // }
    }
}