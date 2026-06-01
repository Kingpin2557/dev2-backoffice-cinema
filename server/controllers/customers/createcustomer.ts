import type { Request, Response } from "express";

import { customerCreate } from "../../services/customerService";
import { Customer } from "../../models/customer";

export const createCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const customer = req.body as Customer;
  const created = await customerCreate(customer);

  res.status(201).json(created);
};
