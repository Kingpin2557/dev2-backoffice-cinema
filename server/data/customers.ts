import sql from "../config/db";

import type { Customer } from "../models/customer";

export const customerQueries = {
  queryAll: () => sql<Customer[]>`SELECT * FROM "Customer"`,
  queryById: (id: string) => sql<Customer[]>`
    SELECT * FROM "Customer" WHERE id = ${id} LIMIT 1
  `,
  create: ({ firstname, lastname, email, phonenumber }: Customer) =>
    sql<
      Customer[]
    >`INSERT INTO "Customer" ("firstname", "lastname", "email", "phonenumber")
           VALUES (${firstname}, ${lastname}, ${email}, ${phonenumber})
           RETURNING *`,
};
