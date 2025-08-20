export default{
    template:`
      <div>
      <div class="container">
        <!-- Dropdown and Search Bar -->
        <div class="input-group mb-3">
            <label class="mt-5 input-group-text mb-3" for="inputGroupSelect01">Options</label>
            <select class="mt-5 form-control mb-3 form-select" id="inputGroupSelect01" v-model="selectedOption">
                <option selected>Choose...</option>
                <option value="Service Name">Service Name</option>
                <option value="Pin code">Pin code</option>
                <option value="Address">Address</option>
                <option value="Ratings">Ratings</option>

            </select>
        </div>
        
        <input class="form-control mb-3" placeholder="Search..." v-model="search"/>
        <button class="btn btn-info w-100 mb-3" @click="searchinfo">Search</button>
      </div>
      <h3 v-for="service in services" 
           v-if="service.service_name!=null"
             class="container jumbotron p-2 mb-1 mt-1 text-center">
      {{service.service_id}},{{service.professional_id}},{{service.professional_name}},
      {{service.pin}},{{service.address}},{{service.service_name}},{{service.ratings}}
        <button type="button" class="btn btn-info w-100 mb-3" @click="book(service)">Book</button></h3>
      </div>`,
    data(){
        return{
            services:{},
            selectedOption:null,
            search:null,
        }
    },
    mounted(){

    },
    methods:{
        async searchinfo(){
            const res = await fetch(`${location.origin}/customer/search`, {
                method: 'POST',
                headers: {
                    'Authentication-Token': this.$store.state.access_token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    search: this.search,
                    place: this.selectedOption
                })
            });
            if(res.ok){
                const data=await res.json();
                this.services=data.services;
            }
        },
        async book(service){
            const res=await fetch(`${location.origin}/customer/request/${service.professional_id}/${service.service_id}`,{
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
        },
    }

}