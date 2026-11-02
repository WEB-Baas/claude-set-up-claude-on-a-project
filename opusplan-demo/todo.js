#!/usr/bin/env node
const store = require('./todo-store');

const USAGE = `Usage:
  node todo.js add <text>   Add a task
  node todo.js list         List all tasks
  node todo.js done <id>    Mark a task as done
  node todo.js help         Show this help

Tasks are saved in todos.json (override with the TODO_FILE env var).`;

function main(argv) {
  const [command, ...rest] = argv;
  const file = process.env.TODO_FILE || store.DEFAULT_FILE;

  switch (command) {
    case 'add': {
      const task = store.addTask(file, rest.join(' '));
      console.log(`Added #${task.id}: ${task.text}`);
      break;
    }
    case 'list': {
      const todos = store.listTasks(file);
      if (todos.length === 0) {
        console.log('No tasks yet.');
        break;
      }
      for (const t of todos) {
        console.log(`[${t.done ? 'x' : ' '}] ${t.id}  ${t.text}`);
      }
      break;
    }
    case 'done': {
      if (!/^[1-9]\d*$/.test(rest[0] || '')) {
        throw new Error('Usage: node todo.js done <id> (id must be a positive number)');
      }
      const task = store.markDone(file, Number(rest[0]));
      console.log(`Done #${task.id}: ${task.text}`);
      break;
    }
    case undefined:
    case 'help':
    case '--help':
    case '-h':
      console.log(USAGE);
      break;
    default:
      throw new Error(`Unknown command: ${command}\n\n${USAGE}`);
  }
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  }
}

module.exports = { main };
