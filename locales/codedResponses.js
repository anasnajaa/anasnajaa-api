const m = (c, m)=>{ return { code: c, message: m }; };

module.exports = { 
    test:                                           t => m(0, t('test')),
    verification_code_mobile_sent:                  t => m(1, t('verification_code_mobile_sent')),
    verification_code_email_sent:                   t => m(2, t('verification_code_email_sent')),
};