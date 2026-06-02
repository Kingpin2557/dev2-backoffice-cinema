import type { Request, Response } from "express";
import type { Customer } from "../models/customers";

import { customerQueries } from "../services/customerService";

export const getCustomers = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const movie = await customerQueries.getAll();

  if (!movie) {
    res.status(404).json({ error: "Movie not found" });
    return;
  }
  res.status(200).json(movie);
};

export const getCustomerById = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const movie = await customerQueries.get(res.locals.numericId);

  if (!movie) {
    res.status(404).json({ error: "Movie not found" });
    return;
  }
  res.status(200).json(movie);
};

export const createCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const customer = req.body as Customer;
  const created = await customerQueries.create(customer);

  res.status(201).json(created);
};
