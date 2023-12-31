/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from 'body-parser';
import { userController } from "./controller/UserController";
import { keycloakController } from "./controller/KeycloakController";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";


dotenv.config();


if (!process.env.PORT) {
    process.exit(1);
 }
 
 const PORT: number = parseInt(process.env.PORT as string, 10);
 
 const app = express();


/**
 *  App Configuration
 */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/api/users", userController);
app.use('/api/v1', keycloakController);


app.use(errorHandler);
app.use(notFoundHandler);

/**
 * App implementation
 */

app.get('/', (req, res) => {
  res.send('Hello World');
});


/**
 * Server Activation
 */

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
