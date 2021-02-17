import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import todoentry from './todoentry.vue'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

var date = new Date()

const weekDays = { 0 : "Monday", 1 : "Tuesday", 2 : "Wednesday", 3 : "Thursday", 4 : "Friday", 5 : "Saturday", 6 : "Sunday"}

const months = { 0 : "January", 1 : "February", 2 : "March", 3 : "April", 4 : "May", 5 : "June", 6 : "July", 7 : "August", 8 : "September", 9 : "October", 10 : "November", 11 : "December" }

function compareTodos(a, b) {
    if (a.time < b.time) {
      return -1;
    }
    else if (a.time > b.time) {
      return 1;
    }
    else return 0;
}

var vm = new Vue({
    el: '#app',
    data: {
        todos: null,
        add_form:
        {
            title: '',
            time: '00:00:00'
        }
    },
    methods: {
        getWeekDay()
        {
            return weekDays[date.getDay()]
        },
        getMonth()
        {
            return date.getDate() + " " + months[date.getMonth()]
        },
        getTodosNumber()
        {
            return this.$data.todos.length + (this.$data.todos.length > 1 ? " Tasks" : " Task");
        },
        fetchTodos()
        {
            fetch("http://localhost:8080/api/todos").then(r => r.json()).then(r => { this.$data.todos = r.sort(compareTodos)})
        },
        createTodo(event)
        {
            //parse the time string
            event.preventDefault()
            let time_string = this.$data.add_form.time
            let parsed_time = (Number(time_string.substring(0,2)) * 60) + Number(time_string.substring(3,5))
            fetch("http://localhost:8080/api/todos",{
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                        description: this.$data.add_form.title,
                        time: parsed_time})
            }).then(r => {window.location.reload()})
        }
    },
    created()
    {
        this.fetchTodos()
    },
    components: { todoentry }
})
