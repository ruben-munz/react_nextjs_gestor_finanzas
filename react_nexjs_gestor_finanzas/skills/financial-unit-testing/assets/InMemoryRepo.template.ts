export class InMemoryRepository<TEntity extends { id: string }> {
  public items = new Map<string, TEntity>();

  async findById(id: string): Promise<TEntity | null> {
    return this.items.get(id) ?? null;
  }

  async save(entity: TEntity): Promise<void> {
    this.items.set(entity.id, entity);
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  clear(): void {
    this.items.clear();
  }
}
