require('dotenv').config();
const environment = process.env.NODE_ENV;

const knex = require('../../config/db-connect');
const PREFIX = "wb_";
const ACTIONS = {
    profileUpdated: 1,
    updateError: 2
};

const log = (...messages)=>{
    if(environment!=="production"){
        console.log("update_customer_profile", messages);
    }
};

const dbLog = (trx, action, data) => {
    let entry = "";
    switch (action) {
        case ACTIONS.profileUpdated:
            entry = `Customer profile updated, ID: ${data.id}`;
            break;
        case ACTIONS.updateError:
            entry = `Failed to update customer profile, ID: ${data.id} | Error: ${data.err.message}`;
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

const updateIfExisting = (trx, data) => {
    const {first_name, last_name, email, token, customerId} = data;
    return knex(PREFIX+'customer')
    .transacting(trx)
    .update({
        first_name,
        last_name,
        email,
        updated_at: new Date()
    })
    .where({auth_code: token, id: customerId})
    .returning('*');
};

exports.updateCustomerProfile = ({first_name, last_name, email, token, customerId})=>{
    return new Promise((resolve, reject) => {
        knex.transaction(async (trx) => {
            try {
                const updatedCustomerRows = await updateIfExisting(trx, {
                    first_name, last_name, email, token, customerId
                });
                if(updatedCustomerRows.length > 0){
                    log("updatedCustomerProfile", updatedCustomerRows);
                    const logId = await dbLog(trx, ACTIONS.profileUpdated, updatedCustomerRows[0]);
                    trx.commit;
                    resolve({customer: updatedCustomerRows[0], log: logId[0]});
                    return;
                }
                throw new Error("Failed to update profile, please relogin and try again.")
            } catch (err) {
                const logId = await dbLog(null, ACTIONS.updateError, {id: customerId, err});
                log("error", err);
                trx.rollback;
                reject(err);
                return;
            }
        });
    });
};