const fs = require("fs");
const request = require("request");
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


projectWithWeirdSpace = [143,165,207,257,348,355,367,429,477,478,512,546,594,609,612,620,624,656,681,715,767,872,920,923,932,934,984,1021,1049,1092,1179,1245,1270,1284,1395,1409,1412,1445,1449,1462,1474,1484,1511,1523,1542,1544,1578,1604,1632,1640,1660,1665,1722,1729,1734,1742,1744,1750,1825,1834,2159,2628,2716,2871,2938,3092,3097,3195,3227,3228,3491,3522,3605,3694,3781,3979,4045,4167,4170,4220,4259,4263,4272,4273,4436,4498,5045,5191,5204,5654,5729,5940,6006,6007,6009,6012,6221,6237,6358,6639,6647,6680,6871,7188,7258,7289,7414,7479,7509,7593,7619,7629,7711,7882,7886,7904,7920,7970,7990,7991,8140,8141,8144,8195,8211,8255,8258,8287,8375,8377,8392,8400,8436,8446,8448,8499,8688,8718,8791,8792,8794,8881,8936,8937,8956,9016,9157,9199,9241,9308,9318,9320,9375,9378,9394,9399,9443,9470,9482,9524,9716,9733,9773,9781,9787,9812,9866,9879,9884,9886,9901,9906,9941,9958,9962,9964,9979,9980,10016,10087,10091,10094,10131,10174,10203,10243,10270,10377,10461,10510,10799,10800,10819,10839,10852,10869,10911,10912,10913,10933,10942,10964,11012,11014,11037,11038,11047,11048,11050,11115,11228,11285,11324,11329,11337,11404,11550,11553,11619,11624,11651,11657,11811,11821,11844,11845,12198,12201,12203,12204,12215,12300,12321,12467,12522,12547,12549,12564,12565,12599,12609,12614,12630,12636,12686,12690,12691,12694,12695,12729,12747,12749,12783,12796,12813]
projinpast = [9418
    ,12811
    ,7269
    ,10387
    ,6602
    ,6603
    ,6581
    ,6580
    ,10931
    ,9328
    ,370
    ,3967
    ,12798
    ,12782
    ,6749
    ,12783
    ,12767
    ,1158
    ,1562
    ,12752
    ,12750
    ,3012
    ,5877
    ,2958
    ,6254
    ,6255
    ,998
    ,7773
    ,7911
    ,235
    ,6664
    ,5653
    ,1065
    ,11625
    ,5662
    ,10232
    ,5665
    ,5656
    ,5664
    ,7531
    ,10972
    ,8196
    ,9504
    ,118
    ,11563
    ,497
    ,6253
    ,6259
    ,9093
    ,10233
    ,6258
    ,9304
    ,472
    ,9095
    ,10531
    ,9326
    ,1064
    ,1412
    ,10436
    ,10435
    ,8233
    ,7111
    ,9536
    ,9483
    ,9270
    ,9077
    ,9094
    ,372
    ,377
    ,9984
    ,8898
    ,8899
    ,8901
    ,9017
    ,8966
    ,9088
    ,10987
    ,2836
    ,9381
    ,2838
    ,2837
    ,2960
    ,10827
    ,10422
    ,10421
    ,10420
    ,1529
    ,7914
    ,4498
    ,12613
    ,3492
    ,3491
    ,2010
    ,1092
    ,1772
    ,6257
    ,6256
    ,8201
    ,8199
    ,1101,
    8197, 12809]

