<template>
    <nav class="breadcrumb is-right" aria-label="breadcrumbs">
        <ul>
        <li><a href="/">Homepage</a></li>
        <li v-if="canComment"><a href="/ticket">Create Ticket</a></li>
        <li v-if="canComment"><a href="/user">{{currentUsername}}</a></li>
        <li v-else><a href="/user">Login/Register</a></li>
        </ul>
    </nav>

    <div class="block">
        <h1 class="title">{{ ticket.title }}</h1>

        <p is-size-6><b>Description</b></p>
        <p is-size-4>{{ ticket.description }}</p>
    </div>
    

    <div v-show="canDelete" class="control">
        <button class="button is-danger is-light is-rounded is-outlined" @click="deleteTicket">
            <span class="icon is-small">
                <i class="fa fa-times"></i>
            </span>
            <span>Delete</span>
        </button>
    </div>

    <div class="table-container">
        <table class="table is-striped is-bordered mt-2 is-fullwidth">
            <thead>
                <tr>
                    <th> Comment </th>
                    <th> User </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="comment in comments" :key="comment.commentId">
                    <td> {{  comment.text  }} </td>
                    <td> {{  comment.username  }} </td>
                </tr>
            </tbody>
        </table>

    </div>

    <div>
        <nav class="level">
            <div class="level-left">
                <div class="level-item">
                    <Form @submit="addComment">
                        <div class="field has-addons">
                            <div class="control">
                                <Field v-show="canComment" name="text" rules="required|max:1000|min:1"
                                    class="input"
                                    type="text"
                                    placeholder="Comment..."
                                    v-model="commentText" 
                                />
                                <ErrorMessage name="text"/>
                            </div>
                            <div class="control">
                                <button v-show="canComment" class="button is-success is-light is-rounded is-outlined">
                                    <span class="icon is-small">
                                        <i class="fa fa-check"></i>
                                    </span>
                                    <span>Add comment</span>
                                </button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
import axios from "axios";
import helper from "../helper";
import "../validationRules";
import { Form, Field, ErrorMessage } from 'vee-validate';

export default {
    name: "TicketComments",
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        return {
            ticket: "",
            comments: "",
            commentText: "",
            canDelete: false,
            canComment: false,
            currentUsername: "",
        }
    },

    created() {
        this.getTicket(this.$route.params.ticketId).then(this.checkUser);
        const currentUser = helper.getCurrentUser();

        if (currentUser) {
            this.currentUsername = currentUser.currentUsername;
        }
    },

    methods: {
        async getTicket(ticketId) {
            try {
                const response = await axios.get(`http://localhost:3000/ticket/${ticketId}`);
                this.ticket = response.data.ticketInfo;
                this.comments = response.data.commentsInfo;
            } catch (err) {
                console.error(err);
            }
        },

        async deleteTicket() {
            try {
                const userId = helper.getCurrentUser().currentUserId;
                const ticketId = this.ticket.ticketId;
                if (userId == this.ticket.userId) {
                    await axios.delete(`http://localhost:3000/ticket/${ticketId}`, {
                       data: { userId }
                    });
                    this.$router.push("/");
                }
            } catch (err) {
                console.error(err);
            }
        },

        async addComment() {
            try {
                const currentUser = helper.getCurrentUser();

                if (!currentUser) {
                    return;
                }

                const userId = currentUser.currentUserId;
                const ticketId = this.ticket.ticketId;
                const response = await axios.post(`http://localhost:3000/ticket/${ticketId}`, {
                    text: this.commentText,
                    userId
                });
                this.commentText = "";
                response.data.username = this.currentUsername;
                this.comments.push(response.data);
            } catch (err) {
                console.error(err);
            }
        },

        checkUser() {
            const currentUser = helper.getCurrentUser();

            if (!currentUser) {
                return;
            }
            
            this.canComment = true;
            const currentUserId = helper.getCurrentUser().currentUserId;
            if (currentUserId == this.ticket.userId) {
                this.canDelete = true;
            }
        }
    }
}
</script>

<style>
</style>