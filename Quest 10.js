const { dir, group } = require('console');
const fs = require('fs');
const input1 = fs.readFileSync('../quest10_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest10_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest10_3.txt',{ encoding: 'utf8', flag: 'r' });

const power = '.ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function getRunic(grid,partNo){
    let startRC = 2
    let endRC = 6

    let result = ''
    
    for(i=startRC;i<endRC;i++){
        for(j=startRC;j<endRC;j++){
            let row = new Set(grid[i].filter((x)=>x !== '.'));
            let col = new Set(grid.map((x)=>x[j]).filter((x)=>x !== '.'));
            let newVal = [...row.intersection(col)][0];
            result+=newVal;
        }
    }

    return partNo < 2 ? result : result.split('').map((x,ix)=>(ix+1)*power.indexOf(x)).reduce((acc,curr)=>acc+curr)
}

// Part 1
let grids1 = input1.split(/[\r\n]+/).map((x)=>x.split(''))
console.log(getRunic(grids1,1))

// Part 2
let grids2 = input2.split(/[\n]{2,}/).map((x)=>x.split(/[\r\n]+/).map((x)=>x.split(' '))).flatMap((row,rowidx,grid)=>row[0].map((y,yx,yarr)=>row.map((z)=>z[yx]))).map((x)=>x.map((y)=>y.split('')))

let grids2Len = grids2.length
let result2 = 0

for(l = 0; l < grids2Len; l++){
    result2+=getRunic(grids2[l],2)
}
console.log(result2)

// Part 3
let grids3 = input3.split(/[\r\n]+/).map((x)=>x.split(''))
let result3 = 0
let resultsArr = Array(200).fill('.').map((x)=>-1)
let lastResult3 = 0
let gridcache = {}

do{
    if(result3>0){
        lastResult3 = resultsArr.filter((x)=>x === 1).length;
    }

    let gridInd=0
    for(m=0;m<grids3.length-7;m+=6){
        for(n=0;n<grids3[0].length-7;n+=6){
            let grid = grids3.slice(m,m+8).map((x)=>x.slice(n,n+8));
            if(resultsArr[gridInd] === -1 && !gridcache[grid.join('')]){
                gridcache[grid.join('')]=true

                let toSolve = [];
                let result = '';
                let resultInd = 0;

                for(r = 2; r < 6; r++){
                    for(c = 2; c < 6; c++){
                        let row = new Set(grid[r].filter((x)=>x !== '.'));
                        let col = new Set(grid.map((x)=>x[c]).filter((x)=>x !== '.'));
                        let newVal = [...row.intersection(col)][0];
                        
                        if(newVal !== undefined){
                            grid[r][c] = newVal;
                            grids3[m+r][n+c] = newVal;
                            result+=newVal;
                        } else {
                            result+='.';
                            toSolve.push([r,c,resultInd]);
                        }
    
                        resultInd++
                    }
                }
        
                result = result.split('')
                let solveSeen = []
        
                loop1: for(t = 0; t < toSolve.length; t++){
                    let nextVal
                    let nextInd = toSolve.findIndex(([tr,tc,tix],sidx)=>{
                        if(solveSeen.includes(sidx)){
                            return false
                        } else {
                            let tRow = grid[tr]
                            let tROuter = new Set(tRow.filter((x,ix)=>(ix<2||ix>5)&& !'?.'.includes(x)))
                            let tRInner = new Set(tRow.slice(2,6).filter((x)=>x!=='.'))
        
                            let tCol = grid.map((x)=>x[tc])
                            let tCOuter = new Set(tCol.filter((x,ix)=>(ix<2||ix>5)&& !'?.'.includes(x)))
                            let tCInner = new Set(tCol.slice(2,6).filter((x)=>x!=='.'))
        
                            if([...tROuter.difference(tRInner)].length+[...tCOuter.difference(tCInner)].length === 1){
                                nextVal = [...tROuter.difference(tRInner)][0]||[...tCOuter.difference(tCInner)][0]
                                return true
                            } else {
                                return false
                            }
                        }
                    })
                    
                    if(nextInd === -1){
                        break loop1
                    } else {
                        solveSeen.push(nextInd);
                        let [nr,nc,nt] = toSolve[nextInd];
                        grid[nr][nc] = nextVal;
                        grids3[m+nr][n+nc] = nextVal;
                        result[nt] = nextVal;
        
                        if(grid[nr].includes('?')){
                            let cqInd = grid[nr].indexOf('?')
                            grids3[m+nr][n+cqInd] = nextVal
                        } else {
                            let rqInd = grid.map((x)=>x[nc]).indexOf('?')
                            grids3[m+rqInd][n+nc] = nextVal
                        }
                    }
                }
        
                if(!result.includes('.')){
                    result3 += result.map((x,ix)=>(ix+1)*power.indexOf(x)).reduce((acc,curr)=>acc+curr)    
                    resultsArr[gridInd] = 1
                }
            }
            gridInd++    
        }

    }

} while (lastResult3 !== resultsArr.filter((x)=>x === 1).length)

console.log(result3)