const fs = require("fs");
function defComp(a, b){ 
    return a > b ? 1 : -1;
}

/*
* stringify but with key in the same order this way we can compare object
*/
function stringify(obj, indent = "\n"){
    let s = ``;  
    // for primitive type use the native stringify function
    if(!(obj instanceof Object)) return JSON.stringify(obj);

    // for arrays sort to have element in the same order
    if(obj instanceof Array){
        const myArray = []
        obj.forEach(function(elm, i) {
            myArray.push(indent + "    " + stringify(elm, indent + "    "));
        });
        myArray.sort((a, b) => a > b ? 1 : -1);
        
        s += `[` + myArray.join(",") + `${indent}]`;
    }else{
        // for other objects stringify to have keys in the same order
        s += `${indent}{`
        Object.keys(obj).sort(defComp).forEach(function(key){
            s += `${indent + "    "}"${key}": ${stringify(obj[key], indent + "    ")},`;
        });
        s+= `${indent}}`;
    }
    return s 
}

function bMinuA(a, b){
    let aSet = new Set(a);
    return b.filter(function(b2){
        return !aSet.has(b2);
    });
}

function getKeyForDoc(doc) {
    return doc._id;
}
function orderArticles(a, b) {
    return getKeyForDoc(a) > getKeyForDoc(b) ? 1 : -1;
}

function filterWhatCanNotBeCompared(doc){
    return doc;
}
function compare(articlesNode, articlesRuby) {
    var a = articlesNode.map(a => a._id);
    var b = articlesRuby.map(a => a._id);
    let ruby_minus_node = bMinuA(a, b); //135 111 26
    let node_minus_ruby = bMinuA(b, a); //53 59 429
    const toDebug = 21;
    const nonEnglish = ["5d8a14ec4672a9451e7710de","5d8a14e34672a9451e770fab"]
    ruby_minus_node = ruby_minus_node.filter(function(id){
        if(nonEnglish.indexOf(id) >= 0){
            console.error("we only considere english for this test")
            return false;
        }
        if(["5d8a14414672a9451e76fb6c"].indexOf(id) >= 0){
            console.log("the project is inactive so it is normal node don't percolate it");
            return false
        }
        if(["5d8a14424672a9451e76fb8f"].indexOf(id) >= 0){
            console.log("I don't understand why ruby match this document");
            return false
        }
        if(["5d8a14df4672a9451e770f3a"].indexOf(id) >= 0){
            console.log("I don't understand why ruby match this document, it is written Retail AND health but there is only health");
            return false
        }
        if(["5d8a14e64672a9451e77100c"].indexOf(id) >= 0){
            console.log(`Node transform NOT into "AND NOT" while Ruby were ignoring the NOT if there is not and before`);
            return false
        }
        return true
    })
    if(ruby_minus_node.length || node_minus_ruby.length) {
        if(ruby_minus_node.indexOf("5d8a143a4672a9451e76fa8e") >= 0){
            console.error("this article has a dash after the state but it should still match queries that don't have dash")
        }
        if(ruby_minus_node.indexOf("5d8a14414672a9451e76fb74") >= 0){
            console.error("this article has ANDNOT without space so football still match because it should have been AND NOT to not match")
        }
        if(ruby_minus_node.indexOf("5d8a14424672a9451e76fb8e") >= 0){
            console.error("this article has ANDNOT without space so football still match because it should have been AND NOT to not match")
        }
        console.error("ruby_minus_node", ruby_minus_node);
        console.error("node_minus_ruby", node_minus_ruby);
        console.error("some articles are not in both queue");
        console.log("the first article in ruby that is not in node is ", articlesRuby.find(function(art, i){

            if(art._id == ruby_minus_node[toDebug]){
                console.log(art.relevancy[0].hits[0]);
                return true;
            }
        }))
        let idToNode = {}
        for(let artNode of articlesNode){
            idToNode[artNode._id] = artNode;
        }
        // console.log("the first article in node that is not in ruby is ")
        const words = {};
        // node_minus_ruby.forEach(function name(id, lll) {
        //     const words2 = {}
        //     const art = idToNode[id];
        //     if(art.article_language == "en"){
        //         if(["5d8a148d4672a9451e770480","5d8a14ec4672a9451e7710d5","5d8a146d4672a9451e77006b"].indexOf(id) > 0) return;
        //         art.relevancy.forEach(function name(rel) {
        //             // if(rel.hits.indexOf("and") < 0 && rel.hits.indexOf("at") < 0 && rel.hits.indexOf("to") && rel.hits.indexOf("ARCADIA") < 0){
        //             //     if(rel.hits.indexOf("Trump") < 0 && rel.hits.indexOf("SOCCER") < 0){
        //             //         console.log("test")
        //             //         // debugger;
        //             //     }
        //             // }
        //             rel.hits.forEach(function(hit, j){
        //                 // if(["FDA","food","reveal","media","coverage", "WeChat","memory","Microsoft", "不合","回收","污染", "ice", "recall", "additives","格","记","忆","II"].indexOf(hit) <= 0){
        //                 //     console.log("match", rel, art,id)
        //                 // };
        //                 if(hit == "food"){
        //                     console.log("match", rel, art,id, lll)
        //                 }
        //                 words2[hit] =  1 + (words2[hit] || 0)
        //             })
        //             console.log("-9--")
        //             // console.log(rel.hits[0]);
        //         })
        //     }
        //     Object.keys(words2).forEach(function name(word) {
        //         words[word] =  1 + (words[word] || 0)
        //     })
        // })
        console.log(Object.entries(words).sort((a, b) => b[1] - a[1]));
        debugger;
    } 
    // articlesNode and B are supposed to have the same length here except if one artiles if twice in the array
    if(articlesNode.length != articlesRuby.length) {
        console.error("should be the same size");
        debugger;
    }
    articlesNode.sort(orderArticles);
    articlesRuby.sort(orderArticles);
    let nbSucceed = 0;
    for(let i = 0; i < articlesNode.length; ++i) {
        const strA = stringify(filterWhatCanNotBeCompared(articlesNode[i]));
        const strB = stringify(filterWhatCanNotBeCompared(articlesRuby[i]));
        if(!strA.length || !strB.length){
            console.error("problem while stringify");
            debugger;
        }
        
        if(strA != strB){
            console.error("strA and strB are different");
            console.error("strA = " + strA);
            console.error("strB = " + strB);
            debugger;
        }else{
            ++nbSucceed;
        };
    }
    if(!nbSucceed || nbSucceed < articlesNode.length){
        console.error("no success", nbSucceed, articlesNode.length);
        debugger;
    }
    console.log("finished");
}

const strNode = fs.readFileSync("./articlesNode.json");
const strRuby = fs.readFileSync("./articlesRuby.json");
const articlesNode = JSON.parse(strNode);
const articlesRuby = JSON.parse(strRuby);

compare(articlesNode, articlesRuby);