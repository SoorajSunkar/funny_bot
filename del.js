const fs  = require("fs");

var files = fs.readdirSync('C://music');
let musicArr = [];
let isContain  = true;
for(let a = 0;a<files.length;a++){
    if(musicArr.length==0){
        musicArr.push(files[a]);
    }
    else{
        for(let a =0;a<musicArr.length;a++){
            if(musicArr[a]==files[a]){
                try{
                    fs.unlinkSync(`C://music//${files[a]}`);
                }
                catch(err){
                    console.log('not able to delete ',files[a])
                }
            }
            else{
                isContain =false;
            }
        }
        if(isContain==false){
            musicArr.unshift(`${files[a]}`)
        }
    }
    // console.log(files[a]);
}


