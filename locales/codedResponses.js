const m = (c, m)=>{ return { code: c, message: m }; };

module.exports = { 
    test:                                 t => m(0, t('test'))
};