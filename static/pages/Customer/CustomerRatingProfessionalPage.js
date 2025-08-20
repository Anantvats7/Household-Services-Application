export default{
    props:['sid','prof_name','service_name'],
    template:`
    <div class="container">
    <h1 class="text-center mt-5 p-5">
    {{sid}}&nbsp;&nbsp;{{prof_name}}&nbsp;&nbsp;{{service_name}}</h1>
    <input class="form-control mb-3" placeholder="Rating" v-model="rating" />
    <input class="form-control mb-3" placeholder="Review.." v-model="review" />
    <button class='btn btn-primary w-100 mb-3' type="button"  @click="getprofessional()">Submit</button>
    </div>
    `,
    data(){
        return{
            rating:null,
            review:null,

        }
    },
    mounted(){
        //this.getprofessional();
    },
    methods:{
        async getprofessional(){

            if (!this.rating || !this.review) {
                alert("Please fill in all fields");
                return;
            }

            const res=await fetch(`${location.origin}/customer/request/review/${this.sid}`,{
                method:'POST',
                headers:{
                'Authentication-Token':this.$store.state.access_token,
                'Content-Type' : 'application/json',
                },
                body: JSON.stringify({
                    rating:this.rating,
                    review:this.review,
                }),
        });
        if(res.ok){
            const data=await res.json();
            alert(data.message);
            
        }
    }
  }
}