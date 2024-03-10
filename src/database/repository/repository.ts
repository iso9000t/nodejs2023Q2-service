export class Repository<T> {
  private readonly items: Record<string, T>;

  constructor() {
    this.items = {};
  }

  add(id: string, item: T): void {
    this.items[id] = item;
  }

  fetchAll(): T[] {
    return Object.values(this.items);
  }

  find(id: string): T | undefined {
    return this.items[id];
  }

  delete(id: string): void {
    delete this.items[id];
  }

  exists(id: string): boolean {
    return id in this.items;
  }
}
