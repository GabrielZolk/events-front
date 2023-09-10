<template>
    <v-card>
      <v-card-title>{{ modo ? 'Editar Evento' : 'Inserir Novo Evento' }}</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field label="Name" :v-model="modo ? eventData.name : newEvent.name"></v-text-field>
          <v-textarea label="Descrição do Evento" :v-model="modo ? eventData.description : newEvent.description"></v-textarea>
          <div style="display: flex; gap: 20px;">
              <div>
                  <label>Start Date</label>
                  <br>
                  <input type="date" label="Data de Início" :v-model="modo ? eventData.start : newEvent.start">
                  <label>Start Time</label>
                  <br>
                  <input type="time" label="Hora de Início" :v-model="modo ? eventData.startTime : newEvent.startTime">
              </div>
              <div>
                  <label>End Date</label>
                  <br>
                  <input type="date" label="Data de Término" :v-model="modo ? eventData.end : newEvent.end">
                  <label>End Time</label>
                  <br>
                  <input type="time" label="Hora de Término" :v-model="modo ? eventData.endTime : newEvent.endTime">
              </div>
          </div>
          <v-color-picker :v-model="modo ? eventData.color : newEvent.color" label="Cor do Evento"></v-color-picker>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="saveEvent">{{ modo ? 'Atualizar' : 'Salvar' }}</v-btn>
        <v-btn @click="closeEventModal">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  import axios from '../api/axios-config';
  import Cookies from 'js-cookie';
  
  export default {
    props: {
      eventData: Object,
      modo: Boolean,
    },
    data() {
      return {
        newEvent: {
          name: '',
          description: '',
          startDate: null,
          endDate: null,
          color: '',
        },
      };
    },
    created() {
      if (this.editMode) {
        this.newEvent = { ...this.eventData };
      }
    },
    methods: {
      saveEvent() {
        const cookies = JSON.parse(Cookies.get('auth'));
        const userId = cookies.id;
  
        const eventData = {
          title: this.newEvent.name,
          description: this.newEvent.description,
          start_datetime: this.newEvent.startDate,
          end_datetime: this.newEvent.endDate,
          color: '#000000',
          users_id: userId,
        };
  
        if (this.editMode) {
        } else {
          axios
            .post('/events', eventData)
            .then((response) => {
              console.log(response);
              this.closeEventModal();
            })
            .catch((error) => {
              console.error('Erro ao adicionar evento', error);
            });
        }
      },
    },
  };
  </script>
  