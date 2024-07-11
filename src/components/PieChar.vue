<template>
    <div class="pie-chart">
        <p class="pie-chart__non-data" v-if="!getNonData()">
            Нет данных
        </p>
        <div v-else>
            <svg :width="size" :height="size">
                <g transform="translate(85, 85)">
                    <g v-for="(slice, index) in slices" :key="index">
                        <path
                            :d="describeArc(0, 0, 70, slice.startAngle, slice.endAngle)"
                            :fill="slice.color"
                        ></path>
                    </g>
                </g>
            </svg>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            charData: {
                type: Array,
                required: true,
                default: null,
            },
            size: {
                type: Number,
                default: 100,
            },
        },

        computed: {
            slices() {
                let total = this.charData.reduce((sum, item) => sum + item.number, 0);
                let cumulative = 0;
                
                return this.charData.map((item) => {
                    const slice = {
                        startAngle: (cumulative / total) * 2 * Math.PI,
                        endAngle: ((cumulative + item.number) / total) * 2 * Math.PI,
                        color: item.color,
                    };
                    
                    cumulative += item.number;
                    
                    return slice;
                });
            },
        },

        methods: {
            getNonData() {
                if(!this.charData) return
                for (let index = 0; index < this.charData.length; index++) {
                    const element = this.charData[index];
                    if(element.number > 0) return true
                }

                return false;
            },

            describeArc(x, y, radius, startAngle, endAngle){
                var start = this.polarToCartesian(x, y, radius, endAngle);
                var end = this.polarToCartesian(x, y, radius, startAngle);

                var largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

                var d = [
                    "M", start.x, start.y,
                    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
                    "L", x, y,
                    "Z"
                ].join(" ");

                return d;
            },

            polarToCartesian(centerX, centerY, radius, angleInRadians){
                return {
                    x: centerX + (radius * Math.cos(angleInRadians)),
                    y: centerY + (radius * Math.sin(angleInRadians))
                };
            },
        },
    };
</script>

<style lang="scss" sscoped>
    .pie-chart {
        display: inline-block;

        &__non-data {
            color: #979595;
        }
    }
</style>