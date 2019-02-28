// 手动实现promise的.then,.catch和链式调用
function MyPromsie(fn){
    var state = "pending";
    var value = null;
    var callbacks =[];
     function callback(onfulfilled,onrejected){
         return new MyPromsie(function(resolve,reject){
             console.log('brigePromise');
            handle({
                onfulfilled:onfulfilled || null,
                resolve:resolve,
                reject:reject,
                onrejected:onrejected || null,
            })
        })
    }
    this.catch = function(onrejected){
        return this.then.call(this,null,onrejected);
    }
    this.then = function(onfulfilled,onrejected){
        return callback(onfulfilled,onrejected)  //.then里面会注册一个promise然后这个promise会等到.then前面的promise，
                                                // resolve或者rejected之后在根据返回的值判断是否是返回一个promise，如果返回promise的话，会将该promise的resolve和reject传入并且执行然后在返回中间的promise执行接下来的.then注册的函数
    }
    function handle(callback){
        if(state === 'pending'){
            callbacks.push(callback);
            return;
        }
        // promise resolve状态
        if(state === 'fulfilled'){
            if(!callback.onfulfilled){
            callback.resolve(value);
            return;
           }
            var ret = callback.onfulfilled(value);
            return callback.resolve(ret);
        }
        // promise reject状态
        if(state ==="rejected"){
            if(!callback.onrejected) {
            callback.reject(value);
            return;
        }
        var ret = callback.onrejected(value);
        return callback.reject(ret);
        }
       
    }
    function reject(newValue){
       if(newValue && (typeof newValue ==='object' || typeof newValue ==='function')){
        if(newValue.then && typeof newValue.then ==="function"){
            newValue.then.call(newValue,resolve,reject);
            return;
        }
       }
       value = newValue;
       state = "rejected";
       setTimeout(function(){
          callbacks.forEach(callback =>{
           handle(callback);
          }) 
       },0)
    }
    function resolve(newValue){
       if(newValue && (typeof newValue ==='object' || typeof newValue ==='function')){
           if(newValue.then && typeof newValue.then ==="function"){
            console.log('newValue',newValue);
            newValue.then.call(newValue,resolve,reject);
            return;
           }
       }
       value = newValue;
       state = "fulfilled";
       setTimeout(function(){
          callbacks.forEach(callback =>{
           handle(callback);
          }) 
       },0)
    }
    fn(resolve,reject)
};
new MyPromsie(function(resolve,reject){
   setTimeout(function(){
       resolve(3)
   },0)
}).then((value) =>{
    console.log('value',value);
    return new MyPromsie(function(resolve,reject){
   setTimeout(function(){
       reject(4)
   },0)
})
}).catch((err) =>{
    console.log('err',err);
})
// new MyPromsie(function(resolve,reject){
//    setTimeout(function(){
//        reject(3)
//    },0)
// }).catch((value) =>{
//     console.log('value',value);
//    return new MyPromsie((resolve,reject) =>{ 
//       resolve(33)
//    })
// }).then(secondVal =>{
//     console.log('secondVal',secondVal)
// })