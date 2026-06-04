import { Request, Response } from "express";
import { customerQueries } from "../../services/customerService";

const LIMIT = 5;

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const offset = (page - 1) * LIMIT;
    const [customers, total] = await Promise.all([
      customerQueries.getPaginated(LIMIT, offset),
      customerQueries.getCount(),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / LIMIT));
    res.render("customers", { title: "Customers", customers, page, totalPages, error: null });
  } catch (err) {
    res.render("customers", { title: "Customers", customers: [], page: 1, totalPages: 1, error: (err as Error).message });
  }
};

export const getEditCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = parseInt(req.params.id as string);
    if (isNaN(customerId)) { res.status(400).send("Invalid record identifier."); return; }
    const record = await customerQueries.get(customerId);
    if (!record) { res.status(404).send("The requested record could not be found."); return; }
    res.render("partials/_dynamic-form", { title: "Edit customer", record, actionPath: `/customers/${customerId}/edit` });
  } catch {
    res.status(500).send("Internal Server Error processing layout compilation.");
  }
};

export const postEditCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = parseInt(req.params.id as string, 10);
    if (isNaN(customerId)) { res.status(400).send("Invalid record identifier."); return; }
    const updated = await customerQueries.update({ ...req.body, id: customerId });
    if (!updated) { res.status(404).send(`Failed to update customer with id: ${customerId}`); return; }
    req.app.get("io").emit("customer:updated", updated);
    res.redirect("/customers");
  } catch {
    res.status(500).send("Internal Server Error saving changes.");
  }
};

export const getAddCustomer = async (_req: Request, res: Response): Promise<void> => {
  res.render("partials/_dynamic-form", {
    title: "Add customer",
    record: { firstname: "", lastname: "", email: "", phonenumber: "" },
    actionPath: "/customers/add",
  });
};

export const postAddCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const created = await customerQueries.create(req.body);
    req.app.get("io").emit("customer:created", created);
    res.redirect("/customers");
  } catch {
    res.status(500).send("Internal Server Error saving changes.");
  }
};

export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  const customerId = parseInt(req.params.id as string, 10);
  await customerQueries.delete(customerId);
  req.app.get("io").emit("customer:deleted", customerId);
  res.redirect("/customers");
};
