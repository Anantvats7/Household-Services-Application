export default{
    props:['id'],
    template:`
    <div>
        <div v-for="service in services" :key="service.service_id">
        <h1 class="text-center">{{service.service_name}}</h1>
        <h3 class="p-3 m-5 bg-secondary text-center" v-for="pro in service.professionals" :key="pro.professional_id">
        {{pro.professional_id}},{{pro.fullname}},{{pro.average_rating}}
        <button type="button" class="btn btn-primary" @click="book(service,pro.professional_id)">Book</button>
        </h3>
        </div>
    
    
    </div>`,
    data(){
        return{
            services:[],
            pro:[],
        }
    },
    mounted(){
        this.getprofessional();
    },
    methods:{
        async getprofessional(){
            const res=await fetch(`${location.origin}/customer/professional/${this.id}`,{
                method:'GET',
                headers:{
                    'Authentication-Token': this.$store.state.access_token,
                },
            });
            if(res.ok){
                const data=await res.json();
                this.services=data.services;
                //this.display=this.data.
            }
        },
        async book(service,professional_id){
            const res=await fetch(`${location.origin}/customer/request/${professional_id}/${service.service_id}`,{
                method:'POST',
                headers:{
                    'Authentication-Token':this.$store.state.access_token,
                },

            });
            if (res.ok){
                const data=await res.json();
                alert(data.message);
                this.$router.push(`/customer-payement`);
            }
        }
    }
}