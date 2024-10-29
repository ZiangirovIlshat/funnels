<template>
    <div class="drop-dawn-list">
        <div class="drop-dawn-list__header" @click="isOpen = !isOpen">
            <div class="drop-dawn-list__heading">
                <slot></slot>
            </div>
            <span :class="{ '__open' : isOpen }"></span>
        </div>
        <div class="drop-dawn-list__body" :class="{ '__open' : isOpen }">
            <ul v-show="isOpen">
                <template v-for="(email, index) in list" :key="index">
                    <li v-if="email"><b>{{index+1}}) </b> {{email}}</li>
                </template>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name : "MailsList",

    props: {
        list: {
            require: true,
            type: Array,
        }
    },

    data() {
        return {
            isOpen: false,
        }
    }
}
</script>

<style lang="scss" scoped>
    .drop-dawn-list {
        border: 1px solid;
        border-radius: 5px;

		&__header {
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            gap: 10px;
            font-weight: 700;
            padding: 18px;

            &:hover {
                background: rgba(84, 104, 111, 0.1);
            }

            span {
                display: block;
                height: 25px;
                width: 25px;
                position: relative;

                &::before, &::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 2px;
                    width: 100%;
                    background: #2c3e50;
                    transition: .3s;
                }

                &::before {
                    top: 50%;
                    transform: rotate(90deg);
                }

                &::after {
                    top: calc(50% - 1px)
                }

                &.__open {
                    &::before {
                        top: 50%;
                        transform: rotate(45deg);
                    }

                    &::after {
                        top: 50%;
                        transform: rotate(-45deg);
                    }
                }
            }
		}

		&__heading {
            span {
                color: #939393;
            }
		}

		&__body {
            transition: margin .3s;

            &.__open {
                padding: 0 20px 20px 20px;
                margin: 20px 0 0 0;
            }
		}
}

</style>