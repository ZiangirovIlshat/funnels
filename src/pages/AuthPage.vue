<template>
    <div class="auth">
        <div  class="auth__form">
            <p>Введите пароль</p>
            <br>
            <input
                type="text"
                name="password"
                maxlength="20"
                v-model="password"
                :class="{'__err' : isInvalidPassword}"
            >
            <p 
                class="auth__err-message"
                :class="{'__err' : isInvalidPassword}"
            >Неверный пароль</p>
            <br>
            <button @click="login()">Войти</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            password: "",
            isInvalidPassword: false,
        }
    },

    methods: {
        async login() {
            try {
                const response = await fetch("http://localhost/funnels_api/user/login", {
                    method: "POST",
                    credentials: "include",
                    body: new URLSearchParams({"password" : this.password})
                })

                if(response.ok) this.$router.push("/")
            } catch (error) {
                this.isInvalidPassword = true
            }
        }
    },
}
</script>

<style lang="scss" scoped>
    .auth {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;

		&__form {
            border: 2px solid #2c3e50;
            border-radius: 5px;
            width: 400px;
            height: 200px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            input {
                border: 2px solid #2c3e50;
                border-radius: 5px;
                padding: 10px;
                text-align: center;

                &.__err {
                    border: 2px solid #9f0412;
                }
            }

            button {
                padding: 5px 20px;
                border-radius: 5px;
                background: #008f86;
                color: #fff;
            }
		}

        &__err-message {
            opacity: 0;
            color: #9f0412;

            &.__err {
                opacity: 1;
            }
        }
}

</style>
