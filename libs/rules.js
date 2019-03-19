const isNull = v => {
    return v === null || v === undefined
}

const isEmpty = v => {
    return isNull(v) || v === ''
}

const checkPattern = (value, pattern, cb) => {
    if (isEmpty(value)) {
        return cb(true)
    }

    cb(pattern.test(value))
}


const methods = {}



module.exports = {
    checkPattern,
    isNull,
    isEmpty,
    registerMethod: (name, msg, method) => {
        if (msg instanceof Function) {
            opts = method
            method = msg;
        }

        methods[name] = {
            f: method,
            opts: msg,
            msg: msg,
        }
    },
    errorFormat: (msg, opts) => {
        if (!isNull(opts)) {
            if(typeof opts != "object"){
                opts=[opts]
            }
            return Object.keys(opts).reduce((l, n) => {
                return l.replace(`{${n}}`, opts[n])
            }, msg)
        }
        return msg;
    },
    check: function(name, value, opts, cb) {
        let one = methods[name];
        if (!one) {
            return cb(null);
            throw new Error(`unknown check method ${name}`)
        }

        one.f(value, opts, (result) => {
            if (result === true) {
                cb(null)
            }
            else if (result === false) {
                cb(this.errorFormat(one.msg,opts))
            }
            else {
                cb(result)
            }
        })
    },
    checkFields: function (/*被检测对象*/o,/*需检查的字段*/fields) {
        var me = this;

        let msgs = {};
        let allPs = []


        Object.keys(fields).forEach(f => {
            let field = fields[f];
            const { key, msg, name,required, ...rules } = field
            let _isEmpty=isEmpty(o[f])
            if(required){
                if(_isEmpty){
                    msgs[f]='不能为空'
                    return;
                }
            }
            else{
                if(_isEmpty){
                    return;
                }
            }
            Object.keys(rules).forEach(r => {
                if(Object.keys(msgs).length){
                    return;
                }
                if (rules[r])
                    allPs.push(new Promise((s1) => {
                        me.check(r, o[f], rules[r], err => {
                            if (err) {
                                msgs[f] = msgs[f] || err;
                            }
                            s1()
                        })
                    }))
            })
        })

        return Promise.all(allPs).then(() => {
            if (Object.keys(msgs).length) {
                return Promise.reject(msgs)
            }
        })
    },

}