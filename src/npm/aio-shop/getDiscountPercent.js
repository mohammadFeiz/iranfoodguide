export default function getDiscountPercent(dp = 0){
    function validate(v = 0){v = +v; if(isNaN(v)){v = 0} return v};
    let list = !Array.isArray(dp)?[{value:dp}]:dp.map((o)=>{
        return typeof o === 'object'?o:{value:o}
    })
    let sum = 0;
    for(let i = 0; i < list.length; i++){
        sum += validate(list[i].value);
    }
    return sum;
}