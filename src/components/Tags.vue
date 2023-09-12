<template>
    <div style="margin-top: 0px; text-align: center;">
        <hr>
        <h3 style="margin-top: 20px;">Tags</h3>
        <p style="color: red; font-size: 14px;">{{ error }}</p>
        <input style="border: 2px solid black; border-radius: 10px; padding: 5px; margin-right: 10px; margin-top: 10px"
            v-model="newTag" placeholder="Create Tag">
        <button style="font-size: 20px" @click="addTag">+</button>
        <p style="color: blue;">{{ message }}</p>
        <div style="margin-bottom: 30px;" class="tag-container">
            <div v-for="(tag, index) in tags" :key="index" class="tag" @dblclick="addTagToEvent(tag)">
                <template v-if="tag !== editingTag">
                    <span style="user-select: none;">{{ tag.name }}</span>
                    <span class="edit-icon" @click="editTag(tag)">✎</span>
                    <span class="delete-icon" @click="deleteTag(tag)">🗑️</span>
                </template>
                <template v-else>
                    <input style="color: green;" v-model="editingTag.name" @blur="saveEditedTag"
                        @keydown.enter="saveEditedTag">
                    <span class="edit-icon" @click="cancelEditTag">✓</span>
                </template>
            </div>
        </div>
        <hr>
        <div style="margin-top: 10px;">
            <h3>Tags in this event</h3>
            <div class="tag-container">
                <div v-for="(eventTag, index) in eventTags" :key="index">
                    <div style="user-select: none" class="tag" @click="removeTagFromEvent(eventTag)">{{ eventTag.name }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from '../api/axios-config';

export default {
    data() {
        return {
            tags: [],
            newTag: '',
            message: '',
            editingTag: null,
            eventTags: [],
            createdEventId: '',
            error: '',
        };
    },
    created() {
        this.fetchTags();
        this.fetchTagsFromEvent();
    },
    methods: {
        addTag() {
            if (this.newTag.trim() === '') {
                this.message = "Tag name cannot be null";
            } else {
                axios.post('/tags', { name: this.newTag })
                    .then(response => {
                        this.tags.push(response.data.tags);
                        this.newTag = '';
                    })
                    .catch(error => {
                        console.error('Error');
                    });
            }
        },
        fetchTags() {
            axios.get('/tags')
                .then(response => {
                    this.tags = response.data.tags;
                })
                .catch(error => {
                    console.error('Error fetching tags');
                });
        },
        editTag(tag) {
            this.editingTag = tag;
        },
        saveEditedTag() {
            if (this.editingTag) {
                const updatedTag = {
                    id: this.editingTag.id,
                    name: this.editingTag.name,
                };

                axios.put('/tags', updatedTag)
                    .then(response => {

                        const index = this.tags.findIndex(tag => tag.id === this.editingTag.id);

                        this.tags[index] = updatedTag;
                        this.editingTag = null;
                    })
                    .catch(error => {
                        console.error('Error updating tag');
                    });
            }
        },
        cancelEditTag() {
            this.editingTag = null;
        },

        deleteTag(tag) {
            if (confirm(`Do you want to delete tag "${tag.name}"?`)) {
                axios.delete(`/tags/${tag.id}`)
                    .then(response => {
                        if (response.data.error) {
                            this.error = "Tag in use, you can only delete a newly created or unused tag"
                        } else {
                            const index = this.tags.findIndex(t => t.id === tag.id);
                            if (index !== -1) {
                                this.tags.splice(index, 1);
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Error deleting tag');
                    });
            }
        },
        removeTagFromEvent(eventTags) {
            const index = this.eventTags.findIndex(tag => tag === eventTags);

            const selectedEvent = this.$store.state.selectedEvent;
            const events_id = selectedEvent.event.id;
            const tag_id = eventTags.id;

            if (index !== -1) {

                axios
                    .delete(`/event-tag/${events_id}/${tag_id}`)
                    .then(response => {
                        console.log('Success!');
                    })
                    .catch(error => {
                        console.error('Error');
                    });

                this.eventTags.splice(index, 1);
            }
        },
        addTagToEvent(tag) {
            if (!this.eventTags.some(t => t.id === tag.id)) {
                this.eventTags.push(tag);
                this.$emit('tag-value', this.eventTags);
            }
        },
        async fetchTagsFromEvent() {
            try {
                const selectedEvent = await this.$store.state.selectedEvent;
                const event_id = selectedEvent.event.id;

                const response = await axios.get(`/tag-event/${event_id}`);
                this.eventTags = response.data.results;
            } catch (error) {
                console.error('Error', error);
            }
        },
    },
};
</script>
  
<style scoped>
.tag-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    overflow-y: scroll;
    max-height: 100px;
}

.tag {
    background-color: black;
    width: fit-content;
    padding: 5px;
    margin: 5px;
    border-radius: 30px;
    display: flex;
    color: #FFFFFF;
    cursor: pointer;
    border: 1px solid transparent;
    transition: .3s;
}

.tag:hover {
    background-color: #FFFFFF;
    color: black;
    transition: .5s;
    border: 1px solid black;
}

.edit-icon {
    margin-left: 5px;
}

.delete-icon {
    margin-left: 5px;
    cursor: pointer;
}
</style>
  