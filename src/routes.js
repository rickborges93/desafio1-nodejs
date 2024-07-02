import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            const task = ({
                id: randomUUID(),
                title: title,
                description: description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date(),
            })
            
            database.insert('tasks', task)
    
            return res.writeHead(201).end()
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search,
            } : null)
        
            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            const hasTask = database.select('tasks', { id: id })

            if (hasTask.length === 0) {
                return res.writeHead(404).end()
            }

            if (!title && !description) {
                return res.writeHead(400).end("Error: title or description are required")
            }

            const updatedData = {};

            if (title) updatedData['title'] = title
            if (description) updatedData['description'] = description
            updatedData['updated_at'] = new Date()

            database.update('tasks', id, updatedData)
    
            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const hasTask = database.select('tasks', { id: id })

            if (hasTask.length === 0) {
                return res.writeHead(404).end()
            }

            database.delete('tasks', id)
    
            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params           

            const hasTask = database.select('tasks', { id: id })

            if (hasTask.length === 0) {
                return res.writeHead(404).end()
            }
    
            const updatedData = {};

            updatedData['completed_at'] = hasTask[0].completed_at === null ? new Date() : null
            updatedData['updated_at'] = new Date()

            database.update('tasks', id, updatedData)
    
            return res.writeHead(204).end()
        }
    }
]