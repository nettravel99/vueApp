const vueApp = new Vue({
    el: "#app",
    template: `
    <div>
    <p> Good Morning {{name}}</p>
    <button v-on:click="buttonClick()">Button</button>

    <table style="width:100%">
        <tr>
            <th>Date</th>
            <th>Entity</th>
            <th>Entity Sel</th>
            <th>Errors</th>
            <th>Form</th>
            <th>Group Prov</th>
            <th>Status</th>
            <th>Time</th>

        </tr>
   
        <tr v-for="item in result">

            <td>{{item.date}}</td>
            <td>{{item.entity}}</td>
            <td>{{item.entitysel}}</td>
            <td>{{item.errors}}</td>
            <td>{{item.form}}</td>
            <td>{{item.groupprov}}</td>
            <td>{{item.status}}</td>
            <td>{{item.time}}</td>
     
        </tr>
     
    </table>
    </div>
`,
    data: {

        name: 'George',
        credentials: {
            user: "john"
        },
        result: null,
        items: [
            {
                message: 'Foo'
            }, {
                message: 'Bar'
            }
        ]

    },
    mounted() {
        console.log("Mounted called")
        axios
            .post("http://127.0.0.1:5099/A^GJGAXIOS", this.credentials)
            .then(response => {

                this.result = response.data.data;
                console.log("Results from Mounted: ", this.result);

            })

    },

    methods: {

        api() {

            axios
                .post("http://127.0.0.1:5099/A^GJGAXIOS", this.credentials)
                .then(response => {
                    this.result = response.data.data;
                    console.log("Results: ", this.result);

                });

        },
        // async api() {     const result = await
        // axios.post("http://127.0.0.1:5099/A^GJGAXIOS", this.credentials); this.result
        // = result.data.data;     console.log("Results: ", this.result); },
        buttonClick(event) {
            alert('Button click');

        }
    }
});
