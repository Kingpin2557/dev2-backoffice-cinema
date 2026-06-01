import { Request, Response, NextFunction } from "express";

export const idValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { id } = req.params;
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    res
      .status(400)
      .json({ error: "Invalid ID format. ID must be a positive integer." });
    return;
  }

  // Optional: Store the parsed number in res.locals to avoid parsing it again in the controller
  res.locals.numericId = parsedId;

  next();
};
