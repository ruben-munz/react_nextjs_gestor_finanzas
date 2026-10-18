export interface IRepository<TEntity> {
  findById(id: string): Promise<TEntity | null>;
  save(entity: TEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
