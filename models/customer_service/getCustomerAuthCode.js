require('dotenv').config();
const environment = process.env.NODE_ENV;
const knex = require('../../config/db-connect');
const PREFIX = "wb_";
const ACTIONS = {
    newCustomer: 1,
    returningCustomer: 2,
    registrationOrLoginError: 3
};
const generateAuthCode = () => Math.floor(Math.random()*90000) + 10000;

const log = (...messages)=>{
    if(environment!=="production"){
        console.log("get_auth_code", messages);
    }
};

const dbLog = (trx, action, data) => {
    let entry = "";
    switch (action) {
        case ACTIONS.newCustomer:
            entry = `New Customer Registration, ID: ${data.id}`;
            break;
        case ACTIONS.returningCustomer:
            entry = `Returning customer login, ID: ${data.id}`;
            break;
        case ACTIONS.registrationOrLoginError:
            entry = `Couldn't login or register, Mobile: ${data.mobile} | Error: ${data.err.message}`;
            break;
        default:
            break;
    }

    if(trx){
        return knex(PREFIX+'logs')
        .transacting(trx)
        .insert({entry})
        .returning(['id']);
    } else {
        return knex(PREFIX+'logs')
        .insert({entry})
        .returning(['id']);
    }
};

const updateIfExisting = (trx, mobile) => {
    return knex(PREFIX+'customer')
    .transacting(trx)
    .update({
        auth_code: generateAuthCode(),
        updated_at: new Date()
    })
    .where({mobile})
    .returning(['id', 'auth_code', 'mobile']);
};

const createIntial = (trx, mobile) => {
    return knex(PREFIX+'customer')
    .transacting(trx)
    .insert({
        mobile,
        auth_code: generateAuthCode()
    })
    .returning(['id', 'auth_code', 'mobile']);
};

exports.getCustomerAuthCode = (mobile)=>{
    return new Promise((resolve, reject) => {
        knex.transaction(async (trx) => {
            try {
                const updatedCustomerRows = await updateIfExisting(trx, mobile);
                if(updatedCustomerRows.length > 0){
                    log("updatedCustomer", updatedCustomerRows);
                    const logId = await dbLog(trx, ACTIONS.returningCustomer, updatedCustomerRows[0]);
                    trx.commit;
                    resolve({customer: updatedCustomerRows[0], log: logId[0]});
                    return;
                }
    
                const newCustomerRows = await createIntial(trx, mobile);
                if(newCustomerRows.length > 0){
                    log("newCustomer", newCustomerRows);
                    const logId = await dbLog(trx, ACTIONS.newCustomer, newCustomerRows[0]);
                    trx.commit;
                    resolve({customer: newCustomerRows[0], log: logId[0]});
                    return;
                }
    
                throw new Error("Failed to create/update account.")
            } catch (err) {
                await dbLog(null, ACTIONS.registrationOrLoginError, {mobile, err});
                log("error", err);
                trx.rollback;
                reject(err);
                return;
            }
        });
    });
};