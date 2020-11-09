// types: s = success | e = error | w = warning | i = info
// codes: are used for conditionals on the frontend to perform certain actions
const getType = (type) => {
    switch (type) {
        case "s": return "success";
        case "e": return "error";
        case "w": return "warning";
        case "i": return "info";
        default: return "";
    }
}
const m = (t, c, m)=>{ return { type: getType(t), code: c, message: m }; };

module.exports = { 
    user_input_errors:                                  t => m("e", 0, t('user_input_errors')),
    verification_code_mobile_sent:                      t => m("s", 1, t('verification_code_mobile_sent')),
    verification_code_email_sent:                       t => m("s", 2, t('verification_code_email_sent')),
    service_request_submission_failed:                  t => m("e", 3, t('service_request_submission_failed')),
    service_request_failed_to_update_user_details:      t => m("e", 4, t('service_request_failed_to_update_user_details')),
    service_request_mobile_or_auth_invalid:             t => m("e", 5, t('service_request_mobile_or_auth_invalid')),
    service_request_failed_to_send_code:                t => m("e", 6, t('service_request_failed_to_send_code')),
    service_request_mobile_number_verified:             t => m("s", 7, t('service_request_mobile_number_verified')),
    fields_missing:                                     t => m("e", 8, t('fields_missing')),
    this_field_is_required:                             t => m("e", 9, t('this_field_is_required')),
    server_error:                                       t => m("e", 10, t('server_error')),
    not_found:                                          t => m("e", 11, t('not_found')),
};