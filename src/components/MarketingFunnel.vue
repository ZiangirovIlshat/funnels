<template>
    <div class="funnels">
        <div class="funnels__body">
            <ul class="funnels__funnel">
                {{funnelData}}
            </ul>
        </div>
    </div>
</template>

<script>

export default {
    name: "MarketingFunnel",

    props: {
        source: {
            require: true,
            type: String,
        },

        finalEventType: {
            require: true,
            type: String,
        },

        color: {
            type: String,
            default: "#3a4e55",
        },

        data: {
            require: true,
            type: Object,
        }
    },

    data() {
        return {
            headings: {
                "tg" : [
                    ["Подписчиков", "Просмотров", "Переходов", "Регистраций", "Просмотров"],
                    ["Подписчиков", "Просмотров", "Переходов", "Перешли на сайт организатора"],
                ],
                "vk" : [
                    ["Подписчиков", "Просмотров", "Переходов", "Регистраций", "Просмотров"],
                    ["Подписчиков", "Просмотров", "Переходов", "Перешли на сайт организатора"],
                ],
                "email" : [
                    ["Доставлено", "Прочитано", "Переходов", "Регистраций", "Просмотров"],
                    ["Доставлено", "Прочитано", "Переходов", "Перешли на сайт организатора"],
                ],
            },

            funnelData: null,
        }
    },

    methods: {
        getFunnel() {
            if(this.finalEventType === "registrationAndViewing") return this.getRegistrationAndViewingFunnel()
            if(this.finalEventType === "goOrganizerWebsite") return this.getGoOrganizerWebsiteFunnel()
        },

        getRegistrationAndViewingFunnel() {
            let funnel = {};
            let headings = this.headings[this.source][0];

            funnel[headings[0]] = 100;
            funnel[headings[1]] = (100 * (this.data.read / this.data.total)).toFixed(2);
            funnel[headings[2]] = (100 * (this.data.transitions.length / this.data.total)).toFixed(2);
            funnel[headings[3]] = (100 * (this.data.registrations.length / this.data.total)).toFixed(2);
            funnel[headings[4]] = (100 * (this.data.views.length / this.data.total)).toFixed(2);

            return funnel;
        },

        getGoOrganizerWebsiteFunnel() {
            let funnel = {};
            let headings = funnel[this.headings[this.source]][1];

            funnel[headings[0]] = 100;
            funnel[headings[1]] = 100 * (this.data.read / this.data.total);
            funnel[headings[2]] = 100 * (this.data.transitions.length / this.data.total);
            funnel[headings[3]] = 100 * (this.data.trafficToOrganizerWebsite.length / this.data.total);

            return funnel;
        },

        getEmailsList() {
            
        },
    },

    created() {
        this.funnelData = this.getFunnel()
    }
}
</script>

<style lang="scss" scoped>
    .funnels {

		&__body {
            margin: 50px 0 0 0;
		}

		&__funnel {
            li {
                height: 30px;
                margin: 0 0 10px 0;
            }
		}
}

</style>