import jwt from "jsonwebtoken"


export const auth = (req, res, next) => {
    try{
        const token= req.headers.authorization.split(" ")[1]
        const isCustomAuth= token.length<500
        let decodedData;

        if(token && isCustomAuth){
            decodedData=jwt.verify(token,"secret")
            req.userId=decodedData?.id               //Gets user Id if its inhouse Auth
        }
        else{
            decodedData=jwt.decode(token)
            req.userId=decodedData?.sub             //Gets user Id if its google Auth
        }

        next()
    }
    catch(error){
        console.log(error)
    }
}