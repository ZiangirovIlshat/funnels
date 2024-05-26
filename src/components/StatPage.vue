<template>
    <div class="funnel">
        <div class="funnel__body">
            <div class="funnel__visualization">
                <h3>График:</h3>
                <ul>
                    <template
                        v-for="(item, keyI) in funnelData"
                        :key="item"
                    >
                        <li 
                            v-if="visualizationData[keyI].percent > 0"
                            :style="{'min-width': visualizationData[keyI].percent + '%'}"
                        >
                            <template
                                v-for="(sourceCount, keyY) in item"
                                :key="keyY"
                            >
                                <span
                                    :style="{background: colors[keyY], width: (sourceCount / visualizationData[keyI].count * 100) + '%' }"
                                    v-if="sourceCount > 0"
                                >
                                </span>
                            </template>
                        </li>
                    </template>
                </ul>
            </div>
            <br>
            <div class="funnel__filters" v-if="finalEventType === 'registrationAndViewing'">
                <h3>Фильтры:</h3>
                <p>
                    <label>
                        Убрать дубли :
                        <input type="checkbox" @change="getFilteredData()" v-model="filterUniqueValues">
                    </label>
                </p>
                <p>
                    <label>
                        Убрать "owen.ru" :
                        <input type="checkbox" @change="getFilteredData()" v-model="filterOurEmails">
                    </label>
                </p>
            </div>
            <br>
            <div class="funnel__email-lists" v-if="finalEventType === 'registrationAndViewing'">
                <h3>Списки:</h3>
                <list :list="filteredData.registrations">Регистраций</list>
                <br>
                <list :list="filteredData.views">Просмотров</list>
            </div>
        </div>
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
            headings: {
                "tg" : [
                    ["Подписчиков", "Показов", "Переходов", "Регистраций", "Просмотров"],
                    ["Подписчиков", "Показов", "Переходов", "Перешли на сайт организатора"],
                ],
                "vk" : [
                    ["Подписчиков", "Показов", "Переходов", "Регистраций", "Просмотров"],
                    ["Подписчиков", "Показов", "Переходов", "Перешли на сайт организатора"],
                ],
                "email" : [
                    ["Доставлено", "Прочитано", "Переходов", "Регистраций", "Просмотров"],
                    ["Доставлено", "Прочитано", "Переходов", "Перешли на сайт организатора"],
                ],
            },

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
        getFunnels() {
            let funnelsData = {};

            funnelsData.total = {};
            funnelsData.read = {};
            funnelsData.transitions = {};
            if(this.finalEventType === "registrationAndViewing") {
                funnelsData.registrations = {};
                funnelsData.views = {};
            }
            if(this.finalEventType === "goOrganizerWebsite") {
                funnelsData.trafficToOrganizerWebsite = {};
            }

            for(let key in this.filteredData) {
                funnelsData.total[key] = this.filteredData[key].total
                funnelsData.read[key] = this.filteredData[key].read
                funnelsData.transitions[key] = this.filteredData[key].transitions.length

                if(this.finalEventType === "registrationAndViewing") {
                    funnelsData.registrations[key] = this.filteredData[key].registrations.length
                    funnelsData.views[key] = this.filteredData[key].views.length
                }

                if(this.finalEventType === "goOrganizerWebsite") {
                    funnelsData.trafficToOrganizerWebsite[key] = this.filteredData[key].trafficToOrganizerWebsite.length
                }
            }

            return funnelsData
        },

        getVisualization() {
            let globalCounts = {}

            let totalData = this.funnelData.total
            globalCounts.total = { "count" : totalData.tg + totalData.vk + totalData.email, "percent" : 100 }

            function getRowData(sum) {
                return {
                    "count" : sum, 
                    "percent" : (100 * (sum / globalCounts.total.count)).toFixed(2)
                }
            }

            let readData = this.funnelData.read
            globalCounts.read = getRowData(readData.tg + readData.vk + readData.email)

            let transitionsData = this.funnelData.transitions
            globalCounts.transitions = getRowData(transitionsData.tg + transitionsData.vk + transitionsData.email)

            if(this.finalEventType === "registrationAndViewing") {
                let registrationsData = this.funnelData.registrations
                globalCounts.registrations = getRowData(registrationsData.tg + registrationsData.vk + registrationsData.email)
                
                let viewsData = this.funnelData.views
                globalCounts.views = getRowData(viewsData.tg + viewsData.vk + viewsData.email)
            }

            if(this.finalEventType === "goOrganizerWebsite") {
                let trafficData = this.funnelData.trafficToOrganizerWebsite
                globalCounts.trafficToOrganizerWebsite = getRowData(trafficData.tg + trafficData.vk + trafficData.email)
            }

            return globalCounts;
        },

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
        this.filteredData = Object.assign({}, this.data);
        this.funnelData = this.getFunnels()
        this.visualizationData = this.getVisualization()
    }
}
</script>

<style lang="scss" scoped>
    .funnel {
        padding-left: 50px;
        padding-right: 50px;

		&__body {
            margin: 50px 0 0 0;
		}

        h3 {
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 20px 0;
        }

        &__filters {
            p {
                margin: 0 0 10px 0;

                label {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                }

                input {
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                    
                    &:checked {
                        background: #008f86;
                    }
                }
            }
        }

		&__visualization {
            ul {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 12px;
        
                li {
                    border-radius: 5px;
                    box-shadow: 0 0 5px #939393;
                    padding: 5px;
                    display: flex;
                    gap: 2px;
                    align-items: center;
                    justify-content: start;
                    position: relative;

                    span {
                        display: block;
                        border-radius: 5px;
                        outline: 2px solid #fff;
                        min-width: 5px;
                        height: 35px;
                    }
                }
            }
		}
}

</style>