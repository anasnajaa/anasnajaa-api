const knex = require('../../config/db-connect');
const log = require('../../util/consoleLogger');
const dbLog = require('../../util/databaseLogger');

const PREFIX = "wb_";
const TAG = "updateCustomerProfile";

const updateIfExisting = (trx, {
    first_name, last_name, email, join_mailing, token
}) => {
    return knex(PREFIX+'customer')
    .transacting(trx)
    .update({
        first_name,
        last_name,
        email,
        is_profile_complete: true,
        is_joined_mailing: join_mailing,
        updated_at: new Date()
    })
    .where({auth_code: token, is_profile_complete: false})
    .returning('*');
};

const addService = (trx, {
    customer_id, service_id, description
}) => {
    return knex(PREFIX+'case')
    .transacting(trx)
    .insert({
        customer_id,
        service_id,
        description
    })
    .returning('*');
};

const getServiceTitle = (trx, {
    service_id
}) => {
    return knex(PREFIX+'service')
    .transacting(trx)
    .select(['name'])
    .where({id: service_id});
};

exports.completeCustomerProfileSetup = ({
    first_name, last_name, email, 
    join_mailing, token, serviceId, description
})=>{
    return new Promise((resolve, reject) => {
        knex.transaction(async (trx) => {
            try {
                const updatedCustomerRows = await updateIfExisting(trx, {
                    first_name, last_name, email, join_mailing, token
                });

                if(updatedCustomerRows.length === 0){
                    throw new Error("Failed to update profile.");
                }

                log(TAG,{updatedCustomer:updatedCustomerRows});

                const customer = updatedCustomerRows[0];

                const customerServiceRows = await addService(trx, {
                    customer_id: customer.id,
                    service_id: serviceId,
                    description
                });

                if(customerServiceRows.length === 0){
                    throw new Error("Failed to add service to customer.");
                }

                log(TAG, {customerService: customerServiceRows});

                const serviceRows = await getServiceTitle(trx, {service_id: serviceId});

                trx.commit;

                resolve({
                    customer: updatedCustomerRows[0], 
                    customerService: customerServiceRows[0],
                    service: serviceRows[0]
                });
                return;
            } catch (err) {
                await dbLog(null, {token, entry:`${TAG}, Error, ${err}`});
                log(TAG, {error: err});
                trx.rollback;
                reject(err);
                return;
            }
        });
    });
};