export default {
    template: `
    <div>
    <div class="container">
        <!-- Dropdown and Search Bar -->
        <div class="input-group mb-3">
            <label class="mt-5 input-group-text mb-3" for="inputGroupSelect01">Options</label>
            <select class="mt-5 form-control mb-3 form-select" id="inputGroupSelect01" v-model="selectedOption">
                <option selected>Choose...</option>
                <option value="Professional">Professional</option>
                <option value="Customer">Customer</option>
                <option value="ServiceRequest">Service Request</option>
                <option value="Service">Service</option>
            </select>
        </div>
        
        <input class="form-control mb-3" placeholder="Search..." v-model="search"/>
        <button class="btn btn-info w-100 mb-3" @click="searchinfo">Search</button>
        </div>
        <hr>

        <!-- Customer List -->
        <div v-if="selectedOption === 'Customer'" class="p-3">
            <h3 class="text-center">Customer List 👌</h3>
            <h5 
                v-for="customer in filteredList" 
                class="container jumbotron text-center p-2"
                @click="$router.push('/customerdisplay/' + customer.customerid)">
                {{ customer.customerid }}, {{ customer.fullname }}, {{ customer.emailid }}
            </h5>
        </div>

        <!-- Professional List -->
        <div v-if="selectedOption === 'Professional'">
            <h3 class="text-center">Professionals List</h3>
            <h5 
                v-for="pro in filteredList" 
                class="container jumbotron p-2 mb-1 mt-1 text-center"
                @click="$router.push('/professionaldisplay/' + pro.professionalid)">
                {{ pro.professionalid }}, {{ pro.fullname }}, {{ pro.emailid }}, {{ pro.status }}
            </h5>
        </div>

        <!-- Service Request List -->
        <div v-if="selectedOption === 'ServiceRequest'">
            <h3 class="text-center">Service Request</h3>
            <h5 
                v-for="srq in filteredList" 
                class="container jumbotron p-2 mb-1 mt-1 text-center"
                @click="$router.push('/servicerequestdisplay/' + srq.service_request_id)">
                {{ srq.date }}, {{ srq.service_request_id }}, {{ srq.service_name }}, {{ srq.customer_name }}
            </h5>
        </div>

        <!-- Service List -->
        <div v-if="selectedOption === 'Service'">
            <h3 class="text-center">Service List</h3>
            <h5 
                v-for="sr in filteredList" 
                class="col-12 col-sm-6 col-md-4 p-1 jumbotron container d-flex align-items-center justify-content-center bg-dark text-white">
                {{ sr.service_id }}, {{ sr.service_name }}, {{ sr.time }}, {{ sr.price }}
                <button type="button" class="btn btn-info ml-3 mr-3" @click="$router.push('/editservice/' + sr.service_id)">Edit</button>
                <button type="button" class="btn btn-danger" @click="deleteservice(sr.service_id)">Delete</button>
            </h5>
        </div>
    </div>
    `,
    
    data() {
        return {
            search: '',
            selectedOption: '',
            filteredList: []  // Directly store filtered results here
        };
    },

    methods: {
        async searchinfo() {
            if (!this.search || !this.selectedOption) {
                alert("Please fill all the fields");
                return;
            }
            // Fetch filtered data directly from the API and store in filteredList.
            const res = await fetch(`${location.origin}/admin/search`, {
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
            
            if (res.ok) {
                const data = await res.json();
                // Directly set the filtered data from the API to filteredList based on selectedOption
                //this.filteredList = data.customers || data.professionals || data.servicereq || data.services || [];
                if (this.selectedOption === 'Customer') {
                    this.filteredList = data.customers;
                } else if (this.selectedOption === 'Professional') {
                    this.filteredList = data.professionals;
                } else if (this.selectedOption === 'ServiceRequest') {
                    this.filteredList = data.servicereq;
                } else if (this.selectedOption === 'Service') {
                    this.filteredList = data.services;
                } else {
                    this.filteredList = [];  // Reset if no valid option is selected
                }
    
                
                console.log('Filtered Data:', this.filteredList);  // Verify API response structure here if needed
            }
        },

        deleteservice(serviceId) {
            // Implement the delete function for services
            console.log(`Delete service with ID: ${serviceId}`);
        }
    }
};
