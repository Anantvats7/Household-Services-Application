export default {
    template: `
    <div class="container d-flex justify-content-center align-items-center min-vh-100">
        <div v-if="!paymentComplete">
            <h3 class="text-center">Payment</h3>
            <img :src="'https://pbs.twimg.com/media/C1U0271WgAA5Flp?format=jpg&name=small'">
        </div>
        <div v-else>
            <h3>Payment Successful!</h3>
            <p>Thank you for your payment.</p>
        </div>
    </div>
    `,
    data() {
        return {
            timer: 5,
            paymentComplete: false, 
        };
    },
    methods: {
        startPaymentTimer() {
            const interval = setInterval(() => {
                if (this.timer > 0) {
                    this.timer--;
                } else {
                    clearInterval(interval);
                    this.paymentComplete = true; 
                }
            }, 1000); // Update every second
        },
    },
    mounted() {
        this.startPaymentTimer();
    },
};
