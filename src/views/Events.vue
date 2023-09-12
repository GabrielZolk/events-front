<template>
  <div>
    <v-app>
      <v-sheet tile height="54" class="d-flex">
        <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-select v-model="type" :items="types" dense outlined hide-details class="ma-2" label="type"></v-select>
        <!-- <v-select v-model="mode" :items="modes" dense outlined hide-details label="event-overlap-mode"
          class="ma-2"></v-select> -->
        <v-select v-model="weekday" :items="weekdays" dense outlined hide-details label="weekdays"
          class="ma-2"></v-select>
        <v-text-field v-model="searchQuery" label="Search"></v-text-field>
        <v-autocomplete v-model="selectedContacts" :items="contactsFilter" label="Filter by contact" multiple chips
        small-chips dense></v-autocomplete>

      <v-autocomplete v-model="selectedTags" :items="tagsFilter" label="Filter by tag" multiple chips small-chips
        dense></v-autocomplete>
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
          :events="filteredEvents" :event-overlap-mode="mode" :event-overlap-threshold="30" :event-color="getEventColor"
          @change="getEvents" @click:event="openModal($event, $event.nativeEvent.clientX, $event.nativeEvent.clientY)"
          @click:date="openAddEventForm($event)" class="calendar"></v-calendar>
      </v-sheet>
      <EventModal v-if="showModal" @eventUpdated="getEvents" @eventDeleted="getEvents" @closeModal="closeModal"
        :eventData="selectedEvent" class="modal"  />
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
            <EventContacts @event-contacts-updated="takeData" />
            <Tags @tag-value="takeTag" />
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
import EventContacts from '../components/EventContacts.vue';
import Tags from '../components/Tags.vue';

export default {
  components: {
    EventModal,
    EventContacts,
    Tags
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
    selectedExistingContact: null,
    eventContacts: [],
    tags: [],
    searchQuery: '',
    events: [],
    selectedContacts: [],
    selectedTags: [],
    contactsFilter: ['Leblanc', 'Irelia'],
    tagsFilter: [],
  }),
  created() {
    const cookies = JSON.parse(Cookies.get('auth'));
    const user_id = cookies.id;

    axios.get(`/users/${user_id}/contacts`)
      .then(response => {
        const namesArray = response.data.contacts.map(contact => contact.name);
        this.contactsFilter = namesArray;
      })
      .catch(error => {
        console.error('Error');
      });


    axios.get('/tags')
      .then(response => {

        const namesArray = response.data.tags.map(tag => tag.name);
        this.tagsFilter = namesArray;
      })
      .catch(error => {
        console.error('Erro ao buscar tags');
      });

  },
  computed: {
    filteredEvents() {
      let filteredEvents = this.events.filter(eventInfo =>
        eventInfo.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      if (this.selectedContacts.length > 0) {
        filteredEvents = filteredEvents.filter(eventInfo =>
          this.selectedContacts.some(contact =>
            eventInfo.contato_name && eventInfo.contato_name.includes(contact)
          )
        );
      }

      if (this.selectedTags.length > 0) {
        filteredEvents = filteredEvents.filter(eventInfo =>
          this.selectedTags.some(tag =>
            eventInfo.tag_name && eventInfo.tag_name.includes(tag)
          )
        );
      }

      return filteredEvents;
    },
  },
  methods: {
    formatDates(events) {
      return events.map(info => {
        info.start = new Date(info.start);
        info.end = new Date(info.end);
        info.timed = true;
        return info;
      });
    },
    takeData(data) {
      this.eventContacts = data;
    },
    takeTag(data) {
      this.tags = data;
    },
    getEvents() {
  const cookies = JSON.parse(Cookies.get('auth'));
  const user_id = cookies.id;

  axios.get(`/all-events/${user_id}`).then(response => {
    const events = this.formatDates(response.data.results);
   
    const consolidatedEvents = {};

    events.forEach(event => {
      if (!consolidatedEvents[event.id]) {
        
        consolidatedEvents[event.id] = { ...event, tags: [], contacts: [] };
      }

   
      if (event.tags && Array.isArray(event.tags)) {
      
        consolidatedEvents[event.id].tags.push(...event.tags);
      }

    
      if (event.contacts && Array.isArray(event.contacts)) {
     
        consolidatedEvents[event.id].contacts.push(...event.contacts);
      }
    });

  
    this.events = Object.values(consolidatedEvents);

    console.log(this.events);
  });
},

    getEventColor(event) {
      return event.color
    },
    openModal(event, clientX, clientY) {

      this.modalX = clientX + 'px';
      this.modalY = clientY + 'px';

      this.selectedEvent = event;
      console.log(this.selectedEvent)
      this.$store.commit('setSelectedEvent', this.selectedEvent);
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
      this.newEvent.start = null;
      this.tags = [];
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
          this.saveContactToEvent(response.data.events.id);
          this.addTagToEvent(response.data.events.id);
        })
        .catch((error) => {
          console.error('Error', error);
        });

        this.newEvent.name = '',
        this.newEvent.description = '',
        this.newEvent.start = null,
        this.newEvent.end = null,
        this.newEvent.startTime = '',
        this.newEvent.endTime = '',
        this.newEvent.color = ''
    },

    combineDateTime(date, time) {
      return `${date}T${time}:00`;
    },

    openAddEventForm(selectedDate) {
      this.newEvent.start = selectedDate.date;

      this.openAddEventModal();
    },

    saveContactToEvent(eventId) {
      const event_id = eventId;

      this.eventContacts.forEach(contact => {
        const eventData = {
          contact_id: contact.id,
          event_id: event_id
        };
        axios.post('/event-contact', eventData)
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      });
    },
    addTagToEvent(event) {

      this.tags.forEach(tag => {
        const data = {
          tag_id: tag.id,
          event_id: event,
        }
        axios.post('/tag-event', data)
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.error(error);
          })
      })
    },
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