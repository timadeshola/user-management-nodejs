import express, { Request, Response } from "express";
import * as KeycloakService from "../service/KeycloakService";
import { User } from "../model/User";
import { AuthLogin } from "../model/AuthLogin";

export const keycloakController = express.Router();

keycloakController.post("/login", async (req: Request, res: Response) => {
    try {
      const data: AuthLogin = req.body;
      const response = await KeycloakService.login(data);
  
      res.status(200).json(response);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });


keycloakController.post("/createUser", async (req: Request, res: Response) => {
  try {
    const data: User = req.body;
    const response = await KeycloakService.createUser(data, req.headers.authorization as string);

    res.status(201).json(response);
  } catch (e) {
    res.status(500).send(e.message);
  }
});


keycloakController.put("/updateUser/:id", async (req: Request, res: Response) => {
  try {
    const data: User = req.body;
    const id: string = req.params['id'];
    const response = await KeycloakService.updateUser(id, data, req.headers.authorization as string);

    res.status(200).json(response);
  } catch (e) {
    res.status(500).send(e.message);
  }
});


keycloakController.get("/user/:id", async (req: Request, res: Response) => {
  try {
    console.log('authorization: ', req.headers.authorization)
    const id: string = req.params['id'];
    const response = await KeycloakService.findUser(id, req.headers.authorization as string);

    res.status(200).json(response);
  } catch (e) {
    res.status(500).send(e.message);
  }
});