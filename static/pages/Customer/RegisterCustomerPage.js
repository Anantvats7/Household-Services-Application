export default{
    template : `
    <div class="container">
        <h1 class="mt-3 text-center">Register Customer</h1>
        <input class="mt-3 form-control mb-3" placeholder="email"  v-model="email"/>  
        <input class="mt-3 form-control mb-3" placeholder="password"  v-model="password"/>  
        <input class="mt-3 form-control mb-3" placeholder="Fullname"  v-model="fullname"/>   
        <input class="mt-3 form-control mb-3" placeholder="Address"  v-model="address"/> 
        <input class="mt-3 form-control mb-3" placeholder="Phone"  v-model="phoneno"/> 
        <input class="mt-3 form-control mb-3" placeholder="Pin"  v-model="pincode"/>  


        <button class='btn btn-success w-100 mb-3' @click="signup">Register</button><br>
        <button class='btn btn-secondary w-100 mb-3' @click="$router.push('/login-customer')">Login Customer</button>
    </div>
    `,
    data(){
        return {
            email : null,
            password : null,
            fullname :null,
            address : null,
            phoneno : null,
            pincode : null,
        } 
    },
    
    methods : {
        async signup(){
            if (!this.email || !this.password || !this.fullname || !this.address || !this.phoneno || !this.pincode) {
                alert("Please fill in all fields");
                return;
            }
            if (!this.email.includes("@")) {
                alert("Please enter a valid email.");
                return;
            }
            const res = await fetch(location.origin+'/customer/register', 
                {
                    method : 'POST', 
                    headers: {'Content-Type' : 'application/json'}, 
                    body : JSON.stringify({'email': this.email,'password': this.password,
                        fullname :this.fullname,
                        address : this.address,
                        phoneno : this.phoneno,
                        pincode : this.pincode,
                    })
                })
                if (res.ok){
                    console.log('new Customer joined');
                    const data = await res.json();
                    alert(data.message);
                }
            },
            
    }
}