const {v4} = require('uuid');

const log = require('../../util/consoleLogger');
const dbLog = require('../../util/databaseLogger');
const knex = require('../../config/db-connect');

const PREFIX = "wb_";
const TAG = "verifyCustomerAuthCode";

const generateAuthCode = () => v4();

const createAuthToken = (trx, id) => {
    return knex(PREFIX+'customer')
    .transacting(trx)
    .update({
        auth_code: `${id}-${generateAuthCode()}`,
        updated_at: new Date()
    })
    .where({id})
    .returning(['id', 'auth_code', 'mobile']);
};

const findCustomer = (trx, mobile, authCode) => {
    return knex(PREFIX+'customer')
    .transacting(trx)
    .select(['id', 'auth_code', 'mobile'])
    .where({mobile, auth_code: authCode})
};

exports.verifyCustomerAuthCode = (mobile, authCode)=>{
    return new Promise((resolve, reject) => {
        knex.transaction(async (trx) => {
            try {
                const customerRows = await findCustomer(trx, mobile, authCode);
                if(customerRows.length === 0){
                    throw new Error("Failed to verify account.");
                }

                log(TAG, {customer: customerRows});

                const customerId = customerRows[0].id;

                const verifiedCustomerRows = await createAuthToken(trx, customerId);
                if(verifiedCustomerRows.length === 0){
                    throw new Error("Failed to verify account.");
                }
                
                log(TAG, {verifiedCustomer: verifiedCustomerRows});
                trx.commit;
                resolve({customer: verifiedCustomerRows[0]});
                return;
            } catch (err) {
                await dbLog(null, {token: authCode, entry:`${TAG}, Error, ${err}`});
                log(TAG, {error: err});
                trx.rollback;
                reject(err);
                return;
            }
        });
    });
};