import type { Model } from "./shared";

export interface CustomerProto extends Record<string, unknown> {
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
}

export interface Customer extends CustomerProto {
  id: number;
}

export interface CustomerModel extends Model<CustomerProto, Customer, number> {}
