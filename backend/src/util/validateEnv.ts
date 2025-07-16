// NOTE: Clean up and sanitise environment variables to make sure they are not undefined
import { cleanEnv, port, str } from "envalid";

export default cleanEnv(process.env, {
    CONN_STRING: str(),
    PORT: port(),
    SESSION_SECRET: str(),
});