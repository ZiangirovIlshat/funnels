<template>
    <div class="stat-page">
        <list/>
    </div>
</template>

<script>

import MailsList from "@/components/MailsList.vue"

export default {
    name: "StatPage",

    components: {
        "list": MailsList,
    },

    props: {
        sources: {
            require: true,
            type: Array,
        },

        finalEventType: {
            require: true,
            type: String,
        },

        data: {
            require: true,
            type: Object,
        }
    },

    data() {
        return {
            colors: {
                "tg" : "#229ED9",
                "vk" : "#0077FF",
                "email" : "#FF9C24",
            },

            filteredData: [],

            funnelData: null,
            visualization: null,

            filterUniqueValues: false,
            filterOurEmails: false,
        }
    },

    methods: {
        getFilteredData() {
            this.filteredData = JSON.parse(JSON.stringify(this.data))

            if(this.filterUniqueValues) this.getUniqueValues()
            if(this.filterOurEmails) this.removeOurEmails()

            this.funnelData = this.getFunnels()
        },

        getUniqueValues() {
            for(let key in this.filteredData) {
                this.filteredData[key].transitions = removeDuplicates(this.filteredData[key].transitions)
                this.filteredData[key].registrations = removeDuplicates(this.filteredData[key].registrations)
                this.filteredData[key].views = removeDuplicates(this.filteredData[key].views)
            }

            function removeDuplicates(arr) {
                return arr.filter((item, index) => arr.indexOf(item) === index);
            }
        },

        removeOurEmails() {
            for(let key in this.filteredData) {
                this.filteredData[key].registrations = this.filteredData[key].registrations.filter((email) => email.slice(-7) !== "owen.ru");
                this.filteredData[key].views = this.filteredData[key].views.filter((email) => email.slice(-7) !== "owen.ru");
            }
        },
    },

    created() {
       
    }
}
</script>

<style lang="scss" scoped>
    .stat-page {
        padding-left: 50px;
        padding-right: 50px;
    }

</style>