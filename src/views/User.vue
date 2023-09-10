<template>
    <v-app>
        <v-container fluid>
            <v-row>
                <v-col cols="2" sm="2" md="3" lg="2">
                    <v-navigation-drawer absolute permanent left dark :expand-on-hover="$vuetify.breakpoint.smAndDown">
                        <template v-slot:prepend>
                            <v-list-item two-line class="px-2">
                                <v-list-item-avatar>
                                    <img :src="profileImage">
                                </v-list-item-avatar>

                                <v-list-item-content>
                                    <v-list-item-title>{{ userData.name }}</v-list-item-title>
                                    <v-list-item-subtitle>Online</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </template>

                        <v-divider></v-divider>

                        <v-list dense>
                            <v-list-item class="d-block">
                                <div class="d-flex nav-btn" @click="changeTab('account')">
                                    <v-list-item-icon>
                                        <v-icon>mdi-account-details</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>My Account</v-list-item-title>
                                    </v-list-item-content>
                                </div>
                                <div class="d-flex nav-btn" @click="changeTab('security')">
                                    <v-list-item-icon>
                                        <v-icon>mdi-lock</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Security</v-list-item-title>
                                    </v-list-item-content>
                                </div>

                            </v-list-item>
                        </v-list>
                    </v-navigation-drawer>
                </v-col>

                <v-col cols="10" sm="10" md="9" lg="10" class="d-flex justify-center align-center flex-column"
                    style="height: 80vh;">
                    <v-row align="center">
                        <v-col v-if="currentTab === 'account'" class="text-center">
                            <v-avatar color="#FAAA49" size="150">
                                <img v-if="profileImage" :src="profileImage" alt="Profile Photo"
                                    style="position: relative;" />
                                <v-icon v-else dark size="150">
                                    mdi-account-circle
                                </v-icon>
                            </v-avatar>
                            <v-icon v-if="editMode" @click="openFilePicker" style="cursor: pointer; position: absolute;">
                                mdi-pencil
                            </v-icon>
                            <h1 class="text-center">{{ userData.name }}</h1>
                            <h1 class="text-center">{{ userData.email }}</h1>
                            <v-form ref="form" v-if="editMode">
                                <input type="file" ref="fileInput" style="display:none" accept="image/*"
                                    @change="handleFileUpload" />
                                <v-text-field v-model="userData.name" label="Name" required></v-text-field>
                                <v-text-field v-model="userData.email" label="Email" required></v-text-field>
                            </v-form>
                            <v-btn class="mt-3" color="#FAAA49" @click="editProfile" v-if="!editMode">
                                Edit
                            </v-btn>
                            <v-card-actions v-if="editMode">
                                <v-btn color="primary" class="mr-4" @click="saveProfile">
                                    Save
                                </v-btn>
                                <v-btn color="error" @click="cancelEdit">
                                    Cancel
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                        <v-form ref="form" v-if="currentTab === 'security'">
                            <h1 class="mb-10">Change Password</h1>
                            <v-text-field v-model="currentPassword" label="Current password" type="password"
                                required></v-text-field>
                            <v-text-field v-model="password" label="New password" type="password" required></v-text-field>
                            <v-text-field v-model="confirmPassword" label="Confirm new password" type="password"
                                required></v-text-field>
                            <v-btn v-if="currentPassword && password && confirmPassword" color="primary" class="mr-4"
                                @click="changePassword">
                                Save
                            </v-btn>
                            <p style="color: rgb(252, 45, 45)">{{ error }}</p>
                            <p style="color: rgb(2, 174, 2)">{{ message }}</p>
                        </v-form>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>
  
<script>
import axios from '../api/axios-config';
import Cookies from 'js-cookie';

export default {
    data() {
        return {
            profileImage: '',
            userData: {
                name: "Name",
                email: "Email@example.com",
            },
            currentPassword: "",
            password: "",
            confirmPassword: "",
            editMode: false,
            currentTab: 'account',
            message: "",
            error: ""
        };
    },
    created() {
        const cookies = JSON.parse(Cookies.get('auth'));
        const userId = cookies.id;

        axios.get(`/users/${userId}`)
            .then(response => {
                this.userData.name = response.data.users[0].name;
                this.userData.email = response.data.users[0].email;

                if (response.data.users[0].profile_picture) {
                    this.$store.commit('setImageBase64', response.data.users[0].profile_picture);
                    this.profileImage = response.data.users[0].profile_picture;
                }
            })
            .catch(error => {
                console.error('Error fetching user data');
            });
    },
    methods: {
        saveProfile() {
            const cookies = JSON.parse(Cookies.get('auth'));
            const userId = cookies.id;

            const formData = new FormData();

            if (this.profileImage) {
                formData.append('profile_picture', this.profileImage);
            }

            formData.append('id', userId);
            formData.append('name', this.userData.name);
            formData.append('email', this.userData.email);

            axios.put('/users', formData)
                .then(response => {
                    this.editMode = false;
                })
                .catch(error => {
                    console.error('Error updating profile');
                });
        },
        openFilePicker() {
            this.$refs.fileInput.click();
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {

                    this.profileImage = reader.result;
                    console.log(this.profileImage)
                };
            }
        },
        editProfile() {
            this.editMode = true;
        },
        cancelEdit() {
            this.editMode = false;
        },
        changeTab(tabName) {
            this.currentTab = tabName;
        },
        changePassword() {
            const cookies = JSON.parse(Cookies.get('auth'));

            if (this.password !== this.confirmPassword) {
                this.error = "Passwords doesnt match";
                this.message = "";
                return;
            }

            if (this.password === this.currentPassword) {
                this.error = "The new password cannot be the same as the current password.";
                this.message = "";
                return;
            }

            const data = {
                id: cookies.id,
                newPassword: this.password,
                currentPassword: this.currentPassword
            };

            axios.put('/users/password', data)
                .then(response => {
                    if (response.data.error && response.data.error.includes('Failed')) {
                        this.error = "Current password incorrect";
                        this.message = "";
                    } else {
                        this.message = "Password updated!";
                        this.error = ""
                    }
                })
                .catch(error => {
                    console.error('Error updating password', error);
                });
        }
    },
};
</script>
  
<style scoped>
.nav-btn {
    cursor: pointer;
    padding: 5px;
}

.nav-btn:hover {
    background-color: rgba(0, 0, 0, 0.2);
}

img {
    object-fit: cover;
}
</style>
  