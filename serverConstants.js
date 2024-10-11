'use strict'
/**
 * 
 * constant.js:Starting Point of Sever 
 * Developer:Santosh Dubey
 * 
 */

const reqEnv = ['PORT', 'CODE_VERSION', 'NODE_ENV'];
reqEnv.forEach(element => {
    if (!process.env[element]) throw new Error(`Missing Environment ${element}`)
});

module.exports = {

    PORT: process.env.PORT,
    CODE_VERSION: process.env.CODE_VERSION,
    NODE_ENV: process.env.NODE_ENV,
    LOCAL_IP: process.env.LOCAL_IP || "",
    MONGODB_URI: process.env.MONGODB_URI || "",
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) || "",
}