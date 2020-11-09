const knex = require('../../config/db-connect');
const log = require('../../util/consoleLogger');
const dbLog = require('../../util/databaseLogger');

const PREFIX = "wb_";
const TAG = "getCustomerAuthCode";

const generateAuthCode = () => Math.floor(Math.random()*90000) + 10000;

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
                    log(TAG, {updatedCustomer: updatedCustomerRows});
                    trx.commit;
                    resolve({customer: updatedCustomerRows[0]});
                    return;
                }
    
                const newCustomerRows = await createIntial(trx, mobile);
                if(newCustomerRows.length > 0){
                    log(TAG, {newCustomer: newCustomerRows});
                    trx.commit;
                    resolve({customer: newCustomerRows[0]});
                    return;
                }
    
                throw new Error("Failed to create/update account.")
            } catch (err) {
                await dbLog(null, {token: mobile, entry: `${TAG}, Error, ${err}`});
                log(TAG, {error: err});
                trx.rollback;
                reject(err);
                return;
            }
        });
    });
};