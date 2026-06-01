import sql from "../config/db";

export interface Customer {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
}

export async function customers(): Promise<Customer[]> {
  const data: Customer[] = await sql<Customer[]>`SELECT * FROM "Customer"`;
  return data ?? null;
}

export async function customerById(id: string): Promise<Customer> {
  const data: Customer[] = await sql<Customer[]>`
    SELECT * FROM "Customer" WHERE id = ${id} LIMIT 1
  `;
  return data[0] ?? null;
}

export async function customerCreate(customer: Customer): Promise<Customer> {
  const { firstname, lastname, email, phonenumber } = customer;

  const data: Customer[] = await sql<
    Customer[]
  >`INSERT INTO "Customer" ("firstname", "lastname", "email", "phonenumber")
         VALUES (${firstname}, ${lastname}, ${email}, ${phonenumber})
         RETURNING *`;
  return data[0] ?? null;
}
