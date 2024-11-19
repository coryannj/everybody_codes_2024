const { dir, group } = require('console');
const fs = require('fs');
const input1 = fs.readFileSync('../quest11_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest11_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest11_3.txt',{ encoding: 'utf8', flag: 'r' });

function countTermites(input,days,first,partNo){
    let lines = input.split(/[\r\n]+/).map((x)=>x.split(/[:,]/));
    let termites = Object.fromEntries(lines.map((x)=>[x[0],x.slice(1)]))
    let termiteCount = Object.fromEntries([...new Set(lines.flat())].map((x)=>[x,0]))
    termiteCount[first] = 1

    for(i=0;i<days;i++){
        let newObj = Object.fromEntries([...new Set(lines.flat())].map((x)=>[x,0]))
    
        Object.keys(termiteCount).filter((x)=>termiteCount[x]>0).forEach((x)=>{
            termites[x].forEach((y)=>{
                newObj[y]+=(termiteCount[x])
            })
        })
        termiteCount = newObj
    }

    return Object.values(termiteCount).reduce((acc,curr)=>acc+curr,0)
}

// Part 1
console.log(countTermites(input1,4,'A'))

// Part 2
console.log(countTermites(input2,10,'Z'))

// Part 3
let termiteKeys = [...new Set(input3.split(/[\r\n]+/).map((x)=>x.split(/[:,]/)).flat())]
let population = []

for(l=0;l<termiteKeys.length;l++){
    population.push(countTermites(input3,20,termiteKeys[l]))
}

population.sort((a,b)=>a-b)
console.log(population.at(-1)-population[0])