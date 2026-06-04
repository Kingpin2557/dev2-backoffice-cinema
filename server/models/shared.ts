export interface Model<
  proto extends Record<string, unknown>,
  model extends proto = proto,
  id extends number = number,
> {
  create(data: proto): Promise<model>;
  get(id: id): Promise<model | null>;
  getAll(): Promise<model[]>;
  getPaginated(limit: number, offset: number): Promise<model[]>;
  getCount(): Promise<number>;
  update(data: Partial<proto>): Promise<model | null>;
  delete(id: id): Promise<model | null>;
}
