export default {
    props : ['professionalid'],
    template : `
    <div class="container d-flex  align-items-center   min-vh-100">
        <div class="col-12 col-md-8 col-lg-4 mx-auto rounded bg-dark text-white">
        <h1> {{pro.professional_id}} </h1> 
        
        <p> Email : {{pro.Email}} </p>
       <p> Professional name : {{pro.professional_name}} </p>
       <p> Address : {{pro.Address}} </p>
       <p>Phone  : {{pro.Phone}} </p>
       <p> Pincode : {{pro.Pin}} </p>
       <p> Ratings : {{pro.Rating}} </p>
       <p v-if="pro.link && pro.link.length>0">Resume link : <a :href="pro.link" target="_blank">Click to see documents</a></p>
       <!-- {{pro.Action}} 
        <button class='btn btn-success btn-lg' @click="submitApprove" :disabled="isDisabled"> Approve </button>-->
        <button class='btn btn-success w-100 mb-3' @click="submitApprove" v-if="pro.isapprove==false"> Approve </button>
        <button class="btn btn-danger w-100 mb-3" @click="toggleBlock">{{ pro.Status === 'blocked' ? 'Unblock' : 'Block' }}</button>
        </div>
    <!-- PDF Display 
    <pdf v-if="pro.doc" :src="pro.doc" width="100%" height="600" /> -->
    </div>
    `,
    data(){
        return {
            pro : {},
            //isDisabled: false,
        }
    },
    mounted() {
        this.fetchProfessionalData();
      },
methods:{
    async fetchProfessionalData(){
        const res = await fetch(`${location.origin}/admin/professional/${this.professionalid}`, {
            headers : {
                'Authentication-Token' : this.$store.state.access_token
            }
        });
        if (res.ok){
            const data = await res.json();
            this.pro=data.prof;
        }
    },
    async submitApprove(){
        const res = await fetch(`${location.origin}/admin/professional/approve/${this.professionalid}`, 
            {
                method : 'POST', 
                headers: {
                    'Authentication-Token' : this.$store.state.access_token,
                    'Content-Type' : 'application/json'}, 

            });
            if (res.ok) {
                const data = await res.json();
                alert(data.message);
                //this.isDisabled=true;
                this.pro.isapprove=true;
            }
        },
    async toggleBlock() {
      const newStatus = this.pro.Status === 'blocked' ? 'unblocked' : 'blocked';
      this.pro.Status = newStatus;
      const res = await fetch(`${location.origin}/admin/professional/block/${this.professionalid}`, {
        method: 'POST',
        headers: {
          'Authentication-Token' : this.$store.state.access_token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const data = await res.json();
        alert(data.message);
      }
    }
  },
  components: {
    Pdf: window['vue-pdf-no-ssr'], // Local registration
  },
}
