const jwt = require('jsonwebtoken')
const User = require('./model/User.js')
require('dotenv').config()

const auth = async (req,res,next)=>{

    try {
    
    const token = req.header('Authorization').replace('Bearer ', '');
    const decode = jwt.verify(token,process.env.JWT)
    const user = await User.findOne( {_id:decode._id, 'tokens.token':token } )
    if(!user)
        return res.status(401).send({error:'Authentication Required'})
    if(!user.isVerified)
        return res.status(401).send({error:'Email is Not Verified'})
    req.user = user
    req.token = token    
    
    next()

    } catch (error) {
        res.status(401).send({error:`Something Went Wrong ${error}`})
    }


}
module.exports = auth