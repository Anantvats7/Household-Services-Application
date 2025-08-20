export default{
    template:`
    <div class="container">
        <input class="mt-5 form-control mb-3" placeholder="Name"  v-model="name_service" />  <br>
        <input  class="mt-2 form-control mb-3" placeholder="Price"  v-model="price" /><br>
        <input class="mt-2 form-control mb-3" placeholder="Description"  v-model="description" /> <br>
        <input class="mt-2 form-control mb-3" placeholder="Time needed"  v-model="time_required" /> <br> 
        
        <button class='btn btn-success w-100 mb-3' @click="createservice"> Create </button>
    </div>
    `,
    data(){
        return {
            name_service : null,
            price : null,
            description : null,
            time_required : null,
        }
    },
    methods : {
        async createservice(){
            if (!this.name_service || !this.price || !this.description || !this.time_required) {
                alert("Please fill out all fields.");
                return;
            }

            const res = await fetch(location.origin+'/admin/service',{
                method : 'POST',
                headers : {
                    'Authentication-Token' : this.$store.state.access_token,
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({'name_service': this.name_service,'price': this.price,'description':this.description,'time_required':this.time_required })
            }
            )
            if (res.ok){
                console.log('new service created');
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