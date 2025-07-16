import app from "./app";
import mongoose from "mongoose";
// NOTE: Makes sure the env variables are defined
import env from "./util/validateEnv";

const port = env.PORT;

// NOTE: Now using env insted of process.env (using validateEnv.ts)
mongoose.connect(env.CONN_STRING)
    .then(() => {
        console.log("Mongoose connected!");
        app.listen(port, () => {
            console.log("Server is running on PORT: " + port);
        });
    })
    .catch(console.error);

