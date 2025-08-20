export default{
    template:`
        <div>
            <div>
            <h3 class="text-center">Service</h3>
            <h5 class=" jumbotron container text-center  p-2 mb-1 mt-1 " v-for="sr in services"
            @click="$router.push('/customer-servicebooking/'+sr.service_id)">
            {{ sr.service_id}},  {{ sr.service_name }}, {{ sr.time }},{{ sr.price }}</h5>
            <hr style="width: 50%;">
            </div>

            <div>
            <h3 class="text-center">Service Request</h3>
            <h5 
                v-for="srq in servicerequest" 
                class="container jumbotron p-2 mb-1 mt-1 text-center">
             {{ srq.id }},{{ srq.s_date }}, {{ srq.service_name }},{{srq.prof_name}} ,{{ srq.service_status }},{{ srq.closedby }}
             <button type="button" class="btn btn-warning"  @click="edit(srq)">Edit</button>
             <button type="button" class="btn btn-success" v-if="srq.service_status!=='closed'" @click="close(srq)">Close</button>
            </h5>
            </div>
        </div>
    `,
    data(){
        return{
        servicerequest:[],
        services:[],
        }
    },
    mounted(){
        this.load();
    },
    methods:{
        async load(){
            const res=await fetch(location.origin+'/customer/dash',{
                method:'GET',
                headers:{
                    'Authentication-Token': this.$store.state.access_token,
                },
            });
            if(res.ok){
                const data=await res.json();
                this.servicerequest=data.service_requests;
                this.services=data.services;
            }
        },
        async close(srq){
            const res=await fetch(`${location.origin}/customer/request/close/${srq.id}`,{
                method:'POST',
                headers:{
                'Authentication-Token':this.$store.state.access_token,
                },
            });
            if(res.ok){
                const data=await res.json();
                alert(data.message);
                this.$router.push(`/customer-request-rating/${srq.id}/${srq.prof_name}/${srq.service_name }`)
            }
        },
        async edit(srq){
            this.$router.push(`/customer-edit-servicebooking/${srq.id}`);
        }

    }
}