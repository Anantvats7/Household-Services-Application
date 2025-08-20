export default {
    template: `
    <div>
      <div class="container">
        <!-- Dropdown and Search Bar -->
        <div class="input-group mb-3">
            <label class="mt-5 input-group-text mb-3" for="inputGroupSelect01">Options</label>
            <select class="mt-5 form-control mb-3 form-select" id="inputGroupSelect01" v-model="selectedOption">
                <option selected>Choose...</option>
                <option value="Name">Customer Name</option>
                <option value="start_date">Request date</option>
                <option value="end_date">End date</option>
                <option value="status">Status</option>
            </select>
        </div>
        
        <input class="form-control mb-3" placeholder="Search..." v-model="search"/>
        <button class="btn btn-info w-100 mb-3" @click="searchinfo">Search</button>
      </div>
      <hr>
  
      <!-- Search Results -->
      <div v-if="searchresult && searchresult.length">
        <h3>Search Results</h3>
        <div v-for="sr in searchresult" :key="sr.id">
          <h5 class="jumbotron">
            {{ sr.service_request_id }}, {{ sr.customer_name }}, {{ sr.service_name}}, {{ sr.date }}, {{ sr.service_status }}
            <!--<button type="button" class="btn btn-info" @click="toggleback(sr)">
              {{ sr.service_status === 'accept' ? 'reject' : 'accept' }}
            </button>
            <button type="button" class="btn btn-danger" @click="closing(sr.service_request_id)">Close</button>-->
            <button type="button" class="btn btn-primary" @click="Accept(sr)" v-if="sr.service_status==='requested'">Accept</button>
            <button type="button" class="btn btn-info" @click="Reject(sr)" v-if="sr.service_status==='requested'">Reject</button>
            <button type="button" class="btn btn-danger" @click="closing(sr.id)" v-if="sr.service_status!=='closed' && sr.service_status!=='rejected' ">Close</button>
          </h5>
        </div>
      </div>
           <!-- No Search Results Found -->
        <div v-else-if="searchPerformed && searchresult.length === 0">
        <p>No matching results found.</p>
            </div>
        <div v-else>
        <!-- Pending Service Requests if no search results -->
        <div v-if="services && services.length">
          <h3>Pending Service</h3>
          <div v-for="sr in services" :key="sr.id">
            <h5 class="jumbotron">
              {{ sr.service_id }}, {{ sr.customer_id }}, {{ sr.id }}, {{ sr.date_of_request }}, {{ sr.service_status }}
              <!--<button type="button" class="btn btn-info" @click="toggleback(sr)">
                {{ sr.service_status === 'accept' ? 'reject' : 'accept' }}
              </button>-->

              <button type="button" class="btn btn-primary" @click="Accept(sr)" v-if="sr.service_status==='requested'">Accept</button>
              <button type="button" class="btn btn-info" @click="Reject(sr)" v-if="sr.service_status==='requested'">Reject</button>
              <button type="button" class="btn btn-danger" @click="closing(sr.id)" v-if="sr.service_status!=='closed' && sr.service_status!=='rejected'">Close</button>
            </h5>
          </div>
        </div>
        <div v-else>
          <h3>No pending service requests available.</h3>
        </div>
        <hr>
        <!-- Closed Service Requests if no search results -->
        <div v-if="servicereq && servicereq.length">
          <h3>Closed Service</h3>
          <div v-for="srq in servicereq" :key="srq.id">
            <h5 class="jumbotron">
              {{ srq.service_id }}, {{ srq.customer_id }}, {{ srq.id }}, {{ srq.date_of_request }}, {{ srq.service_status }}
            </h5>
          </div>
        </div>
        <div v-else>
          <h3>No closed service requests available.</h3>
        </div>
      </div>
    </div>  
    `,
    data() {
      return {
        services: [],
        servicereq: [],
        searchresult:[],
        searchPerformed:false,
        search:null,
        selectedOption:null,
      };
    },
    mounted() {
      this.newServiceRequest();
    },
    methods: {
      async newServiceRequest() {
        try {
          const res = await fetch(`${location.origin}/professional/service-requests`, {
            headers: {
              'Authentication-Token': this.$store.state.access_token
            }
          });
          if (res.ok) {
            const data = await res.json();
            console.log("Fetched data:", data);
            this.services = data.services || [];
            this.servicereq = data.servicereq || [];
          }
        } catch (error) {
          console.error("Error fetching service requests:", error);
        }
      },
  
      // async toggleback(sr) {
      //   if (!sr || !sr.service_status) return;
      //   const newStatus = sr.service_status === 'accept' ? 'reject' : 'accept';
      //   sr.service_status = newStatus;
      //   try {
      //     const res = await fetch(`${location.origin}/service-requests/action/${sr.id}`, {
      //       method: 'POST',
      //       headers: {
      //         'Authentication-Token': this.$store.state.access_token,
      //         'Content-Type': 'application/json'
      //       },
      //       body: JSON.stringify({ action: newStatus })
      //     });
      //     if (res.ok) {
      //       const data = await res.json();
      //       alert(data.message);
      //     }
      //   } catch (error) {
      //     console.error("Error updating service status:", error);
      //   }
      // },

      async Accept(sr) {
        if (!sr) return;
        const newStatus = 'accept';
        sr.service_status = newStatus;
        try {
          const res = await fetch(`${location.origin}/service-requests/action/${sr.id}`, {
            method: 'POST',
            headers: {
              'Authentication-Token': this.$store.state.access_token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: newStatus })
          });
          if (res.ok) {
            const data = await res.json();
            alert(data.message);
          }
        } catch (error) {
          console.error("Error updating service status:", error);
        }
      },

      async Reject(sr) {
        if (!sr) return;
        const newStatus  = 'reject';
        sr.service_status = newStatus;
        try {
          const res = await fetch(`${location.origin}/service-requests/action/${sr.id}`, {
            method: 'POST',
            headers: {
              'Authentication-Token': this.$store.state.access_token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: newStatus })
          });
          if (res.ok) {
            const data = await res.json();
            alert(data.message);
          }
        } catch (error) {
          console.error("Error updating service status:", error);
        }
      },
  
      async closing(service_id) {
        try {
          const res = await fetch(`${location.origin}/service-requests/close/${service_id}`, {
            method: 'POST',
            headers: {
              'Authentication-Token': this.$store.state.access_token,
              'Content-Type': 'application/json'
            }
          });
          if (res.ok) {
            const data = await res.json();
            alert(data.message);
            this.services = this.services.filter(service => service.service_id !== service_id);
          }
        } catch (error) {
          console.error("Error closing service request:", error);
        }
      },
      async searchinfo() {
        this.searchPerformed=true;
        // Fetch filtered data directly from the API and store in filteredList.
        const res = await fetch(`${location.origin}/professional/search`, {
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
            console.log("Fetched data:", data);
            this.searchresult = data.services || [];
        }
    },
    }
  };
  