const authorizeRoles = (...allowedRoles) => {
    
return (req,res,next) =>{

    if(!allowedRoles.includes(req.user.role)){
        return res.status(304).json({message :"Access denided"});
    }

    next();
};

};

export default authorizeRoles;