import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { success } from "zod";

/**
 * * 3 steps
 *  * a- createToken()
 *  * b- verifyToken()
 *  * c- decodeToken()
 */


//! create Token 
export const createToken = (payload: JwtPayload, secret: string, { expiresIn }: SignOptions) => {
    const token = jwt.sign(payload, secret, { expiresIn })
    // console.log("***Token generates : ", token)
    return token;
}

//!verify token: stpes

export const vefiryToken = (token: string, secret: string) => {
    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;
        console.log("***Decoded token with token and secret: ", decoded)

        return {
            success: true,
            data: decoded
        }

    } catch (error: any) {
        // throw error;
        return {
            success: false,
            message: error.message,
            error
        }
    }
}


//! decode Token stpes

export const decodedToken = (token: string) => {
    const decoded = jwt.decode(token) as JwtPayload;
    console.log("👉👉👉Decoded token only: ", decoded)
    return decoded;
}
