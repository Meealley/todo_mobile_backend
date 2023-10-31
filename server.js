const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const colors = require("colors");
const PORT = process.env.PORT || 5000;
const connectDB = require("./Config/dbConnect");
const cookieParser = require("cookie-parser");
const UserRoutes = require("./Routes/UserRoute");
const {
  notFound,
  errorHandler,
} = require("./Middleware/ErrorHandlerMiddleware");

connectDB();

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", UserRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
