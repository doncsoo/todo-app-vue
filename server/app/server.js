const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const history = require('connect-history-api-fallback')
const cors = require('cors')

todos = [{id: 0, description: "Buy groceries", time: 1210, complete: false}]

module.exports = (host, port) => {
  const app = express()

  const router = new express.Router()
  app.use(cors())
  app.use('/', router)

  // Router config
  router.use(
    bodyParser.urlencoded({extended: true}), // Parse application/x-www-form-urlencoded
    bodyParser.json() // Parse application/json
  )

  router.get('/', function (req, res) {
    res.status(200).send("Backend")
  })

  /**
   * Az osszes todo lekerdezese
   */
  router.get('/api/todos', function (req, res) {
    res.status(200).json(todos)
  })

  /**
   * Todo lekerdezese id alapjan
   */
  router.get('/api/todos/:todoId', function (req, res) {
    let todo = todos.find((todo) => { return todo.id == req.params.todoId })
    if(todo) res.status(200).json(todo)
    res.status(404).send("Not Found")
  })

  /**
   * Todo letrehozasa
   */
  router.put('/api/todos', function (req, res) {
    const last_id = todos[0] == undefined ? -1 : todos[0].id
    const new_todo = {id: last_id + 1, description: req.body.description, time: req.body.time, complete: false}
    todos.unshift(new_todo)
    res.status(201).json(new_todo)
  })

  /**
   * Todo modositasa
   */
  router.patch('/api/todos/:todoId', function (req, res) {
    let todo = todos.find((todo) => { return todo.id == req.params.todoId })
    if(todo)
    {
      if(req.body.description != undefined) todo.description = req.body.description;
      if(req.body.time != undefined) todo.time = req.body.time;
      if(req.body.complete != undefined) todo.complete = req.body.complete;
      res.status(201).json(todo)
    }
    else res.status(404).send("Not Found")
  })

  /**
   * Todo torlese
   */
  router.delete('/api/todos/:todoId', function (req, res) {
    let new_todos = todos.filter((todo) => { return todo.id != req.params.todoId })
    todos = new_todos
    res.status(202).send("Success")
  })

  // History fallback api
  router.use(history())
  // Kliens kod bundle betoltese, ha van
  router.use('/', express.static(path.join(__dirname, '../../client/dist'))) // History fallback utan kell megadni

  return app.listen(port, host, () => {
    console.info(`IdomSoft test web server started on ${host}:${port}`)
  })
}
