import express from "express";
import bodyParser from 'body-parser';
import { User } from "../model/User";
import bcrypt from 'bcrypt';
import * as KeycloakService from "../service/KeycloakService";
import { UserRequest } from '../model/UserRequest';

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

export const create = async (user: UserRequest, auth: string): Promise<User> => {
  const response = await KeycloakService.createUser(user, auth);
  return response;
};

export const update = async (
  id: string,
  update: UserRequest,
  auth: string
): Promise<User | null> => {

  const user = await KeycloakService.findUser(id, auth);

  const response = await KeycloakService.updateUser(user.id, update, auth);

  return response
};

export const find = async (id: string, auth: string): Promise<User> => {
  
  const response = await KeycloakService.findUser(id, auth);
   
  if (response == null) {
    throw('User cannot be found!');
  }


  return  response;
}

export const findAll = async (auth: string): Promise<User[]> => {

  const response = await KeycloakService.findUsers(auth);
  return response
}

async function hashPassword(passwordToHash: string, saltRounds: number) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(passwordToHash, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Error:', error);
  }
}