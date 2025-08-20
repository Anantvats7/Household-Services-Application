
export default {
    props: ['id', 'date', 'name'],
    template: `
    <div class="jumbotron container d-flex  align-items-center justify-content-center bg-dark text-white p-1 mb-1">
        <p><h5 @click="$router.push('/servicerequestdisplay/'+id)"> {{id}} ,{{name}}, Order date : {{formattedDate}}</p></h5>
    </div>
    `,
    computed: {
        formattedDate() {
            return new Date(this.date).toLocaleString();
        }
    }
}
