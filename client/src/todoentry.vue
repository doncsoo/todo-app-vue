<template>
    <div class="todo" v-bind:class='[style]'>
        <b-form-checkbox v-if="!edit" class="checkbox" v-on:change="changeTodoState" v-model="style" value="complete" unchecked-value="pending"></b-form-checkbox>
        <b-form-input v-if="edit" v-model="name"></b-form-input>
        <h6 v-if="!edit" class="task">{{ name.substring(0,31) }}</h6>
        <b-icon-pencil-fill v-if="!edit" v-on:click="edit = true" class="editicon"></b-icon-pencil-fill>
        <b-icon-check-circle-fill v-if="edit" v-on:click="editTodo" class="editicon"></b-icon-check-circle-fill>
        <b-icon-trash-fill class="editicon" v-if="isComplete && !edit" v-on:click="deleteTodo"></b-icon-trash-fill>
        <h5 class="time">{{ calcTime }}</h5>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            name: this.$props.title,
            todo: 'todo',
            style: this.$props.complete ? 'complete' : 'pending',
            edit: false
        }
    },
    props: ['id','title', 'time', 'complete'],
    computed: {
        calcTime() {
            let raw_time = this.$props.time
            let hours = Math.floor(raw_time / 60)
            let minutes = raw_time - hours * 60
            return hours + ":" + (minutes >= 10 ? minutes : "0" + minutes)
        },
        isComplete()
        {
            return this.$data.style == 'complete'
        }
    },
    methods:
    {
        deleteTodo()
        {
            fetch("http://localhost:8080/api/todos/" + this.$props.id,{method: 'DELETE'})
            .then(r => {window.location.reload()})
        },
        changeTodoState()
        {
            fetch("http://localhost:8080/api/todos/" + this.$props.id, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({complete: (this.$data.style == 'complete' ? true : false)})
            })
        },
        editTodo()
        {
            fetch("http://localhost:8080/api/todos/" + this.$props.id, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({description: this.$data.name})
            })
            .then(r => {this.$data.edit = false})
        }
    }
}
</script>