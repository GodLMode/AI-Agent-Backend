import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { serve } from "inngest/express";
import {inngest} from "./inngest/client.js";
import {onUserSignUp} from "./inngest/functions/on-signup.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";
const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());


//routes
import userRouter from './routers/user.router.js';
import ticketRouter from './routers/ticket.router.js';

app.use('/api/v1/users',userRouter);
app.use("/api/v1/tickets",ticketRouter);
app.use("/api/inngest", serve({ client: inngest, functions:[onUserSignUp,onTicketCreated]}));



export {app};