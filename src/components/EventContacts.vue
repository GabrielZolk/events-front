<template>
    <div style="padding-right: 16px">
        <v-card-title>Contacts</v-card-title>
        <v-card-text
            style="width: 400px; height: 250px; overflow-y: scroll; box-shadow: 0 0 5px rgba(0, 0, 0, 0.6); display: flex">
            <div>
                <v-card-text>Existing Contacts <v-btn class="mx-2" fab dark color="#FAAA49" small @click="showModal">
                        <v-icon dark>
                            mdi-plus
                        </v-icon>
                    </v-btn></v-card-text>
                <v-list>
                    <v-list-item v-for="(existingContact, index) in existingContacts" :key="index">
                        <v-list-item-content>
                            <v-list-item-title>{{ existingContact.name }}</v-list-item-title>
                            <v-list-item-subtitle>{{ existingContact.email }}</v-list-item-subtitle>
                            <v-list-item-subtitle>{{ existingContact.phone }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-icon :disabled="eventContacts.includes(existingContact)" color="purple"
                                @click="addContactToEvent(existingContact)">mdi-plus</v-icon>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </div>
            <div style="min-width: 120px;">
                <v-card-text>In this event</v-card-text>
                <v-list>
                    <v-list-item v-for="(eventContact, index) in eventContacts" :key="index">
                        <v-list-item-content>
                            <v-list-item-title>{{ eventContact.name }}</v-list-item-title>
                        </v-list-item-content>
                        <!-- <v-icon color="green">mdi-check</v-icon> -->
                        <v-icon color="red" @click="removeContactFromEvent(eventContact)">mdi-close</v-icon>
                    </v-list-item>
                </v-list>
            </div>
        </v-card-text>
        <v-dialog v-model="modalVisible" max-width="500px">
            <v-card>
                <v-card-title>New Contact</v-card-title>
                <v-card-text>
                    <v-form ref="form">
                        <v-text-field v-model="name" label="Name" required></v-text-field>
                        <v-text-field v-model="email" label="Email" required></v-text-field>
                        <v-text-field v-model="phone" label="Phone" required></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" @click="saveContact">Save</v-btn>
                    <v-btn color="error" @click="closeModal">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import axios from '../api/axios-config';
import Cookies from 'js-cookie';

export default {
    data() {
        return {
            existingContacts: [],
            eventContacts: [],
            eventos_id: null,
            name: "",
            email: "",
            phone: "",
            user_id: null,
            contacts: [],
            modalVisible: false,
        }
    },
    mounted() {
        this.fetchContacts();
    },
    created() {
        const cookies = JSON.parse(Cookies.get('auth'));
        this.user_id = cookies.id;
        this.eventos_id = this.$store.state.selectedEvent.event.id;
        this.fetchConctactsFromEvent();
    },
    destroyed() {
        this.$store.state.selectedEvent = null;
    },
    methods: {
        fetchContacts() {
            const cookies = JSON.parse(Cookies.get('auth'));
            const user_id = cookies.id;

            axios.get(`/users/${user_id}/contacts`)
                .then(response => {
                    this.existingContacts = response.data.contacts;
                })
                .catch(error => {
                    console.error('Error fetching contacts');
                });
        },
        async fetchConctactsFromEvent() {
            try {
                const selectedEvent = await this.$store.state.selectedEvent;
                const eventos_id = selectedEvent.event.id;

                const response = await axios.get(`/evento-contato/${eventos_id}`);
                this.eventContacts = response.data.results;
                
            } catch (error) {
                console.error('Error');
            }
        },

        addContactToEvent(existingContact) {
            if (!this.eventContacts.includes(existingContact)) {
                this.eventContacts.push(existingContact);

                this.selectedExistingContact = existingContact;
                this.$emit('event-contacts-updated', this.eventContacts);
            }
        },

        removeContactFromEvent(eventContact) {
            const index = this.eventContacts.findIndex(contact => contact === eventContact);

            const selectedEvent = this.$store.state.selectedEvent;
            const eventos_id = selectedEvent.event.id;
            const contact_id = eventContact.id;

            if (index !== -1) {

                axios
                    .delete(`/evento-contato/${eventos_id}/${contact_id}`)
                    .then(response => {
                        console.log('Success!');
                    })
                    .catch(error => {
                        console.error('Error');
                    });

                this.eventContacts.splice(index, 1);
            }
        },
        saveContact() {
            const newContact = {
                name: this.name,
                email: this.email,
                phone: this.phone,
                user_id: this.user_id,
            };

            axios
                .post('/contacts', newContact)
                .then(response => {
                    this.contacts.push(response.data);

                    this.clearForm();
                    this.closeModal();
                    this.fetchContacts();
                })
                .catch(error => {
                    console.error('Error saving contact');
                });
        },
        showModal() {
            this.modalVisible = true;
        },
        closeModal() {
            this.modalVisible = false;
            this.clearForm();
        },
        clearForm() {
            this.$refs.form.reset();
            this.name = "";
            this.email = "";
            this.phone = "";
        },
    }
}
</script>

<style scoped></style>