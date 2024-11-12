const fs = require('fs');
const input1 = fs.readFileSync('../quest6_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest6_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest6_3.txt',{ encoding: 'utf8', flag: 'r' });

function getPaths(tree,partNo){
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
        } else {
            paths.push(next)
        }
    }
    return partNo<2 ? paths.filter((x,ix,arr)=>x.includes('@') && arr.findIndex((y,yx)=>yx !== ix && y.includes('@') && y.length === x.length)===-1)[0].join('') : paths.filter((x,ix,arr)=>x.includes('@') && arr.findIndex((y,yx)=>yx !== ix && y.includes('@') && y.length === x.length)===-1)[0].map((x)=>x[0]).join('')
}

// Part 1
let tree1 = Object.fromEntries(input1.split(/[\r\n]+/).map((x)=>x.split(/[:,]/)).map((x)=>[x[0],x.slice(1)]))
console.log(getPaths(tree1,1))

// Part 2
let tree2 = Object.fromEntries(input2.split(/[\r\n]+/).map((x)=>x.split(/[:,]/)).map((x)=>[x[0],x.slice(1)]))
console.log(getPaths(tree2,2))

// Part 3
let tree3 = Object.fromEntries(input3.split(/[\r\n]+/).map((x)=>x.split(/[:,]/)).map((x)=>[x[0],x.slice(1)]))
console.log(getPaths(tree3,3))