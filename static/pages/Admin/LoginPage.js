export default {
    template : `

    <div class="container d-flex justify-content-center align-items-center min-vh-100" >
        <div class="col-12 col-md-6 col-lg-4 mx-auto rounded bg-warning">
            <h1 class="card-title text-center mt-3 mb-4">Admin Login</h1>
            <input class="form-control mb-3" placeholder="Email" v-model="email" />
            <input class="form-control mb-3" placeholder="Password" type="password" v-model="password" />
            
            <button class="btn btn-primary w-100 mb-3" @click="submitLogin">Login</button>
            <button class="btn btn-info w-100 mb-3" @click="register">Register as Professional</button>
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
            // if (!this.email.includes("@")) {
            //     alert("Please enter a valid email.");
            //     return;
            // }
            if (!this.email || !this.password) {
                alert("Please fill in all fields");
                return;
            }

            const res = await fetch(location.origin+'/admin/login', 
                {
                    method : 'POST', 
                    headers: {'Content-Type' : 'application/json'}, 
                    body : JSON.stringify({'email': this.email,'password': this.password})
                })
            if (res.ok){
                console.log('we are logged in')
                const data = await res.json()
                //console.log(data)
                localStorage.setItem('user', JSON.stringify(data))
                
                this.$store.commit('setUser')
                this.$router.push('/admin-dashboard')
             }
        },
        async register(){
            this.$router.push('/register-professional')
        }
    }
}