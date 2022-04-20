import express from "express";
import bodyParser from "body-parser";

import taskRouter from "./routes/task.js";
import userRouter from "./routes/user.js";
import clientsRoutes from "./routes/clients.js";

import dotenv from "dotenv";
import cors from "cors";

import "./db/mongoose.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());

const port = process.env.PORT;

app.use(taskRouter);
app.use(userRouter);

app.use("/clients", clientsRoutes);



app.listen(port, () => {
    console.log("Server is up on port " + port);
});

// const token = jwt.sign({ _id: "123abc" }, "mysecrethere", {
//   expiresIn: "1 days",
// });

// const data = jwt.verify(token, "mysecrethere");

// console.log(data);

// const main = async () => {
// const task = await Task.findById("6259fba6e61f94899adcce45");
// await task.populate("owner");
// console.log(task);

// const user = await User.findById("6259fb90e61f94899adcce3c")
//   .populate([{ path: "tasks", select: ["title", "description"] }])
//   .exec();
// // await user.populate([{path: 'tasks'}]).exec();
// console.log("user");
// console.log(user.tasks);
// console.log({ ...user._doc, tasks: [...user.tasks] });
// };

// main();