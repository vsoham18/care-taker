export const validate = (schema) => async(req,next) =>{
    try{
       const parseBody = await schema.parseAsync(req.body);
       req.body = parseBody;
       next();
    }catch(err){ 
        const extraDetails= err.issues[0].message
        const message = "fill the input properly"
        const error={
            message, 
            extraDetails
        } 
        next(error)
    }
} 