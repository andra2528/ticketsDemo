<template>
    <nav class="breadcrumb is-right" aria-label="breadcrumbs">
        <ul>
            <li><a href="/">Homepage</a></li>
            <li class="is-active"><a href="/ticket" aria-current="page">Create Ticket</a></li>
            <li v-if="loggedIn"><a href="/user">{{currentUsername}}</a></li>
            <li v-else><a href="/user">Login/Register</a></li>
        </ul>
    </nav>

    <h1 class="title"> New Ticket </h1>

    <div class="box">
        <Form @submit="saveTicket">
            <div class="field">
                <label class="label"> Title </label>
                <div class="control">
                    <Field name="title" rules="required|max:255|min:1"
                        class="input"
                        type="text"
                        placeholder="Title"
                        v-model="ticketTitle" 
                    />
                    <ErrorMessage name="title" />
                </div>
            </div>
            
            <div class="field">
                <label class="label"> Description </label>
                <div class="control">
                    <Field name="description" rules="required|max:1000|min:1"
                        class="input"
                        type="text"
                        placeholder="Description..."
                        v-model="ticketDesc" 
                    />
                    <ErrorMessage name="description" />
                </div>
            </div>

            <div class="control">
                <button class="button is-success is-light is-rounded is-outlined">
                    <span class="icon is-small">
                        <i class="fa fa-check"></i>
                    </span>
                    <span>Save</span>
                </button>
            </div>
        </Form>
    </div>
</template>

<script>
import axios from "axios";
import helper from "../helper";
import "../validationRules";
import { Form, Field, ErrorMessage } from 'vee-validate';

export default {
    name: "NewTicket",
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        return {
            ticketTitle: "",
            ticketDesc: "",
            loggedIn: true,
            currentUsername: "",
        };
    },
    created() {
        const currentUser = helper.getCurrentUser();

        if (!currentUser) {
            this.loggedIn = false;
        }
        else {
            this.currentUsername = currentUser.currentUsername;
        }
    },
    methods: {
        // Create new ticket
        async saveTicket() {
            try {
                const currentUser = helper.getCurrentUser();

                if (!currentUser) {
                    throw new Error("Not logged in!");
                }

                const currentUserId = currentUser.currentUserId;

                const response = await axios.post("http://localhost:3000/ticket", {
                    title: this.ticketTitle,
                    description: this.ticketDesc,
                    userId: currentUserId
                });
                this.ticketTitle = "";
                this.ticketDesc = "";
                const ticketId = response.data.ticketId;
                this.$router.push(`/ticket/${ticketId}`);
            } catch (err) {
                console.error(err);
            }
        },
    },
}; 
</script>

<style>
</style>