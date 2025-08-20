export default{
    props:['service_id'],
    template:`
    <div class="container">
        <h1 align="center" class="mt-3" >Edit Service</h1>
        <input class="mt-3 form-control mb-3" placeholder="Name"  v-model="name_service"/>  <br>
        <input  class="mt-2 form-control mb-3"  placeholder="Price"  v-model="price"/><br>
        <input class="mt-2 form-control mb-3"  placeholder="Description"  v-model="description"/> <br>
        <input class="mt-2 form-control mb-3" placeholder="Time needed"  v-model="time_required"/> <br> 

        <button class='btn btn-warning w-100 mb-3' @click="editservice"> Edit </button>
    </div>
    `,
    data(){
        return {
            name_service : null,
            price : null,
            description : null,
            time_required : null,
            sreq : {},
        }
    },
    mounted() {
        this.fetchServiceDetails();
    },
    methods : {
            async fetchServiceDetails() {
                    const res = await fetch(`${location.origin}/admin/service/view/${this.service_id}`, 
                        {
                            method : 'GET',
                            headers: {
                                'Authentication-Token': this.$store.state.access_token,
                                }
                        });
                    if (res.ok) {
                        const data = await res.json();
                        this.name_service = data.sreq.service_name;
                        this.price = data.sreq.price;
                        this.description = data.sreq.description;
                        this.time_required = data.sreq.time;
                    } else {
                        console.error('Failed to fetch service details');
                    }
                }, 

        async editservice(){
            const res = await fetch(`${location.origin}/admin/service/edit/${this.service_id}`,{
                method : 'PUT',
                headers : {
                    'Authentication-Token' : this.$store.state.access_token,
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({
                    name: this.name_service,
                    price: this.price,
                    description: this.description,
                    time_required: this.time_required,
                }),
            }
            )
            if (res.ok){
                console.log('service edited sucessfully');
                const data = await res.json();
                alert(data.message);
                this.name_service = null;
                this.price = null;
                this.description = null;
                this.time_required = null;
             }
        }
    }

}