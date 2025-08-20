export default{
    template : `
    <div class="container">
        <h1 class="mt-3 text-center">Register Professional</h1>
        <input class="mt-3 form-control mb-3" placeholder="email"  v-model="email"/>  
        <input class="mt-3 form-control mb-3" placeholder="password"  v-model="password"/>  
        <input class="mt-3 form-control mb-3" placeholder="Fullname"  v-model="fullname"/>  
        <!--<input class="form-control" placeholder="Service name"  v-model="service_id"/> -->
        <input class="mt-3 form-control mb-3" placeholder="Experience"  v-model="experience"/>  
        <input class="mt-3 form-control mb-3" placeholder="Address"  v-model="address"/> 
        <input class="mt-3 form-control mb-3" placeholder="Phone"  v-model="phoneno"/> 
        <input class="mt-3 form-control mb-3" placeholder="Pin"  v-model="pincode"/> 

        <input type="url" class="mt-3 form-control mb-3" placeholder="Resume link" v-model="link"/>

        <div class="input-group  mb-3">
        <label class=" mt-3 input-group-text mb-3" for="inputGroupSelect01">Service</label>
        <select class="mt-3 form-control mb-3 form-select" v-model="service_id">
            <option disabled value="">Choose...</option>
            <option v-for="service in services" :key="service.service_id" :value="service.service_id">
                {{ service.service_name }}
            </option>
        </select>
        </div>

        <button class='btn btn-success w-100 mb-3' @click="signup">Register</button><br>
        <button class='btn btn-secondary w-100 mb-3' @click="$router.push('/login-professional')">Login Professional</button>
    </div>
    `,
    data(){
        return {
            email : null,
            password : null,
            fullname :null,
            experience : null,
            address : null,
            phoneno : null,
            pincode : null,
            service_id : null,
            services : [],
            link:null,
        } 
    },
    mounted() {
        this.fetchServiceDetails();
    },
    methods : {
        async signup(){

            if (!this.email || !this.password || !this.fullname || !this.address || !this.phoneno || !this.pincode || !this.service_id || !this.experience) {
                alert("Please fill in all fields");
                return;
            }
            if (!this.email.includes("@")) {
                alert("Please enter a valid email.");
                return;
            }

            const res = await fetch(location.origin+'/professional/register', 
                {
                    method : 'POST', 
                    headers: {'Content-Type' : 'application/json'}, 
                    body : JSON.stringify({'email': this.email,'password': this.password,
                        fullname :this.fullname,
                        experience : this.experience,
                        address : this.address,
                        phoneno : this.phoneno,
                        pincode : this.pincode,
                        service_id : this.service_id,
                        link:this.link,
                    })
                })
                if (res.ok){
                    console.log('new Professional signed');
                    const data = await res.json();
                    alert(data.message);
                }
            },
            
            async fetchServiceDetails(){
                const res = await fetch(location.origin + '/professional/service', {
                    method:'GET'
                })
                if (res.ok) {
                    const data = await res.json();
                    this.services= data.service;
                    
        
                }

            },
    }
}