import express from "express";
import bodyParser from 'body-parser';
import axios from "axios";
import { AuthLogin } from "../model/AuthLogin";
import { AuthResponse } from "../model/AuthResponse";
import { PasswordReset } from "../model/PasswordReset";
import { UserRequest } from '../model/UserRequest';
import { User } from "../model/User";
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

export const login = async (user: AuthLogin): Promise<AuthResponse> => {
  try {
    const data = {
      client_id: "admin-cli",
      grant_type: "password",
      username: user.username,
      password: user.password,
    };

    const response = await axios.post(
      "http://localhost:11000/realms/master/protocol/openid-connect/token",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log(response)
    const responseData = response.data;
    return responseData;
  } catch (error) {
    console.error("Error:", error.response);
    return error.response.data.errorMessage;
  }
};

export const createUser = async (user: UserRequest, auth: string): Promise<User> => {
    user.enabled = true;
    user.createdTimestamp = new Date().getTime()
    try {  
     const response = await axios.post(
        "http://localhost:11000/admin/realms/master/users", user,
        {
          headers: {
            'Authorization': auth
          },
        }
      );

      console.log('response: ', response);
      let passRequest = {
        type: 'password',
        value: 'Password123',
        temporary: false
      }

      const newUser = await findUserByUsername(user.username, user.firstName, auth);

      await setUserPassword(passRequest, newUser.id, auth);

      return newUser;
    } catch (error) {
      console.error("Error:", error.response);
      return error.response.data.errorMessage;
    }
  };
  

export const updateUser = async (id: string, user: UserRequest, auth: string): Promise<User> => {
    try {  
      const response = await axios.put(
        "http://localhost:11000/admin/realms/master/users/"+ id, user,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': auth
          },
        }
      );
      const responseData = response.data;
      return responseData;
    } catch (error) {
        console.error("Error:", error.response);
        return error.response.data.errorMessage;
    }
  };
  

export const findUser = async (id: string, auth: string): Promise<User> => {
    try {  
      const response = await axios.get(
        "http://localhost:11000/admin/realms/master/users/"+ id,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': auth
          },
        }
      );
      const responseData = response.data;
      return responseData;
    } catch (error) {
        console.error("Error:", error.response);
        return error.response.data.errorMessage;
    }
  };


export const findUserByUsername = async (username: string, firstName: string, auth: string): Promise<User> => {
    try {  
      const response = await axios.get(
        "http://localhost:11000/admin/realms/master/users?username"+ username + "&firstName=" + firstName,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': auth
          },
        }
      );
      const responseData = response.data[0];
      return responseData;
    } catch (error) {
        console.error("Error:", error.response);
        return error.response.data.errorMessage;
    }
  };


export const findUsers = async (auth: string): Promise<User[]> => {
    try {  
      const response = await axios.get(
        "http://localhost:11000/admin/realms/master/users",
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': auth
          },
        }
      );
      const responseData = response.data;
      return responseData;
    } catch (error) {
        console.error("Error:", error.response);
        return error.response.data.errorMessage;
    }
  };

export const setUserPassword = async (data: PasswordReset, id: string, auth: string) => {
    try {  
       await axios.put(
        "http://localhost:11000/admin/realms/master/users/" +id+ "/reset-password", data,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': auth
          },
        }
      );
    } catch (error) {
        console.error("Error:", error.response);
      return error.response.data.errorMessage;
    }
  };
  

  async function hashPassword(passwordToHash: string, saltRounds: number) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(passwordToHash, salt);
      return hashedPassword;
    } catch (error) {
      console.error('Error:', error);
    }
  }