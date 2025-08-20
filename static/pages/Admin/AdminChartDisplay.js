
export default {
    template: `
      <div>
          <h1 class="text-center" style="color: rgba(255, 165, 0, 1);">Chart</h1>
          <!-- You can add your chart here -->
          <canvas ref="myChart" width="400" height="150"></canvas>
      </div>
    `,
    data() {
      return {
        chartData: {
            labels: [],
            data: [],
          },
      };
    },
  
    async mounted() {
      
      const res = await fetch(`${location.origin}/admin/generate-chart-data`, {
        headers: {
          'Authentication-Token': this.$store.state.access_token, 
        },
      });
  
      if (res.ok) {
        const data = await res.json();
        this.chartData.labels = data.labels || [];
        this.chartData.data = data.data || [];

        this.createChart();
      } else {
        console.error('Failed to fetch chart data');
      }
    },
  
    methods: {
      createChart() {
        // Get the canvas element
        const ctx = this.$refs.myChart.getContext('2d');
  
        // Create the chart with the data
        new Chart(ctx, {
          type: 'bar', // You can change this to 'line', 'pie', etc.
          data: {
            //labels: this.req.labels || [], // Assuming labels are part of the response
            labels: this.chartData.labels,
            datasets: [{
              label: 'Service Request Data',
              data: this.chartData.data,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      },
    },
  };
  