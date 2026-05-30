class Todo {
  constructor(title) {
    this.id = Date.now();
    this.title = title;
    this.done = false;
    this.createdAt = new Date().toISOString();
  }
}
module.exports = Todo;
