require('dotenv').config();
const environment = process.env.NODE_ENV;
const {v4} = require('uuid');

const knex = require('../../config/db-connect');
const PREFIX = "wb_";
const ACTIONS = {
    customerVerified: 1,
    verificationError: 2
};
const generateAuthCode = () => v4();

const log = (...messages)=>{
    if(environment!=="production"){
        console.log("verify_customer", messages);
    }
};

const dbLog = (trx, action, data) => {
    let entry = "";
    switch (action) {
        case ACTIONS.customerVerified:
            entry = `Customer Verified, ID: ${data.id}`;
            break;
        case ACTIONS.verificationError:
            entry = `Failed to verify customer, Mobile: ${data.mobile} | Error: ${data.err.message}`;
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

const updateIfExisting = (trx, mobile, authCode) => {
    return knex(PREFIX+'customer')
    .transacting(trx)
    .update({
        auth_code: generateAuthCode(),
        updated_at: new Date()
    })
    .where({mobile, auth_code: authCode})
    .returning(['id', 'auth_code', 'mobile']);
};

exports.verifyCustomerAuthCode = (mobile, authCode)=>{
    return new Promise((resolve, reject) => {
        knex.transaction(async (trx) => {
            try {
                const verifiedCustomerRows = await updateIfExisting(trx, mobile, authCode);
                if(verifiedCustomerRows.length > 0){
                    log("verifiedCustomer", verifiedCustomerRows);
                    const logId = await dbLog(trx, ACTIONS.customerVerified, verifiedCustomerRows[0]);
                    trx.commit;
                    resolve({customer: verifiedCustomerRows[0], log: logId[0]});
                    return;
                }
                throw new Error("Failed to verify account.")
            } catch (err) {
                const logId = await dbLog(null, ACTIONS.verificationError, {mobile, err});
                log("error", err);
                trx.rollback;
                reject(err);
                return;
            }
        });
    });
};