﻿module.exports = {

    getSession : function (sessionId, callback) {
        
        try{
            global.redisClient.get(sessionId, function (err, reply) {
                if (!err) {
                    if (reply) {
                        if (callback)
                            callback(null, JSON.parse(reply));
                    }
                    else {
                        if (callback) {
                            callback(null, {}); //pass an empty session.
                        }
                    }
                }
                else {
                    if (callback) { 
                        callback(err, null);
                    }
                }

            });

        }catch(err){                    
            global.winston.log('error',{"error":String(err),"stack": new Error().stack});                                                            
        }
    },
    
    
    /*Saves the user session into Redis.
     * @session : Object
     *  {
            id : global.uuid.v1(),
            userId : result._id,
            loggedIn : true,
            appId : appId,
            email : result.email,
            roles : [string of role id's]
        };
     * @callback : Its a simple callback. 
     */ 
    saveSession : function (session, callback) {
        try{
            global.redisClient.set(session.id, JSON.stringify(session), function (err, reply) {
                global.redisClient.expire(session.id, 30 * 24 * 60 * 60);
                if (callback)
                    callback(err, reply);
            });

        }catch(err){                    
            global.winston.log('error',{"error":String(err),"stack": new Error().stack});                                                            
        }
    }

};