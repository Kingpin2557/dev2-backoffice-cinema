import { Request, Response } from "express";
import { customerQueries } from "../../services/customerService";

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.query.page || req.query.limit) {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, parseInt(req.query.limit as string) || 5);
      const offset = (page - 1) * limit;
      const [customers, total] = await Promise.all([
        customerQueries.getPaginated(limit, offset),
        customerQueries.getCount(),
      ]);
      res.status(200).json({ customers, total, page, totalPages: Math.ceil(total / limit) });
    } else {
      const customers = await customerQueries.getAll();
      res.status(200).json(customers);
    }
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCustomerById = async (_req: Request, res: Response): Promise<void> => {
  try {
    const customer = await customerQueries.get(res.locals.numericId);
    if (!customer) { res.status(404).json({ error: "Customer not found" }); return; }
    res.status(200).json(customer);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const created = await customerQueries.create(req.body);
    req.app.get("io")?.emit("customer:created", created);
    res.status(201).json(created);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await customerQueries.update({ ...req.body, id: res.locals.numericId });
    if (!updated) { res.status(404).json({ error: "Customer not found" }); return; }
    req.app.get("io")?.emit("customer:updated", updated);
    res.status(200).json(updated);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await customerQueries.delete(res.locals.numericId);
    if (!deleted) { res.status(404).json({ error: "Customer not found" }); return; }
    req.app.get("io")?.emit("customer:deleted", res.locals.numericId);
    res.status(200).json(deleted);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};
