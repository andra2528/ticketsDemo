<template>
    <nav class="breadcrumb is-right" aria-label="breadcrumbs">
        <ul>
        <li><a href="/">Homepage</a></li>
        <li v-if="loggedIn"><a href="/ticket">Create Ticket</a></li>
        <li class="is-active"><a href="/user" aria-current="page">Login/Register</a></li>
        </ul>
    </nav>

    <h1 class="title"> Login/Register</h1>

    <div class="box">
        <Form @submit="saveUser">
            <div class="field">
                <label class="label"> Username </label>
                <div class="control">
                    <Field name="username" rules="required|alpha_num|max:255|min:1"
                        class="input"
                        type="text"
                        placeholder="username"
                        v-model="username" 
                    />
                    <ErrorMessage name="username" />
                </div>
            </div>

            <div class="control">
                <button class="button is-success is-light is-rounded is-outlined">
                    <span class="icon is-small">
                        <i class="fa fa-check"></i>
                    </span>
                    <span>Login/Register</span>
                </button>
            </div>
        </Form>

        <div v-show="loggedIn" class="control">
            <button class="button is-danger is-light is-rounded is-outlined" @click="logout">
                <span>Logout</span>
            </button>
        </div>
    </div>

</template>

<script>
import axios from "axios";
import helper from "../helper";
import "../validationRules";
import { Form, Field, ErrorMessage } from 'vee-validate';

export default {
    name: "AddUser",
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    
    data() {
        return {
            username: "",
            loggedIn: false,
        };
    },
    created() {
        const currentUser = helper.getCurrentUser();

        if (currentUser) {
            this.loggedIn = true;
        }
    },
    methods: {
        // Create new user
        async saveUser() {
            try {
                const response = await axios.post("http://localhost:3000/user", {
                    username: this.username,
                });
                const userId = response.data.userId;
                const username = response.data.username;
                helper.setCurrentUser(userId, username);
                this.username = "";
                this.$router.push("/");
            } catch (err) {
                console.error(err);
            }
        },

        logout() {
            localStorage.removeItem('currentUsername');
            localStorage.removeItem('currentUserId');
            this.$router.push("/");
        }
    },
};

</script>

<style>
</style>