const weirdQuote = [12583];
const spaceAtTheEnd = [10016, 6006, 5281];
const ignoreTheNot = [...weirdQuote, ...spaceAtTheEnd, /*11143*/,11338,11628, 12663, 11142];
const rubyInventMatch = [10471]
// const smallOr = [12592];
projBroken = new Set([...projectWithWeirdSpace,...ignoreTheNot,...rubyInventMatch, ...projinpast,9021/* Not not working*/, 10870 /* space*/,11746, 9308, 6012, 7414/*sergio test*/,8718, 4737/* for a misterious reason it breaks ruby*/, 9217, 8901/* end date in the past*/,1092/*same*/]);
function filterWhatCanNotBeCompared(doc){
    let jso = JSON.parse(JSON.stringify(doc));
    delete jso.debug;
    delete jso.tags;
    delete jso.pipeline_updated_at
    if(jso.relevancy){
        jso.relevancy.forEach(function(relevancy , i) {
            delete relevancy.search_id;
            if(projBroken.has(relevancy.project_id)){
                jso.relevancy[i] = null
            }else{
                relevancy.hits.forEach(function(hit, j){
                    relevancy.hits[j] = hit.toLowerCase();
                })
                relevancy.hits = relevancy.hits.filter(a => a != "or")
            }
        })
        jso.relevancy = jso.relevancy.filter(a => a)
    }
    jso.projects = jso.projects && jso.projects.filter(id => !projBroken.has(id))
    return jso;
}
function compare(articlesNode, articlesRuby) {
    var a = articlesNode.map(a => a._id);
    var b = articlesRuby.map(a => a._id);
    let ruby_minus_node = bMinuA(a, b); //135 111 26
    let node_minus_ruby = bMinuA(b, a); //53 59 429
    const toDebug = 0;
    // const nonEnglish = ["5d8a14424672a9451e76fb81","5d8a14704672a9451e7700c2","5d8a14674672a9451e76ffb5","5d8a14454672a9451e76fbf4","5d8a14504672a9451e76fd3b","5d8a14734672a9451e77012f", "5d8a147a4672a9451e77020a","5d8a14ab4672a9451e77086d","5d8a14a74672a9451e7707e0","5d8a14ec4672a9451e7710de","5d8a14e34672a9451e770fab","5d8a14c94672a9451e770c47","5d8a14c84672a9451e770c2e","5d8a14bc4672a9451e770a92"]
    ruby_minus_node = ruby_minus_node.filter(function(id){
        // if(nonEnglish.indexOf(id) >= 0){
        //     console.error("we only considere english for this test")
        //     return false;
        // }

        if(["5d8a14504672a9451e76fd3b","5d8a14454672a9451e76fbf4","5d8a14a74672a9451e7707e0", "5d8a14ab4672a9451e77086d","5d8a14bc4672a9451e770a92", "5d8a14c84672a9451e770c2e","5d8a14c94672a9451e770c47","5d8a14e34672a9451e770fab", "5d8a14ec4672a9451e7710de"].indexOf(id) >= 0) {
            // search 26903
            // الصحةsearch 19509, project 9308
            // project 10510 search الکترونیک ,23233 
            console.log("there is a space at the end of the query which create the bug in ruby that will match bad document");
            return false
        }
        if(["5d8a14424672a9451e76fb95"].indexOf(id) >= 0) {// project 12583 search 27783 state
            console.log("the quote should be a normal quote");
            return false
        }
        if(["5d8a14414672a9451e76fb6c"].indexOf(id) >= 0) {
            console.log("the project is inactive so it is normal node don't percolate it");
            return false
        }
        if(["5d8a14424672a9451e76fb8f", "5d8a14b94672a9451e770a3f"].indexOf(id) >= 0) {
            console.log("I don't understand why ruby match this document");
            return false
        }
        if(["5d8a14df4672a9451e770f3a"].indexOf(id) >= 0) {
            console.log("it is written Retail AND health but there is only health, but there is the character U+A0 that break the query for ruby on the project 6012");
            return false
        }
        if(["5d8a14b74672a9451e7709f7","5d8a14b94672a9451e770a31","5d8a14c04672a9451e770b21","5d8a14dd4672a9451e770eed","5d8a14dd4672a9451e770ee4","5d8a14dc4672a9451e770ecf","5d8a14dc4672a9451e770ec2","5d8a14db4672a9451e770e9a"].indexOf(id) >= 0){
            console.log("invisible character like 5d8a14df4672a9451e770f3a");
            return false
        }
        if(["5d8a14e64672a9451e77100c"].indexOf(id) >= 0) {
            console.log(`Node transform NOT into "AND NOT" while Ruby were ignoring the NOT if there is not and before`);
            return false
        }
        if(["5d8a14704672a9451e7700c2"].indexOf(id) >= 0) {
            console.log(`There is a space at the end in ruby that create match that sould not exist`);
            return false
        }
        if(["5d8a14464672a9451e76fc14"].indexOf(id) >= 0) {
            console.log(`There is or that is not interpreted as a keyword`);
            return false
        }
        return true
    })
    if(ruby_minus_node.length || node_minus_ruby.length) {
        if(ruby_minus_node.indexOf("5d8a143a4672a9451e76fa8e") >= 0) {
            console.error("this article has a dash after the state but it should still match queries that don't have dash")
        }
        if(ruby_minus_node.indexOf("5d8a14414672a9451e76fb74") >= 0) {
            console.error("this article has ANDNOT without space so football still match because it should have been AND NOT to not match")
        }
        if(ruby_minus_node.indexOf("5d8a14424672a9451e76fb8e") >= 0) {
            console.error("this article has ANDNOT without space so football still match because it should have been AND NOT to not match")
        }

        console.error("ruby_minus_node", ruby_minus_node); // 20 with standard analyser for chinese, 19 after put standard instead of chinese  17, 2
        console.error("node_minus_ruby", node_minus_ruby); // 438, 468 454 164
        console.error("some articles are not in both queue");

//         "污"
// 1:"染"
// 2:"不"
// 3:"合"
// 4:"格"

        console.log("the first article in ruby that is not in node is ", articlesRuby.find(function(art, i){

            if(art._id == ruby_minus_node[toDebug + 1]){
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
        node_minus_ruby.forEach(function name(id, lll) {
            const words2 = {}
            const art = idToNode[id];
            // if(art.article_language == "en"){
                if(["5d8a148d4672a9451e770480","5d8a14ec4672a9451e7710d5","5d8a146d4672a9451e77006b"].indexOf(id) > 0) return;
                art.relevancy.forEach(function name(rel) {
                    // if(rel.hits.indexOf("and") < 0 && rel.hits.indexOf("at") < 0 && rel.hits.indexOf("to") && rel.hits.indexOf("ARCADIA") < 0){
                    //     if(rel.hits.indexOf("Trump") < 0 && rel.hits.indexOf("SOCCER") < 0){
                    //         console.log("test")
                    //         // debugger;
                    //     }
                    // }
                    rel.hits.forEach(function(hit, j){
                        // if(["FDA","food","reveal","media","coverage", "WeChat","memory","Microsoft", "不合","回收","污染", "ice", "recall", "additives","格","记","忆","II"].indexOf(hit) <= 0){
                        //     console.log("match", rel, art,id)
                        // };
                        // if(hit == "food"){
                        //     console.log("match", rel, art,id, lll)
                        // }
                        words2[hit] =  1 + (words2[hit] || 0)
                    })
                    console.log("-9--")
                    // console.log(rel.hits[0]);
                })
            // }
            Object.keys(words2).forEach(function name(word) {
                words[word] =  1 + (words[word] || 0)
            })
        })
        console.log(Object.entries(words).sort((a, b) => b[1] - a[1]));
        // debugger;
    }

    nodeKeys = new Set();
    articlesNode.sort(orderArticles);
    articlesRuby.sort(orderArticles);
    const nodeProject = {};
    const relevancyNode = {};
    articlesNode.forEach(function(aNode){
        const id = aNode._id;
        aNode.projects.forEach(function (proj) {
            nodeProject[proj] = nodeProject[proj] || [];
            nodeProject[proj].push(id);
        })
        if(["5d8a143b4672a9451e76fab4"].indexOf(id) >= 0){
            console.log("goodman missing");
        }
        aNode.relevancy.forEach(function name(rel) {
            rel.hits.forEach(function(hit){
                hit = hit.toLowerCase();
                // if(hit == "typhoon"){  //there is also Eurofighter so it it normal it match
                //     console.log("typhoon", aNode, rel);
                // }
                relevancyNode[hit] = relevancyNode[hit] || [];
                relevancyNode[hit].push(id);
            })
        })
    })


    const rubyProject = {}

    const relevancyRuby = {};
    articlesRuby.forEach(function(aRuby){
        const id = aRuby._id;
        if(["5d8a14414672a9451e76fb6c"].indexOf(id) >= 0){
            console.log("the project is inactive so it is normal node don't percolate it");
            return false;
        }
        if(["5d8a14424672a9451e76fb8f", "5d8a14b94672a9451e770a3f"].indexOf(id) >= 0){
            console.log("I don't understand why ruby match this document");
            return false;
        }
        if(["5d8a14df4672a9451e770f3a"].indexOf(id) >= 0){
            console.log("it is written Retail AND health but there is only health, but there is the character U+A0 that break the query for ruby on the project 6012");
            return false;
        }
        if(["5d8a14b74672a9451e7709f7","5d8a14b94672a9451e770a31","5d8a14c04672a9451e770b21","5d8a14dd4672a9451e770eed","5d8a14dd4672a9451e770ee4","5d8a14dc4672a9451e770ecf","5d8a14dc4672a9451e770ec2","5d8a14db4672a9451e770e9a"].indexOf(id) >= 0) {
            console.log("invisible character like 5d8a14df4672a9451e770f3a");
            return false;
        }
        if(["5d8a14e64672a9451e77100c"].indexOf(id) >= 0) {
            console.log(`Node transform NOT into "AND NOT" while Ruby were ignoring the NOT if there is not and before`);
            return false;
        }
        // let key = aRuby.projects.sort((a, b) => a > b ? 1 : -1).join("-->");
        // rubyKey.add(id + "@" + key);
        aRuby.projects.forEach(function (proj) {
            rubyProject[proj] = rubyProject[proj] || [];
            rubyProject[proj].push(id);
        })

        aRuby.relevancy.forEach(function name(rel) {
            rel.hits.forEach(function(hit){
                hit = hit.toLowerCase()
                relevancyRuby[hit] = relevancyRuby[hit] || [];
                // if(hit == "natural"){ same with [ "save"] // the project 7414 with the search 27981 has a wrong number of parenthesis, and create a behavior where each word of the request is interpreted a match even if inside double quote and the NOT condition is transforming to a OR
                //     console.log("natural", aRuby);
                // }

                // if(hit == "pets"){  too big request to understand the problem, pets and dogs are in not so ruby do strange things
                //     console.log("pets", aRuby, rel);
                // }

                // if(hit == "job"){  // same for "ready", "insights", human, robotic, integrated  of search 18847 for project 9021 there is PRNewswire in the not so it is normal the article is exclude
                //     console.log("job", aRuby, rel);
                // }
                // if(hit == "delta"){  // there is absolutely no reason that delta can be a hit because it is in the exclude http://localhost:3005/clients/992/projects/12663/searches
                //     console.log("delta", aRuby, rel);
                // }
                // if(hit == "بطاقة"){
                //     console.log("بطاقة", aRuby, rel);
                // }
               
               


                // if(hit == "science"){ // same for mining too many request possible to understand the problem
                //     console.log("science", aRuby);
                // }
                relevancyRuby[hit.toLowerCase()].push(id);
            })
        })
    })


    const hasBeenManuallyValidate = new Set(["natural", "job", "ready", "insights", "human", "robotic", "integrated", "delta", "science"]);
    const diffsRubyLessNode = [];
    const diffsNodeLessRuby = [];
    Object.entries(rubyProject).forEach(function([key, value]){
        if(!nodeProject[key]){
            diffsNodeLessRuby.push(key)
            // console.log("the project ", key, " is not in node");
        }
    })
    Object.entries(rubyProject).forEach(function([key, value]){
        if(!nodeProject[key]){
            diffsRubyLessNode.push(key)
            // console.log("the project ", key, " is not in node");
        }
    })

    let diffsRubyLessNodeRelevancy = [];
    Object.entries(relevancyRuby).forEach(function([key, value]){
        if(!relevancyNode[key]){
            diffsRubyLessNodeRelevancy.push(key);
            console.log("the keyword ", key, " is not in node");
        }
    })
    let diffsNodeLessRubyRelevancy = [];
    Object.entries(relevancyNode).forEach(function([key, value]){
        if(!relevancyRuby[key]){
            diffsNodeLessRubyRelevancy.push(key);
            console.log("the keyword ", key, " is not in node");
        }
    })
    diffsRubyLessNodeRelevancy = diffsRubyLessNodeRelevancy.filter((hit) => !hasBeenManuallyValidate.has(hit));
    console.log("diffs ruby rel - node rel are ", diffsNodeLessRubyRelevancy); // 668 409 129 157 141 127(by replacing all space and not the #)
    console.log("diffs node rel - ruby rlet diffsRubyLessNodeRelevancy", diffsRubyLessNodeRelevancy); // 332 622 99 78 121(if we replace xa0) 134 126 99 after filter



    // articlesNode and B are supposed to have the same length here except if one artiles if twice in the array
    if(articlesNode.length != articlesRuby.length) {
        console.error("should be the same size");
        // debugger;
    }

 

    
    const hashToArti = {}// {[hash]:{ruby: artiRuby, node: artiNode}}
    for(let i = 0; i < articlesNode.length; ++i) {
        const strA = stringify(filterWhatCanNotBeCompared(articlesNode[i]));
        hashToArti[articlesNode[i]._id] = {node: strA, nodeObj: articlesNode[i] };
    }

    for(let i = 0; i < articlesRuby.length; ++i) {
        const strA = stringify(filterWhatCanNotBeCompared(articlesRuby[i]));
        if(hashToArti[articlesRuby[i]._id]){
            hashToArti[articlesRuby[i]._id].ruby = strA;
            hashToArti[articlesRuby[i]._id].rubyObj = articlesRuby[i];
        }
    }

    tags:{
        tagSetNode = new Set();
        for(let i = 0; i < articlesNode.length; ++i) {
            const arti = articlesNode[i];
            if(arti.tags) {
                arti.tags.forEach(function(tag){
                    // so if the search has succeed for both node and ruby add the tag
                    if(hashToArti[arti._id].rubyObj && hashToArti[arti._id].rubyObj.projects.indexOf(tag.project_id) >= 0){
                        tagSetNode.add(/*articlesNode[i]._id + "___" + */tag.name/* + "__" + tag.project_id*/);
                    }
                });
            }
        }
        tagSetRuby = new Set();
        for(let i = 0; i < articlesRuby.length; ++i) {
            const arti = articlesRuby[i];
            if(arti.tags) {
                arti.tags.forEach(function(tag) {
                    if(hashToArti[arti._id] && hashToArti[arti._id].nodeObj.projects.indexOf(tag.project_id) >= 0){
                        // if(tag.name == "Panhandle State Rodeo") { // project 12583 and 10536
                        //     return;// normal because there is weird quote “that break the request
                        //     console.log("Panhandle State Rodeo", arti, tag);7508
                        // }
                        if(tag.name == "Children Nutrition Research Fund") { // project 
                            console.log("no idea why ruby match here", arti, tag);
                        }
                        if(tag.name == " JMA Wireless") { // project 7904 there is a space at the begining of the query
                            console.log("no idea why ruby match here", arti, tag);
                        }
                        tagSetRuby.add(/*articlesRuby[i]._id + "___" + */tag.name/* + "__" + tag.project_id */);
                    }
                });
            }
        }

        rubyLessNode = bMinuA([...tagSetNode], [...tagSetRuby]);//420
        nodeLessRuby = bMinuA([...tagSetRuby], [...tagSetNode]);//180

        console.log("diff");
    }

    // keep article that are present in both ruby and node and sort to have first the smaller
    const artiNodeRuby = Object.values(hashToArti).filter(function(a){
        return !!(a.node && a.ruby);
    }).sort(function(a, b){
        return a.node.length + a.ruby.length - b.node.length - b.ruby.length;
    });

    let iij = 0;
    let cont = 0;
    const toCheck = [];
    for(let arti of artiNodeRuby){
        const _a = arti.node, _b = arti.ruby;
        // 10995 space at the end of request
        if(arti.ruby.length == arti.node.length){
            ++iij
        }
        if(arti.ruby != arti.node){
            //
        }
        if(arti.ruby.length > arti.node.length){
            ++iij;
            if(arti.ruby.indexOf(11143) >= 0){
                console.log("11443");
            }
            if(arti.nodeObj._id == "5d8a148c4672a9451e77045d") {
                console.log("node is right there is shell in the headline");
                cont++;continue;
            }
            if(["5d8a14a34672a9451e77074b", "5d8a144a4672a9451e76fc96"].indexOf(arti.nodeObj._id) >= 0) {
                console.log("twice the same tag is not a big deal");
                cont++;continue;
            }
            if(["5d8a14d84672a9451e770e38"].indexOf(arti.nodeObj._id) >= 0) {
                console.log("there is not reason to have villeroy as hit even with the *");
                cont++;continue;
            }
            if(["5d8a14414672a9451e76fb74", "5d8a14524672a9451e76fd76","5d8a14884672a9451e7703cd", "5d8a14d24672a9451e770d6c"].indexOf(arti.nodeObj._id) >= 0) {
                console.error("reactivate the patch for and can solve this problem");
                cont++;continue;
            }

            if(["5d8a14824672a9451e770302"].indexOf(arti.nodeObj._id) >=0) {
                console.log("the article match the project 10138 and it is normal");
                cont++;continue;
            }
            if(["5d8a146a4672a9451e770005"].indexOf(arti.nodeObj._id) >=0) {
                console.log("ruby put in hit word that are in the node condition, this is not logic");
                cont++;continue;
            }
            if(["5d8a14504672a9451e76fd48", "5d8a144c4672a9451e76fce9","5d8a14fa4672a9451e7712c0","5d8a147c4672a9451e77024d"].indexOf(arti.nodeObj._id) >=0) {
                console.log("relevancy is in 2 object instead of one but it is the same");
                cont++;continue;
            }

            if(["5d8a14454672a9451e76fbfd"].indexOf(arti.nodeObj._id) >=0) {
                console.log("there is a weird quote in the query 2783 project 12583");
                cont++;continue;
            }
            if(["5d8a14404672a9451e76fb43"].indexOf(arti.nodeObj._id) >=0) {
                console.log("except the question mark it is the same");
                cont++;continue;
            }

            if(arti.node != arti.ruby) {
                toCheck.push(arti)
                console.error("not the same");
            }
        }
    }
    console.log(toCheck);
    console.log(artiNodeRuby);


    // function extractWord(obj){
    //     let str = obj
    //     if(obj instanceof Object){
    //         str = JSON.stringify(obj)
    //     }
    //     var re = /\s*([^[:]+):\"([^"]+)"/g;
    //     var m;
    //     while (m = re.exec(s)) {
    //     console.log(m[1], m[2]);
    //     }
    // }

    // let nbSucceed = 0;
    // for(let i = 0; i < articlesNode.length; ++i) {
    //     const strA = stringify(filterWhatCanNotBeCompared(articlesNode[i]));
    //     const strB = stringify(filterWhatCanNotBeCompared(articlesRuby[i]));
    //     if(!strA.length || !strB.length){
    //         console.error("problem while stringify");
    //         debugger;
    //     }
        
    //     if(strA != strB){
    //         console.error("strA and strB are different");
    //         console.error("strA = " + strA);
    //         console.error("strB = " + strB);
    //         debugger;
    //     }else{
    //         ++nbSucceed;
    //     };
    // }
    // if(!nbSucceed || nbSucceed < articlesNode.length){
    //     console.error("no success", nbSucceed, articlesNode.length);
    //     debugger;
    // }
    console.log("finished");
}

const strNode = fs.readFileSync("./articlesNode.json");
const strRuby = fs.readFileSync("./articlesRuby.json");

const articlesNode = JSON.parse(strNode);
let ind = JSON.stringify(articlesNode.body.searches).indexOf("EMPOWERING")
console.log(JSON.stringify(articlesNode.body.searches).slice(ind-20, ind + 50))

request.post({
    url: "http://localhost:9292/process",
    headers: articlesNode.headers,
    json: articlesNode.body
}, function(err, res, body) {
    const error = err || body.error
    if (error) {
        console.error(error);    
    }
    console.log(body)
    const stringifyExpected = stringify({
        "10834": 
        {
            "hits": [
                "company",
                "her",
                "that",
                "the",
                "time"
            ],
        },
        "11999": 
        {
            "hits": [
                "innovation"
            ],
            "tags": [
                
                {
                    "category": "Products",
                    "name": "Innovation",
                }
            ],
        },
        "7414": 
        {
            "hits": [
                "EMPOWERING"
            ],
            "tags": [
                
                {
                    "category": "Places",
                    "name": "MANPOWER",
                }
            ],
        },
        "916": 
        {
            "hits": [
                "innovation"
            ],
            "tags": [
                
                {
                    "category": "Products",
                    "name": "Innovation",
                }
            ],
        },
        "9655": 
        {
            "hits": [
                "law"
            ],
            "tags": [
                
                {
                    "category": "Products",
                    "name": "Tobacco",
                }
            ],
        },
        "article_tags": [
            
            {
                "category": "Brand",
                "id": 1522,
            }
        ]
    })
    if(stringify(body) != stringifyExpected){
        console.error("result is different")
    }else{
        console.log("result is Ok")
    }
    debugger
});
const data = JSON.stringify(articlesNode.body);
  
// const options = {
//     hostname: "localhost",
//     port: 9292,
//     path: "/process",
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'Content-Length': data.length
//     }
// }
  
// resu = ""
// const http = require("http")
// const req = http.request(options, (res) => {
//     console.log(`statusCode: ${res.statusCode}`)
//     res.on('data', (d) => {
//         resu += d.toString("binary")
//     })
// })

// req.on('error', (error) => {
//     console.error(error)
// })

// req.on('end', () => {
//     try{
//         toto = JSON.parse(toto);
//     }catch(e){}
//     console.log(toto);
// })

// req.write(data)
// req.end()

// const articlesRuby = JSON.parse(strRuby);

// compare(articlesNode, articlesRuby);