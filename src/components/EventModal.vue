<template>
    <v-app>
        <v-card width="400" :style="{ backgroundColor: eventData.event.color }" style="z-index: 1;">
            <div v-if="!editingMode">
                <v-card-title>
                    Event Details
                    <v-spacer></v-spacer>
                    <v-icon style="cursor: pointer;" @click="deleteEvent">
                        mdi-delete
                    </v-icon>
                    <v-icon @click="setEditingMode" style="cursor: pointer;">
                        mdi-pencil
                    </v-icon>
                    <v-btn icon @click="closeModal">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-list>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Title</v-list-item-title>
                                <v-list-item-subtitle>{{ eventData.event.name }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Description</v-list-item-title>
                                <v-list-item-subtitle>{{ eventData.event.description }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Start</v-list-item-title>
                                <v-list-item-subtitle>{{ formatDate(this.eventData.event.start) + ' ' + this.editedEvent.startTime }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>End</v-list-item-title>
                                <v-list-item-subtitle>{{ formatDate(this.eventData.event.end) + ' ' + this.editedEvent.endTime }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </div>
            <v-card v-else>
                <v-card-text>
                    <v-form>
                        <v-text-field label="Name" v-model="editedEvent.name"></v-text-field>
                        <v-textarea label="Descrição do Evento" v-model="editedEvent.description"></v-textarea>
                        <div style="display: flex; gap: 20px;">
                            <div>
                                <label>Start Date</label>
                                <br>
                                <input type="date" label="Data de Início" v-model="editedEvent.start">
                                <label>Start Time</label>
                                <br>
                                <input type="time" label="Hora de Início" v-model="editedEvent.startTime">
                            </div>
                            <div>
                                <label>End Date</label>
                                <br>
                                <input type="date" label="Data de Término" v-model="editedEvent.end">
                                <label>End Time</label>
                                <br>
                                <input type="time" label="Hora de Término" v-model="editedEvent.endTime">
                            </div>
                        </div>
                        <v-color-picker v-model="editedEvent.color" label="Cor do Evento"></v-color-picker>

                        <v-btn @click="editEvent">Update</v-btn>
                        <v-btn @click="cancelEdit">Cancel</v-btn>
                        <p style="color: green; margin-top: 10px; font-size: 20px;">{{ message }}</p>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-card>
    </v-app>
</template>
  
<script>
import axios from '../api/axios-config';

export default {
    props: {
        eventData: Object,
    },
    data() {
        return {
            editedEvent: {
                ...this.eventData.event,
                startTime: '',
                endTime: '',
            },
            editingMode: false,
            message: ''
        };
    },
    mounted() {
        this.editedEvent.start = this.formatDate(this.eventData.event.start);
        this.editedEvent.end = this.formatDate(this.eventData.event.end);
        this.editedEvent.startTime = this.formatTime(this.eventData.event.start);
        this.editedEvent.endTime = this.formatTime(this.eventData.event.end);
    },
    methods: {
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toISOString().substr(0, 10);
        },
        formatTime(dateString) {
            const date = new Date(dateString);
            return date.toTimeString().substr(0, 5);
        },
        closeModal() {
            this.$emit('closeModal');
        },
        editEvent() {
            const updatedEvent = {
                id: this.editedEvent.id,
                title: this.editedEvent.name,
                description: this.editedEvent.description,
                start_datetime: this.combineDateTime(this.editedEvent.start, this.editedEvent.startTime),
                end_datetime: this.combineDateTime(this.editedEvent.end, this.editedEvent.endTime),
                color: this.editedEvent.color
            };

            axios
                .put('/events', updatedEvent)
                .then((response) => {
                    this.$emit('eventUpdated', response.data);
                    this.message = "Event updated!"
                    setTimeout(() => {
                        this.closeModal();
                    }, 2000)
                })
                .catch((error) => {
                    console.error('Error');
                });
        },
        setEditingMode() {
            this.editingMode = true;
        },
        cancelEdit() {
            this.editingMode = false;
        },
        combineDateTime(date, time) {
            return `${date}T${time}:00`;
        },
        deleteEvent() {
            axios
                .delete(`/events/${this.eventData.event.id}`)
                .then((response) => {
                    this.$emit('eventDeleted', response.data);
                    this.closeModal();
                })
        }
    },
};
</script>
  
<style scoped></style>
  