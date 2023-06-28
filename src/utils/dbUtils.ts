import { PrismaClient } from "@prisma/client";
import {hash} from "bcrypt";

const prisma = new PrismaClient();

export async function authenticateUser(username: string, password: string){
    const passwordHashed = await hash(password,12);
    const user = await prisma.user.findFirst({
        where:{
            userName:username,
            password:passwordHashed
        }
    })
    if(user != null){
        return user.uid;
    }else{
        console.log("Invalid User") //TODO: Change it to a toast
        return
    }
}
