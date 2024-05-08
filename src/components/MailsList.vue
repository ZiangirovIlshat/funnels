<template>
    <div class="drop-dawn-list" @click="isOpen = !isOpen">
        qweqweq
        <div class="drop-dawn-list__header">
            <div class="drop-dawn-list__heading">
                <slot></slot>
            </div>
            <span></span>
        </div>
        <div class="drop-dawn-list__body">
            <ul>
                <li v-for="(email, index) in list" :key="email"><b>{{index+1}}</b> {{email}}</li>
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
            type: String,
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
        
    }
</style>