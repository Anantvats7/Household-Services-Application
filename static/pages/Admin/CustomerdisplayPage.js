export default {
    props : ['customerid'],
    template : `
    <div class="container d-flex  align-items-center   min-vh-100">
        <div class="col-12 col-md-8 col-lg-4 mx-auto rounded bg-dark text-white">
        <h1> {{customer.customerid}} </h1> 
        
        <p> Email : {{customer.emailid}} </p>
       <p> Professional name : {{customer.fullnamename}} </p>
       <p> Address : {{customer.Address}} </p>
       <p>Phone  : {{customer.Phone}} </p>
       <p> Pincode : {{customer.Pin}} </p>
       <!--<p> Status : {{customer.status}} </p>-->
        <button class="btn btn-danger w-100 mb-3" @click="toggleBlock">{{ customer.isblocked ? 'Unblock' : 'Block' }}</button>
        </div>
    </div>
    `,
    data(){
        return {
            customer : {},
           
        }
    },
    mounted() {
        this.fetchCustomerData();
      },
methods:{
    async fetchCustomerData(){
        const res = await fetch(`${location.origin}/admin/customer/view/${this.customerid}`, {
            headers : {
                'Authentication-Token' : this.$store.state.access_token
            }
        });
        if (res.ok){
            const data = await res.json();
            this.customer=data.customer;
        }
    },
    
    async toggleBlock() {
      const newStatus = this.customer.isblocked ? false : true;
      //this.customer.isblocked = newStatus;
      this.$set(this.customer, 'isblocked', newStatus);
      const res = await fetch(`${location.origin}/admin/customer/block/${this.customerid}`, {
        method: 'POST',
        headers: {
          'Authentication-Token' : this.$store.state.access_token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isblocked: newStatus })
      });
      if (res.ok) {
        const data = await res.json();
        alert(data.message);
         // Update local status
      }
    }
  },
 
}
