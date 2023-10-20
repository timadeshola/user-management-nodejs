import express, { Request, Response } from "express";
import bodyParser from 'body-parser';
import * as UserService from "../service/UserService";
import { User } from "../model/User";

export const userController = express.Router();

userController.use(bodyParser.json());
userController.use(bodyParser.urlencoded({ extended: false }));

/**
 * POST /api/users
 */
userController.post("/", async (req: Request, res: Response) => {
  try {
    const user: User = req.body;

    const response = await UserService.create(user, req.headers.authorization as string);

    res.status(201).json(response);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/**
 * PATCH /api/users
 */
userController.patch("/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;

  try {
    const userUpdate: User = req.body;

    const existingUser: User = await UserService.find(id, req.headers.authorization as string);

    if (existingUser) {
      const updatedItem = await UserService.update(id, userUpdate, req.headers.authorization as string);
      return res.status(200).json(updatedItem);
    }

    const newItem = await UserService.create(userUpdate, req.headers.authorization as string);

    res.status(201).json(newItem);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/**
 * GET /api/users/:id
 */

userController.get("/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;

  try {
    const user: User = await UserService.find(id, req.headers.authorization as string);

    if (user) {
      return res.status(200).send(user);
    }

    res.status(404).send("user not found");
  } catch (e) {
    res.status(500).send(e.message);
  }
});


/**
 * GET /api/users
 */

userController.get("/", async (req: Request, res: Response) => {  
    try {
      const users: User[] = await UserService.findAll(req.headers.authorization as string);
  
      if (users) {
        return res.status(200).send(users);
      }
  
      res.status(404).send("user not found");
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
  