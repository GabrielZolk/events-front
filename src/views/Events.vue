<template>
  <div>
    <v-app>
      <v-sheet tile height="54" class="d-flex">
        <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-select v-model="type" :items="types" dense outlined hide-details class="ma-2" label="type"></v-select>
        <v-select v-model="mode" :items="modes" dense outlined hide-details label="event-overlap-mode"
          class="ma-2"></v-select>
        <v-select v-model="weekday" :items="weekdays" dense outlined hide-details label="weekdays"
          class="ma-2"></v-select>
        <v-btn icon class="ma-2 add" @click="openAddEventModal">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon class="ma-2" @click="$refs.calendar.next()">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar ref="calendar" :event-detailed="true" v-model="value" :weekdays="weekday" :type="type"
          :events="events" :event-overlap-mode="mode" :event-overlap-threshold="30" :event-color="getEventColor"
          @change="getEvents" @click:event="openModal($event, $event.nativeEvent.clientX, $event.nativeEvent.clientY)"
          @click:date="openAddEventForm($event)" class="calendar"></v-calendar>
      </v-sheet>
      <EventModal v-if="showModal" @eventUpdated="getEvents" @eventDeleted="getEvents" @closeModal="closeModal"
        :eventData="selectedEvent" class="modal" :style="{ left: modalX, top: modalY }" />
      <div v-if="addEventModal" class="modal" style="z-index: 1;">
        <v-card elevation="20" style="display: flex">
          <div>
            <v-card-title>New Event</v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field label="Title" v-model="newEvent.name"></v-text-field>
                <v-textarea label="Description" v-model="newEvent.description"></v-textarea>
                <div style="display: flex; gap: 20px;">
                  <div>
                    <label>Start Date</label>
                    <br>
                    <input type="date" label="Start" v-model="newEvent.start">
                    <br>
                    <label>Start Time</label>
                    <br>
                    <input type="time" label="Start Time" v-model="newEvent.startTime">
                  </div>
                  <div>
                    <label>End Date</label>
                    <br>
                    <input type="date" label="End" v-model="newEvent.end">
                    <br>
                    <label>End Time</label>
                    <br>
                    <input type="time" label="End Time" v-model="newEvent.endTime">
                  </div>
                </div>
                <v-color-picker v-model="newEvent.color" label="Event Color"></v-color-picker>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="saveEvent">Save</v-btn>
              <v-btn @click="closeEventModal">Cancel</v-btn>
            </v-card-actions>
          </div>
          <div>
            <div style="padding-right: 16px">
              <v-card-title>Contacts</v-card-title>
              <v-card-text
                style="width: 400px; height: 250px; overflow-y: scroll; box-shadow: 0 0 5px rgba(0, 0, 0, 0.6); display: flex">
                <div>
                  <v-card-text>Existing Contacts</v-card-text>
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
            </div>
          </div>
        </v-card>
      </div>
    </v-app>
  </div>
</template>

<script>
import axios from '../api/axios-config';
import Cookies from 'js-cookie';
import EventModal from '../components/EventModal.vue';

export default {
  components: {
    EventModal
  },
  data: () => ({
    type: 'month',
    types: ['month', 'week', 'day', '4day'],
    mode: 'stack',
    modes: ['stack', 'column'],
    weekday: [0, 1, 2, 3, 4, 5, 6],
    weekdays: [
      { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
      { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
      { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
      { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
    ],
    value: '',
    events: [],
    showModal: false,
    selectedEvent: null,
    addEventModal: false,
    newEvent: {
      name: '',
      description: '',
      start: null,
      end: null,
      startTime: '',
      endTime: '',
      color: '',
    },
    existingContacts: [],
    eventContacts: [],
    selectedExistingContact: null,
  }),
  methods: {
    getEvents() {
      const cookies = JSON.parse(Cookies.get('auth'));
      const user_id = cookies.id;

      axios.get(`/events/${user_id}`)
        .then((response) => {
          const events = response.data.events;

          const formatedEvents = events.map((prop) => ({
            id: prop.id,
            name: prop.title,
            description: prop.description,
            start: new Date(prop.start_datetime),
            end: new Date(prop.end_datetime),
            color: prop.color,
            timed: true
          }));

          this.events = formatedEvents;
        })
        .catch((error) => {
          console.error('Error fetching events');
        });
      this.fetchContacts();
    },
    getEventColor(event) {
      return event.color
    },
    openModal(event, clientX, clientY) {

      this.modalX = clientX + 'px';
      this.modalY = clientY + 'px';

      this.selectedEvent = event;

      this.showModal = true;
    },

    closeModal() {
      this.selectedEvent = null;
      this.showModal = false;
    },
    openAddEventModal() {
      this.addEventModal = true;
    },

    closeEventModal() {
      this.addEventModal = false;
    },

    saveEvent() {
      const cookies = JSON.parse(Cookies.get('auth'));
      const user_id = cookies.id;


      const rawColor = this.newEvent.color;
      const colorWithoutAlpha = rawColor.substring(0, 7);

      const eventData = {
        title: this.newEvent.name,
        description: this.newEvent.description,
        start_datetime: this.combineDateTime(this.newEvent.start, this.newEvent.startTime),
        end_datetime: this.combineDateTime(this.newEvent.end, this.newEvent.endTime),
        color: colorWithoutAlpha,
        users_id: user_id
      };

      axios
        .post('/events', eventData)
        .then((response) => {
          this.getEvents();
          this.closeEventModal();
        })
        .catch((error) => {
          console.error('Error');
        });
    },

    combineDateTime(date, time) {
      return `${date}T${time}:00`;
    },

    openAddEventForm(selectedDate) {
      this.newEvent.start = selectedDate.date;

      this.openAddEventModal();
    },

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
    addContactToEvent(existingContact) {
      if (!this.eventContacts.includes(existingContact)) {
        this.eventContacts.push(existingContact);

        this.selectedExistingContact = null;
      }
    },

    removeContactFromEvent(eventContact) {
      const index = this.eventContacts.findIndex(contact => contact === eventContact);

      if (index !== -1) {
        this.eventContacts.splice(index, 1);
      }
    }
  },
}
</script>

<style scoped>
.calendar {
  position: relative;
}

.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>