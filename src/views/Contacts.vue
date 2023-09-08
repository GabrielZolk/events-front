<template>
  <v-app>
    <v-container>
      <v-row no-gutters>
        <v-text-field v-model="search" label="Search contacts" solo-inverted hide-details></v-text-field>
        <v-btn class="mx-2" fab dark color="#FAAA49" small @click="exibirModal">
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-row>


      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card v-if="contacts.length > 0">
            <v-card-title>Contacts List</v-card-title>
            <v-list>
              <v-list-item v-for="(contact, index) in contacts" :key="index">
                <v-list-item-content>
                  <v-list-item-title>{{ contact.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ contact.email }}</v-list-item-subtitle>
                  <v-list-item-subtitle>{{ contact.phone }}</v-list-item-subtitle>
                </v-list-item-content>
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
export default {
  data() {
    return {
      search: "",
      modalVisible: false,
      name: "",
      email: "",
      phone: "",
      contacts: [],
    };
  },
  methods: {
    exibirModal() {
      this.modalVisible = true;
    },
    closeModal() {
      this.modalVisible = false;
      this.cleanForm();
    },
    saveContact() {
      const newContact = {
        name: this.name,
        email: this.email,
        phone: this.phone,
      }
      this.contacts.push(newContact);
      this.cleanForm();
      this.closeModal();
    },
    cleanForm() {
      this.$refs.form.reset();
        this.name = "",
        this.email = "",
        this.phone = ""
    },
  },
};
</script>

<style scoped></style>
