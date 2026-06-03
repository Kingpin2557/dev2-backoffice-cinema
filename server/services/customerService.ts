import sql from "../config/db";
import type {
  CustomerModel,
  Customer,
  CustomerProto,
} from "../models/customers";

export const customerQueries: CustomerModel = {
  async getAll(): Promise<Customer[]> {
    const data = await sql<Customer[]>`
      SELECT * FROM "Customer"
    `;
    return data ?? [];
  },

  async get(id: number): Promise<Customer | null> {
    const data = await sql<Customer[]>`
      SELECT * FROM "Customer" WHERE id = ${id}
    `;
    return data[0] ?? null;
  },

  async create(data: CustomerProto): Promise<Customer> {
    const [newCustomer] = await sql<Customer[]>`
      INSERT INTO "Customer" ("firstname", "lastname", "email", "phonenumber")
      VALUES (${data.firstname}, ${data.lastname}, ${data.email}, ${data.phonenumber})
      RETURNING *
    `;
    return newCustomer;
  },

  async update(
    data: Partial<CustomerProto> & { id: number },
  ): Promise<Customer | null> {
    const { id, ...payload } = data;

    const result = await sql<Customer[]>`
        UPDATE "Customer"
        SET
          "firstname" = COALESCE(${payload.firstname ?? null}, "firstname"),
          "lastname" = COALESCE(${payload.lastname ?? null}, "lastname"),
          "email" = COALESCE(${payload.email ?? null}, "email"),
          "phonenumber" = COALESCE(${payload.phonenumber ?? null}, "phonenumber")
        WHERE id = ${id}
        RETURNING *
      `;

    return result[0] ?? null;
  },

  async delete(id: number): Promise<Customer | null> {
    const result = await sql<Customer[]>`
        DELETE FROM "Customer" WHERE id = ${id}
        RETURNING *
      `;
    return result[0] ?? null;
  },
};
