const m = (c, m)=>{ return { code: c, message: m }; };

module.exports = { 
    test:                                   t => m(0, t('test')),
    verification_code_sent:                 t => m(0, t('verification_code_sent')),
};