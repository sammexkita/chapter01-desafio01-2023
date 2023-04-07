import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;
    
      const tasks = database.select("tasks", search ? {
        title: search,
        description: search,
      }: null);
      
      return res.end(JSON.stringify(tasks));    
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      const tasks = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      };

      database.insert("tasks", tasks);

      return res.writeHead(201).end();
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      const tasks = database.select("tasks", {
        id,
      });

      if (tasks.length > 0) {
        if (Object.entries(req.body).length > 1) {
          return res.writeHead(400).end(JSON.stringify({
            error: true,
            message: "Too many fields"
          }));
        }

        if (Object.entries(req.body)[0][0] === "title" || Object.entries(req.body)[0][0] === "description") {
          database.update("tasks", id, req.body);
        }
      } else {
        return res.writeHead(404).end(JSON.stringify({
          error: true,
          message: "Task not found"
        }));
      }
    
      return res.writeHead(204).end();
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      const tasks = database.select("tasks", {
        id,
      });

      if (tasks.length > 0) {
        database.delete("tasks", id);
      } else {
        return res.writeHead(404).end(JSON.stringify({
          error: true,
          message: "Task not found"
        }));
      }

      return res.writeHead(204).end();
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;

      const tasks = database.select("tasks", {
        id,
      });

      if (tasks.length > 0) {
        database.update("tasks", id, {
          completed_at: new Date(),
        });
      } else {
        return res.writeHead(404).end(JSON.stringify({
          error: true,
          message: "Task not found"
        }));
      }

      return res.writeHead(204).end();
    }
  }
];