import { type Customer } from "../models/customer";

import { customerQueries } from "../data/customers";

export async function customers(): Promise<Customer[]> {
  const data: Customer[] = await customerQueries.queryAll();
  return data ?? null;
}

export async function customerById(slug: string): Promise<Customer> {
  const data: Customer[] = await customerQueries.queryById(slug);
  return data[0] ?? null;
}

export async function customerCreate(customer: Customer): Promise<Customer> {
  const data: Customer[] = await customerQueries.create(customer);
  return data[0] ?? null;
}
