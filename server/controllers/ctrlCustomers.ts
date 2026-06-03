import type { Request, Response } from "express";
import type { Customer } from "../models/customers";
import { io } from "../app";

import { customerQueries } from "../services/customerService";

export const getCustomers = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const customers = await customerQueries.getAll();

    if (!customers || customers.length === 0) {
      res.status(404).json({ error: "Cusomters not found" });
      return;
    }
    res.status(200).json(customers);
  } catch (err) {
    console.error("Failed to fetch customers:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCustomerById = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const customer = await customerQueries.get(res.locals.numericId);

    if (!customer) {
      res.status(404).json({ error: "Customer with not found" });
      return;
    }
    res.status(200).json(customer);
  } catch (err) {
    console.error(
      `Failed to fetch customer with id: ${res.locals.numericId}`,
      err,
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const customer = req.body as Customer;

    if (!customer) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const created = await customerQueries.create(customer);

    io.emit("customer:created", created);
    res.status(201).json(created);
  } catch (err) {
    console.error("Failed to create customer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const deleted = await customerQueries.delete(res.locals.numericId);

    if (!deleted) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    io.emit("customer:deleted", deleted);
    res.status(200).json(deleted);
  } catch (err) {
    console.error(
      `Failed to delete customer with id: ${res.locals.numericId}`,
      err,
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const updated = await customerQueries.update({
      ...(req.body as Partial<Customer>),
      id: res.locals.numericId,
    });

    if (!updated) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    io.emit("customer:updated", updated);
    res.status(200).json(updated);
  } catch (err) {
    console.error(
      `Failed to update customer with id: ${res.locals.numericId}`,
      err,
    );
    res.status(500).json({ error: "Internal server error" });
  }
};
