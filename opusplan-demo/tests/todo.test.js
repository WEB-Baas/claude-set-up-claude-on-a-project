const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const store = require('../todo-store');

const CLI = path.join(__dirname, '..', 'todo.js');
let dir;
let file;

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-test-'));
  file = path.join(dir, 'todos.json');
});

afterEach(() => {
  fs.rmSync(dir, { recursive: true, force: true });
});

function run(...args) {
  return spawnSync(process.execPath, [CLI, ...args], {
    env: { ...process.env, TODO_FILE: file },
    encoding: 'utf8',
  });
}

test('missing file loads as an empty list', () => {
  assert.deepEqual(store.load(file), []);
});

test('addTask then listTasks returns the task', () => {
  const task = store.addTask(file, '  Buy milk ');
  assert.equal(task.text, 'Buy milk');
  assert.equal(task.done, false);
  assert.deepEqual(store.listTasks(file), [task]);
});

test('ids keep increasing', () => {
  const a = store.addTask(file, 'a');
  const b = store.addTask(file, 'b');
  assert.equal(b.id, a.id + 1);
});

test('empty text is rejected', () => {
  assert.throws(() => store.addTask(file, '   '), /empty/);
});

test('markDone sets done and persists', () => {
  const { id } = store.addTask(file, 'a');
  const done = store.markDone(file, id);
  assert.equal(done.done, true);
  assert.equal(store.load(file)[0].done, true);
});

test('markDone on an unknown id throws', () => {
  assert.throws(() => store.markDone(file, 99), /not found/);
});

test('corrupt file gives a clear error', () => {
  fs.writeFileSync(file, '{oops');
  assert.throws(() => store.load(file), /invalid JSON/);
});

test('CLI add, list and done', () => {
  assert.match(run('add', 'Buy', 'milk').stdout, /Added #1: Buy milk/);
  assert.match(run('list').stdout, /\[ \] 1 {2}Buy milk/);
  assert.match(run('done', '1').stdout, /Done #1: Buy milk/);
  assert.match(run('list').stdout, /\[x\] 1 {2}Buy milk/);
});

test('CLI reports errors with exit code 1', () => {
  const bad = run('done', 'abc');
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /positive number/);
  assert.equal(run('done', '99').status, 1);
  assert.equal(run('nope').status, 1);
});
