const express = require("express");
const taskRouter = require("./routes/task");
const userRouter = require("./routes/user");
require("./db/mongoose");
require('dotenv').config()

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use(taskRouter);
app.use(userRouter);

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
