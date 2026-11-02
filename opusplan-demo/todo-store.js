const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_FILE = process.env.TODO_FILE || path.join(__dirname, 'todos.json');

function load(file = DEFAULT_FILE) {
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error('not an array');
    return data;
  } catch (err) {
    throw new Error(`Could not read ${file}: invalid JSON (${err.message})`);
  }
}

function save(file, todos) {
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(todos, null, 2) + '\n');
  fs.renameSync(tmp, file);
}

function addTask(file, text) {
  const trimmed = String(text || '').trim();
  if (!trimmed) throw new Error('Task text cannot be empty');
  const todos = load(file);
  const id = todos.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  const task = { id, text: trimmed, done: false, createdAt: new Date().toISOString() };
  todos.push(task);
  save(file, todos);
  return task;
}

function listTasks(file) {
  return load(file);
}

function markDone(file, id) {
  const todos = load(file);
  const task = todos.find((t) => t.id === id);
  if (!task) throw new Error(`Task ${id} not found`);
  if (!task.done) {
    task.done = true;
    task.doneAt = new Date().toISOString();
    save(file, todos);
  }
  return task;
}

module.exports = { load, save, addTask, listTasks, markDone, DEFAULT_FILE };
