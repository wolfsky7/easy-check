/**
 * @author wolfsky7
 * @time 2016-11-04
 */
module.exports={
    isEmpty:function(value){
        if (value == undefined || value.length == 0) {
            return true;
        } else {
            return false;
        }
    },
    check_empty:function(v){
        return this.isEmpty(v)
    },
    check_commonstr/*普通字符检查 过滤特殊字符*/:function(s,min,max){
        // return true;
        if(min&&max){
            return s&&new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5]{"+min+","+max+"}$").test(s)
        }
        if(min)
            return s&&new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5]{"+min+",}$").test(s)
        if(max)
            return s&&new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5]{0,"+max+"}$").test(s)
        return s&&/^[a-zA-Z0-9_\u4e00-\u9fa5]*?$/.test(s);
    },
    check_date:function(s){
        return s&&/^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}/.test(s);
    },
    check_phone:function(s){
        return s&&/^1[3-8]{1}[0-9]{9}$/.test(s)
    },
    check_unm:function(s){
        return s&&/^\w{2,20}$/.test(s);
    },
    check_num:function(s){
        return (s||s=="0")&&/^(-\d+?|\d+?)(.\d*|\d*)$/.test(s)
    },
    check_payPwd:function(s){
        return s&&/^[0-9]{6}$/.test(s);
    },
    check_chname:function(s){//检测姓名 只能包含汉语和字母(2,20)
        return s&&/^([\u4E00-\u9FFF]|[a-zA-Z]){2,20}$/.test(s)
    },
    check_email:function(s){
        return s&&/^[0-9|a-z|A-Z|_]*?@[0-9|a-z|A-Z|_]+?\.[0-9|a-z|A-Z]+?$/.test(s)
    },
    check_pwd:function(s) {//6-16位 非连续的数字或字母
        var patrn = /^(\w){6,16}$/;
        if(patrn.exec(s)){
            var l=s.length,b=true,b1=s.charCodeAt(0)-s.charCodeAt(1);
            if(b1*b1!=1){
                return b;
            }
            for(var i=2;i<l;i++){
                b=b&&((s.charCodeAt(i)+b1)==s.charCodeAt(i-1));
                if(!b)break;
            }

            return !b;
        }
        return false;
    },
    check_required:function(s){
        var st=typeof s;
        if(s||(st=="number"&&s==0)||(st=="boolean"&&s==false))
            return true;
        return false;
    },
    check_length:function(s,min,max){
        min=min||0;
        max=max||100000;
        var r=new RegExp('^(\\w){'+min+','+max+'}$');
        return r.test(s);
    },
    /*_i int  _b bool _f float _m 字符串最大 _*/
    check_max:function(v,max){
        v=parseFloat(v);
        return v<=max;
    },
    check_min:function(v,min){
        v=parseFloat(v);
        return v>=min;
    },
    check_maxLength:function(v,max){
        return v&&v.length<=max||!v;
    },
    check_minLength:function(v,min){
        return v&&v.length>=min;
    },
    check_reg:function(v,reg){
        var r=new RegExp(reg);
        return r.test(v);
    },
    check_web:function(v){
        return v&&/http:/.test(v);
    },
    check_idno:function(code){
        //检测身份证
        var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
        var tip = "";
        var pass = true;
        if (!code) {
            return false;
        }
        code = code.toUpperCase();

        if (!code || !/^[1-9]\d{5}((1[89]|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dx]$/i.test(code)) {
            tip = "身份证号格式错误";
            pass = false;
        }

        else if (!city[code.substr(0, 2)]) {
            tip = "地址编码错误";
            pass = false;
        }
        else {
            //18位身份证需要验证最后一位校验位
            if (code.length == 18) {
                code = code.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                //校验位
                var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++) {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                var last = parity[sum % 11];
                if (parity[sum % 11] != code[17]) {
                    tip = "校验位错误";
                    pass = false;
                }
            }
        }
        //if (!pass) alert(tip);
        return pass;

    },
    specialFields:['_i','_f','_m'],
    errMsgs:{
        max:'{0}需小于{1}',
        min:'{0}需大于{1}',
        required:'{0}不能为空',
        phone:'{0}非正确的手机号',
        pwd:'{0}非正确的密码',
        num:'请输入正确的{0}',
        payPwd:'请输入正确的{0}',
        email:'请输入正确的{0}',
        chname:'请输入正确的{0}',
        maxLength:'{0}最大{1}位',
        minLength:'{0}最小{1}位',
        reg:'请输入正确的{0}',
        unm:'请输入正确的{0}',
        date:'请输入正确的{0}',
        idno:'请输入正确的身份证号码',
        web:'请输入正确的{0}',
        commonstr:'请去掉特殊字符',
    },
    errFormat:function(fstr,name){
        if(typeof arguments.length==2){
            fstr=fstr.replace(/\{0\}/g,arguments[1]);
        }
        else{
            var reg;
            for(var i=1;i<arguments.length;i++){
                reg=new RegExp("\\{"+(i-1)+"\\}",'g');
                fstr=fstr.replace(reg,arguments[i]);
            }
        }
        return fstr;
    },
    checkFields:function(/*被检测对象*/o,/*需检查的字段*/fields,callback){
        var me=this,err=null,field,rules,rule,args,errArgs,sps={"rules":'',"key":'',"msg":'',"name":''};


        for(var f in fields){
            if(err)
                break;
            field=fields[f]
            rules=field.rules||[];
            for(var r in field){
                if(!(r in sps)){
                    var rule={
                        value:field[r],
                        rule:r,
                        msg:field.msg||me.errMsgs[r]
                    };
                    if(me["check_"+rule.rule]){
                        args=[o[field.key]];
                        errArgs=[rule.msg];
                        if(rule.value){
                            if(!(rule.value instanceof Array)){
                                args.push(rule.value);
                                errArgs.push(field.name||field.key);
                                errArgs.push(rule.value);
                            }
                            else{
                                if(rule.name){
                                    errArgs.push(field.name)
                                }
                                for(var v in rule.value){
                                    args.push(rule.value[v]);
                                    errArgs.push(rule.value[v]);
                                }
                            }
                            if(me.isEmpty(args[0])&&!field.required){
                                continue;
                            }

                            if(!me["check_"+rule.rule].apply(me,args)){
                                err=me.errFormat.apply(me,errArgs);
                                break;
                            }
                        }

                    }
                }
            }
        }
        return callback?(callback(err)):(err?(Promise.reject(err)):(Promise.resolve()));
    },
    registerRule:function(rulename,ruleErrMsg,ruleMethod) {
        this["check_"+rulename]=ruleMethod;
        this.errMsgs[rulename]=ruleErrMsg;
    },
    isExistRule:function(rulename){
        return !!this['check_'+rulename];
    }
}