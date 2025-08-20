export default{
    props : ['id'],
    template : `
    <div class="container d-flex  align-items-center   min-vh-100">
        <div class="col-12 col-md-8 col-lg-4 mx-auto rounded bg-dark text-white">
        <h1> Service request id : {{req.id}} </h1> 
        
        <p> Customer id : {{req.customer_id}} </p>
       <!-- <img width="150" v-bind:src="blog.image_url" /> -->
       <p> Professional name : {{req.prof_name}} </p>
       <p> Service name : {{req.service_name}} </p>
       <p>Request Date  : <input type="datetime-local"  v-model="start_date"/> </p>
       <p> Status : <input placeholder="status" v-model="status" /></p>
       <p> Review : <input placeholder="remarks" v-model="remarks" /> </p>
       <p>{{req.date_of_completion}}</p>
        <!-- {{$router.params.id}} -->
        <button type="button" class="btn btn-primary w-100 mb-3" @click="edit">Submit</button>
        </div>
    </div>
    `,
    data(){
        return {
            req : {},
            start_date:null,
            status:null,
            remarks:null,
        }
    },
    mounted(){
        this.getservicerequest();
    },
    methods:{
    async getservicerequest(){
        const res = await fetch(`${location.origin}/customer/request/view/${this.id}`, {
            headers : {
                'Authentication-Token' : this.$store.state.access_token,
            }
        })
        if (res.ok){
            const data = await res.json();
            this.req=data.sreq;
            //this.start_date=this.req.s_date;
            this.status=this.req.service_status;
            this.remarks=this.req.remarks;
        }
    },
    async edit(){
        const res=await fetch(`${location.origin}/customer/request/edit/${this.id}`,{
            method:'PUT',
            headers:{
            'Authentication-Token':this.$store.state.access_token,
            'Content-Type' : 'application/json',
            },
            body: JSON.stringify({
                status:this.status,
                remarks:this.remarks,
                start_date:this.start_date,
            }),
    });
    if(res.ok){
        const data=await res.json();
        alert(data.message);
        
    }

    }

    }
}