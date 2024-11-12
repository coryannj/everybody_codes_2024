const fs = require('fs');
const input1 = fs.readFileSync('../quest6_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest6_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest6_3.txt',{ encoding: 'utf8', flag: 'r' });

function getPaths(input,partNo){
    let tree = Object.fromEntries(input.split(/[\r\n]+/).map((x)=>x.split(/[:,]/)).map((x)=>[x[0],x.slice(1)]))
    let paths = []
    let queue = tree['RR'].map((x)=>['RR',x])
    
    while(queue.length>0){
        let next = queue.shift()  
        let branch = tree[next.at(-1)]
  
        if(branch !== undefined){
            branch.forEach((x)=>{
                if(x !== '@'){
                    if(!next.includes(x)){
                        queue.push(next.concat(x))
                    }
                } else {
                    paths.push(next.concat(x))
                }
            })
        } 
    }
    return partNo<2 ? paths.find((x,ix,arr)=>x.includes('@') && arr.findIndex((y,yx)=>yx !== ix && y.includes('@') && y.length === x.length)===-1).join('') : paths.find((x,ix,arr)=>x.includes('@') && arr.findIndex((y,yx)=>yx !== ix && y.includes('@') && y.length === x.length)===-1).map((x)=>x[0]).join('')
}

console.log(getPaths(input1,1)) // Part 1
console.log(getPaths(input2,2)) // Part 2
console.log(getPaths(input3,3)) // Part 3