import servicerequestbar from "../../components/servicerequestbar.js";
export default {
    template :`
    <div class="p-3">
        <h3 class="text-center"> Customer List </h3>
        <h5 class="container  jumbotron text-center p-2 mb-1 bg-dark text-white" v-for="customer in customers"   @click="$router.push('/customerdisplay/'+customer.customerid)">
            {{ customer.customerid }}, {{ customer.fullname }}, {{ customer.emailid }}, {{ customer.status}}</h5>
        <hr>
        <br>
        <h3>Professionals List</h3>
        <h5 class="container jumbotron p-2 mb-1 mt-1 text-center bg-dark text-white" v-for="pro in professionals" @click="$router.push('/professionaldisplay/'+pro.professionalid)">
        {{ pro.professionalid }}, {{ pro.fullname }}, {{ pro.emailid }},{{ pro.status}}</h5>
        <hr>
        <br>
        <h3>Service Request </h3>
        <servicerequestbar v-for="srq in servicereq" :key="srq.service_request_id" :date="srq.date" :id="srq.service_request_id" :name="srq.service_name"></servicerequestbar> 
        
        <!--<h3 v-for="srq in servicereq">
        {{ srq.service_request_id}}, {{ srq.customer_name }}, {{ srq.service_name }}, {{ srq.professional_name }},{{ srq.status }}</h3> -->
        <hr>
        <br>
        <h3>Service</h3>
        <h5 class=" p-1 jumbotron container d-flex  align-items-center justify-content-center bg-dark text-white" v-for="sr in services">
        {{ sr.service_id}},  {{ sr.service_name }}, {{ sr.time }},{{ sr.price }}
        <button type="button" class="btn btn-info ml-3 mr-3" @click="$router.push('/editservice/'+sr.service_id)">Edit</button>
        <button type="button" class="btn btn-danger" @click="deleteservice(sr.service_id)">Delete</button></h5>
        <br>
        <button type="button" class="btn btn-secondary" @click="$router.push('/newservice')">New service</button>
        <button type="button" class="btn btn-primary" @click="create_csv"> Get ServiceRequest Data </button>
    </div>
    `,
    data(){
        return {
            customers : [],
            professionals: [],
            servicereq : [],
            services : []
        }
    },
    async mounted(){
        const res = await fetch(location.origin + '/admin/customers', {
            headers : {
                'Authentication-Token' : this.$store.state.access_token

                //'Authentication-Token' : JSON.parse(localStorage.getItem('user')).access_token
                //'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).access_token}`
            }
        })
        if (res.ok) {
            const data = await res.json();
            this.customers = data.customers;  
            this.professionals = data.professionals;
            this.servicereq = data.servicereq;
            this.services= data.services;
            

        } else {
            console.error('Error fetching customers:', res.status);
        }
    },
     components : {
         servicerequestbar,
    },
    methods : {
        async deleteservice(service_id){
            //const confirmation = confirm('Are you sure you want to delete this service?');
            //if (!confirmation) return;
            const res = await fetch(`${location.origin}/admin/service/del/${service_id}`,{
                method : 'DELETE',
                headers : {
                    'Authentication-Token' : this.$store.state.access_token,
                    'Content-Type' : 'application/json',
                },
                })
            if (res.ok){
                console.log('service DELETED');
                const data = await res.json();
                alert(data.message)
                this.services = this.services.filter(sr => sr.service_id !== service_id);
            }
        },
        async create_csv(){
            const res = await fetch(location.origin + '/create-csv', {
                headers : {
                    'Authentication-Token' : this.$store.state.access_token
                }
            })
            // if(res.ok){
            const task_id = (await res.json()).task_id
            print(task_id)
            
            const interval = setInterval(async() => {
                const res = await fetch(`${location.origin}/get-csv/${task_id}` )
                if (res.ok){
                    console.log('data is ready')
                    window.open(`${location.origin}/get-csv/${task_id}`)
                    clearInterval(interval)
                }

            }, 100)
        },
    }
}


