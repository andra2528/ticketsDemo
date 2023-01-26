<template>

    <nav class="breadcrumb is-right" aria-label="breadcrumbs">
        <ul>
            <li class="is-active"><a href="/" aria-current="page">Homepage</a></li>
            <li v-if="loggedIn"><a href="/ticket">Create Ticket</a></li>
            <li v-if="loggedIn"><a href="/user">{{currentUsername}}</a></li>
            <li v-else><a href="/user">Login/Register</a></li>
        </ul>
    </nav>

    <header>
        <h1 class="title"> Tickets </h1>
    </header>
   
    <div>
        <router-link :to="{name: 'NewTicket'}" v-show="loggedIn" class="button is-success is-light is-rounded is-outlined">
            Create New Ticket
        </router-link>

        <router-link :to="{name: 'User'}" class="button is-success is-light is-rounded is-outlined second">
            Login/Register
        </router-link>
    </div>

    <div class="table-container">
        <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
            <thead>
                <tr>
                    <th> Title </th>
                    <th> User </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="ticket in tickets" :key="ticket.ticketId">
                    <td class="clickable" v-on:click="goToTicket(ticket.ticketId)"> {{  ticket.title  }} </td>
                    <td> {{  ticket.username  }} </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from "axios";
import helper from "../helper";

export default {
    name: 'AllTickets',
    data() {
        return {
            tickets: [],
            currentUserId: "",
            currentUsername: "",
            loggedIn: false
        }
    },
    created() {
        this.getTickets();
        const currentUser = helper.getCurrentUser();

        if (currentUser) {
            this.loggedIn = true;
            this.currentUsername = currentUser.currentUsername;
        }
    },
    
    methods: {
        async getTickets() {
            try {
                const response = await axios.get("http://localhost:3000/tickets");
                this.tickets = response.data;
            } catch (err) {
                console.error(err);
            }
        },

        async goToTicket(ticketId) {
            try {
                this.$router.push(`/ticket/${ticketId}`);
            } catch (err) {
                console.error(err);
            }
        }
    }


}
</script>

<style>
</style>