const check=require('./index')

test('range',()=>{
    check.check('range',"aaaaaaaaaaaaaaaaaaaaaaaaaaa",[3,10],err=>{
        console.log(err)
        expect(!!err).toBe(false);
    })
})

test('testobj',()=>{
    check.checkFields({a:'asdf',v:'123'},{
        a:{
            required:1,
            range:[4,20],
            name:true
        },
        b:{
            required:true,
            num:true,
            max:20,
            min:1
        }
    }).then(rs=>{
        console.log(rs)
        expect(1).toBe(1);
    }).catch(err=>{
        console.log(err)
        expect(3).toBe(1);
    })


    
})