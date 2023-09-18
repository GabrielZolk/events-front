<template>
  <v-app>
    <v-container>
      <v-row no-gutters>
        <v-text-field v-model="search" label="Search contacts by name, email or phone" solo-inverted
          hide-details></v-text-field>
        <v-btn class="mx-2" fab dark color="#FAAA49" small @click="showModal">
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-row>


      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card v-if="contacts.length > 0">
            <p style="color: blue; text-align: center;">{{ message }}</p>
            <v-card-title>Contacts List</v-card-title>
            <v-list>
              <v-list-item v-for="(contact, index) in filteredContacts" :key="index">
                <v-list-item-content v-if="editingContactId !== contact.id">
                  <v-list-item-title>{{ contact.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ contact.email }}</v-list-item-subtitle>
                  <v-list-item-subtitle>{{ contact.phone }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content v-else>
                  <v-text-field v-model="contact.name"></v-text-field>
                  <v-text-field v-model="contact.email"></v-text-field>
                  <v-text-field v-model="contact.phone"></v-text-field>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="editingMethod(contact.id)" v-if="editingContactId !== contact.id">
                    <v-icon color="primary">mdi-pencil</v-icon>
                  </v-btn>
                  <div v-else>
                    <v-btn icon @click="() => { editingContactId = null }">
                      <v-icon color="error">mdi-close</v-icon>
                    </v-btn>
                    <v-btn icon @click="updateContact(contact)">
                      <v-icon color="success">mdi-check</v-icon>
                    </v-btn>
                  </div>
                </v-list-item-action>
                <v-list-item-action style="margin: 0">
                  <v-btn icon @click="deleteContact(contact.id)">
                    <v-icon color="red">mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-list-item v-if="filteredContacts.length === 0">
                <v-list-item-content>No results</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
          <v-card v-else>
            <v-card-text class="text-center">
              You don't have any contacts yet.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

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
    </v-container>
  </v-app>
</template>

<script>
import axios from '../api/axios-config';
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      search: "",
      modalVisible: false,
      name: "",
      email: "",
      phone: "",
      user_id: null,
      contacts: [],
      editingState: false,
      editingContactId: null,
      message: ''
    };
  },
  created() {
    const cookies = JSON.parse(Cookies.get('auth'));
    this.user_id = cookies.id;
    this.fetchContacts();
  },
  methods: {
    showModal() {
      this.modalVisible = true;
    },
    closeModal() {
      this.modalVisible = false;
      this.clearForm();
    },
    fetchContacts() {
      axios.get(`/users/${this.user_id}/contacts`)
        .then(response => {
          this.contacts = response.data.contacts;
        })
        .catch(error => {
          console.error('Error fetching contacts');
        });
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
    clearForm() {
      this.$refs.form.reset();
      this.name = "";
      this.email = "";
      this.phone = "";
    },
    editingMethod(contactId) {
      this.editingContactId = contactId;
    },
    updateContact(contact) {
      axios
        .put(`/contacts`, contact)
        .then(response => {
          const index = this.contacts.findIndex(c => c.id === contact.id);
          if (index !== -1) {
            this.contacts[index] = contact;
          }
          this.editingContactId = null;
        })
        .catch(error => {
          console.error('Error updating contact');
        });
    },
    deleteContact(contactId) {
      axios
        .delete(`/contacts/${contactId}`)
        .then(response => {
          if (response.data.error && response.data.error.includes('Failed')) {
            this.message = 'This contact is being used in an existing event';
          } else {
            const index = this.contacts.findIndex(contact => contact.id === contactId);
          if (index !== -1) {
            this.contacts.splice(index, 1);
          }
          }
        })
        .catch(error => {
          console.error('Error deleting contact', error);
        });
    },
  },
  computed: {
    filteredContacts() {
      const searchTerm = this.search.toLowerCase();
      if (searchTerm) {
        return this.contacts.filter(contact => {
          return (
            contact.name.toLowerCase().includes(searchTerm) ||
            contact.email.toLowerCase().includes(searchTerm) ||
            contact.phone.toLowerCase().includes(searchTerm)
          );
        });
      }
      return this.contacts;
    },
  },
};
</script>

<style scoped></style>
