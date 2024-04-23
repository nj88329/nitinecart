const { res } = require("express");
const { constants } = require("../constants");

const errorHandler = ( err , req , res, next ) => {
 const statusCode = res.statusCode ? res.statusCode : constants.SERVER_ERROR;
 switch(statusCode) {
    case constants.VALIDATION_ERROR:
       console.log(res.send({
            title:"Validation failed",
            message:err.message,
            stackTrace : err.stack,
        }));
         break;
         case constants.UNAUTHORIZED :
       res.send({ title:"Unauthorised" , 
            message: err.message ,
             stackTrace : err.stack
             }) ;     
             break;
         case constants.FORBIDDEN:
              res.send({ title:"Forbidden" , 
                  message: err.message ,
                stackTrace : err.stack
                }) ;     
                break;
          case constants.NOT_FOUND:
                 res.send({ title:"Not Found" , 
                     message: err.message ,
                   stackTrace : err.stack
                   }) ;     
                   break;
          case constants.SERVER_ERROR:
                 res.send({ title:"Server error" , 
                     message: err.message ,
                   stackTrace : err.stack
                   }) ;     
                   break;
            default:
               console.log("No error");
        } 
};

module.exports = errorHandler ;