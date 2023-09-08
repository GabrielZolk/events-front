<template>
    <v-app>
        <v-container fluid>
            <v-row>
                <v-col cols="2" sm="2" md="3" lg="2">
                    <v-navigation-drawer absolute permanent left dark :expand-on-hover="$vuetify.breakpoint.smAndDown">
                        <template v-slot:prepend>
                            <v-list-item two-line class="px-2">
                                <v-list-item-avatar>
                                    <img src="https://randomuser.me/api/portraits/women/81.jpg">
                                </v-list-item-avatar>

                                <v-list-item-content>
                                    <v-list-item-title>Jane Smith</v-list-item-title>
                                    <v-list-item-subtitle>Logged In</v-list-item-subtitle>
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
                                <img v-if="profileImage" :src="profileImage" alt="Profile Photo" />
                                <v-icon v-else dark size="150" @click="openFilePicker">
                                    mdi-account-circle
                                </v-icon>
                            </v-avatar>
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
                            <v-text-field v-model="userData.currentPassword" label="Current password" type="password"
                                required></v-text-field>
                            <v-text-field v-model="userData.password" label="New password" type="password"
                                required></v-text-field>
                            <v-text-field v-model="userData.confirmPassword" label="Confirm new password" type="password"
                                required></v-text-field>
                            <v-btn v-if="userData.currentPassword && userData.password && userData.confirmPassword" color="primary" class="mr-4"
                                @click="changePassword">
                                Save
                            </v-btn>

                        </v-form>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>
  
<script>
export default {
    data() {
        return {
            profileImage: null,
            userData: {
                name: "Name",
                email: "email@example.com",
                currentPassword: "",
                password: "",
                confirmPassword: "",
            },
            editMode: false,
            currentTab: 'account',
        };
    },
    methods: {
        saveProfile() {
            console.log("Perfil salvo:", this.userData);
            console.log("Imagem do perfil:", this.profileImage);
            this.editMode = false;
        },
        openFilePicker() {
            this.$refs.fileInput.click();
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.profileImage = URL.createObjectURL(file);
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
            console.log("password changed");
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
</style>
  