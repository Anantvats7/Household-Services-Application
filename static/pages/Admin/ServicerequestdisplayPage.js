export default {
    props : ['id'],
    template : `
    <div class="container d-flex  align-items-center   min-vh-100">
        <div class="col-12 col-md-8 col-lg-4 mx-auto rounded bg-dark text-white">
        <h1> {{req.service_request_id}} </h1> 
        
        <p> Customer name : {{req.customer_name}} </p>
       <!-- <img width="150" v-bind:src="blog.image_url" /> -->
       <p> Professional name : {{req.professional_name}} </p>
       <p> Service name : {{req.service_name}} </p>
       <p>Request Date  : {{req.request_date}} </p>
       <p> Status : {{req.status}} </p>
       <p> Completion Date : {{req.completion_date}} </p>
        <!-- {{$router.params.id}} -->
        </div>
    </div>
    `,
    data(){
        return {
            req : {},
        }
    },
    
    async mounted(){
        const res = await fetch(`${location.origin}/admin/servicerequest/${this.id}`, {
            headers : {
                'Authentication-Token' : this.$store.state.access_token
            }
        })
        if (res.ok){
            const data = await res.json();
            this.req=data.sreq;
        }
    }
}