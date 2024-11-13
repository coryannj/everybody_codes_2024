const { dir } = require('console');
const fs = require('fs');
const input1 = fs.readFileSync('../quest7_1.txt',{ encoding: 'utf8', flag: 'r' });
const input2 = fs.readFileSync('../quest7_2.txt',{ encoding: 'utf8', flag: 'r' });
const input3 = fs.readFileSync('../quest7_3.txt',{ encoding: 'utf8', flag: 'r' });
const input4 = fs.readFileSync('../quest7_2r.txt',{ encoding: 'utf8', flag: 'r' });
const input5 = fs.readFileSync('../quest7_3r.txt',{ encoding: 'utf8', flag: 'r' });
const subs = {'=':0,'-':-1,'+':1}

// Shamelessly taken from https://stackoverflow.com/a/37580979
function* permute(permutation) {
    let cache = {}
    var length = permutation.length,
        c = Array(length).fill(0),
        i = 1, k, p;
  
    //yield permutation.slice();
    while (i < length) {
      if (c[i] < i) {
        k = i % 2 && c[i];
        p = permutation[i];
        permutation[i] = permutation[k];
        permutation[k] = p;
        ++c[i];
        i = 1;

        if(!cache[permutation.slice().join('|')]){
            cache[permutation.slice().join('|')]=true
            yield permutation.slice();
        }
      } else {
        c[i] = 0;
        ++i;
      }
    }
}

// Part 1
console.log(input1.split(/[\r\n]+/).map((x)=>x.split(/[,:]/).map((y,yx)=> yx === 0 ? y : subs[y])).map((x)=>[x[0],x.slice(1).concat(x.slice(1,(10-x.slice(1).length))).map((sum = 10, n => sum += n)).reduce((acc,curr)=>acc+curr)]).sort((a,b)=>b[1]-a[1]).map((x)=>x[0]).join('')) // Part 1 answer

// Part 2
let loops2 = 10;
let chariots2 = input2.split(/[\r\n]+/).map((x)=>x.split(/[,:]/).map((y,yx)=> yx === 0 ? y : subs[y])).map((x)=>[x[0],x.slice(1)]);
let cLen = chariots2[0][1].length;

let parseTrack2 = input4.replace('S','=').split(/[\r\n]+/).map((x)=>x.replaceAll(/[\s]+/g,'').split(''));

let racetrack2 = parseTrack2[0].slice(1).concat(parseTrack2.slice(1,-1).flatMap((x)=>x[1]),parseTrack2.at(-1).reverse(),parseTrack2.slice(1,-1).flatMap((x)=>x[0]).reverse(),parseTrack2[0][0]).map((x)=>subs[x]);

console.log(Array(chariots2.length).fill('.').map((x,ix)=>Array(loops2).fill('.').map((y)=>racetrack2.slice()).flat()).map((x,ix)=>x.map((y,yx)=>y !== 0 ? y : chariots2[ix][1][yx%cLen]).map((sum = 10, n => sum += n)).reduce((acc,curr)=>acc+curr)).map((x,ix)=>[chariots2[ix][0],x]).sort((a,b)=>b[1]-a[1]).map((x)=>x[0]).join('')) // Part 2 answer

// Part 3
let loops3 = 2024
//let loops3 = 11 // Will work with 11 loops only, perf goes from 22s -> 10s ¯\_(ツ)_/¯
let rival = input3.slice(2).split(',').map((x)=>subs[x])
let planLen = rival.length

let parseTrack3 = input5.replace('S','=').split(/[\r\n]+/).map((x)=>x.split(''));
let pRow = parseTrack3.length;
let pCol = parseTrack3[0].length;
let coOrd = [last,r,c] = ['0-0',0,1]
let racetrack3 = [subs[parseTrack3[r][c]]]

const checkrc = ([row,col]) => row >= 0 && row < pRow && col >= 0 && col < pCol && `${row}-${col}` !== last && parseTrack3[row][col]!==' ' && parseTrack3[row][col]!==undefined

while (`${r}-${c}`!=='0-0'){    
    let next = [[r,c+1],[r,c-1],[r-1,c],[r+1,c]];
    coOrd = [last,r,c] = [`${r}-${c}`].concat(next.find((x)=>checkrc(x)));
    racetrack3.push(subs[parseTrack3[r][c]]);
}

let allLoops = Array(loops3).fill('.').map((y)=>racetrack3.slice()).flat()

let rivalscore = allLoops.map((x,ix)=> x !== 0 ? x : rival[ix%planLen]).map((sum = 10, n => sum += n)).reduce((acc,curr)=>acc+curr);

let higher = 0
let perm = permute(rival);
let t = perm.next();

do {
    let thisScore = 0
    let currScore = 10
    let j = 0
    let k = allLoops.length
    while(k--){
        currScore += allLoops[j] !== 0 ? allLoops[j] : t.value[j%planLen]
        thisScore += currScore
        j++
    }

    if(thisScore>rivalscore) higher++
    
    t = perm.next()

} while(!t.done)

console.log(higher)