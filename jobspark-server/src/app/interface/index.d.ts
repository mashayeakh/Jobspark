import { Role } from "better-auth/plugins"
import { IRequestUser } from "../middleware/requestUserInterface"


declare global {
    namespace Express {
        interface Request {
            user: IRequestUser
        }
    }
}
