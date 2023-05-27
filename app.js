const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '6150618949:AAGQmGYX7OR86XmInSW54onFfuorVtPHPmg';
let fileCouont = 1;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
const  fs  = require('fs');
const { clearInterval } = require('timers');
let data = JSON.parse(fs.readFileSync('data','utf-8'));
let videoRunner = false;

// bot.sendMessage(5928167552,'hi',{
//   reply_markup:{
//     inline_keyboard:[[{text:'hello',callback_data:'3'}]]
//   }
// })

bot.on('new_chat_members',(msg)=>{
  console.log('O kf')
  let gpId = JSON.parse(fs.readFileSync('gpIds','utf-8'));
  console.log(gpId);
  let check = msg.chat.id;
  console.log(check)
  let isContain = false;
  for(let a =0;a<gpId.length;a++){
    if(gpId[a]==check){
      isContain = true;
    }
  }
  if(isContain==false){
    gpId.push(check)
    fs.writeFileSync('gpIds',JSON.stringify(gpId));
    // console.log(msg)
    try{
      bot.sendMessage(5884218525,`A new gp add me @${msg.chat.username}`)
    }
    catch(err){
      bot.sendMessage(5884218525,`A new gp added ${msg.chat.title}\n ${msg.chat.id}`)
    }
  }
  
})

let clear;
bot.on("message",(msg)=>{
  if(videoRunner==false){
    // videoAdder(msg,false);
  }
  else{
    videoAdder(msg,true)
  }

  if(msg.text=='startVideo'){
    let gpId = JSON.parse(fs.readFileSync('gpIds','utf-8'));
    
    gpId.forEach(ele => {
      main(ele,true);
      });
    clear = setInterval(()=>{
        gpId.forEach(ele => {
        main(ele,true);
        });
      },1000*600)
  }
  else if(msg.text=='stopVideo'){
    console.log('hi');
    console.log(clear);
    // clearInterval(clearInterval);
    clearInterval(clear)
  }

  else if(msg.text=="/upload"){
    try{
      bot.sendMessage(msg.chat.id,'Now you can forward any message that should be a video,photo or gif and I will save it.')
      videoRunner=true;
    }
    catch(err){
      console.log(err)
    }
  }
  else if(msg.text=='/stop'){
    bot.sendMessage(msg.chat.id,'forward off!')
    videoRunner = false;
  }

})

bot.on("callback_query",(msg)=>{
  console.log(msg)
  let messageId = msg.message.message_id;
  let chatId = msg.from.id;
  let message = msg.data;

  let [fileName,data] = message.split('-')
  
  let mainData = JSON.parse(fs.readFileSync(`./like/${fileName}`,'utf-8'));
  let likedUserId = mainData.user;
  let isContain = false;
  for(let a =0;a<likedUserId.length;a++){
    if(likedUserId[a]==chatId){
      isContain=true;
      console.log('we are geeting')
      break;
    } 
  }

  if(isContain==false){
    let pressButton = mainData[`${data}`]
    pressButton++;
    mainData[`${data}`]=pressButton;
    mainData.user.unshift(chatId);
    console.log(mainData);

    bot.editMessageReplyMarkup({
      inline_keyboard:[
        [
          {text:`👍 ${mainData.like}`,callback_data:`${fileName}-like`},
          {text:`👎 ${mainData.not}`,callback_data:`${fileName}-not`},
          {text:`❤️ ${mainData.heart}`,callback_data:`${fileName}-heart`},
        ]
      ]
    },{
      chat_id:msg.message.chat.id,
      message_id:messageId
    })
    fs.writeFileSync(`./like/${fileName}`,JSON.stringify(mainData))
  }

  
  
})

function randomNumber(filepath){
  let random = Math.random();
  let data = fs.readFileSync(filepath,'utf-8');
  data = JSON.parse(data);
data = data.length
  function loder(length){
    if(length>=1 && length<100){
      console.log('in first')
      random = Math.floor(random*10);
    }
    else if(length>=100 &&length<1000){
      console.log('in second');
      random = Math.floor(random*100);
    }
  
    else if(length>=1000 && length<10000){
      random = Math.floor(random*1000);
      let devide = Math.floor(Math.random()*10);
      
    }
    else if(length>=10000){
      random = Math.floor(random*10000);
    }
  
    // let devide = Math.random();
    // devide = devide*10
    // devide = Math.floor(devide)
    // random = random/devide;
    // random = Math.floor(random)
    return random;
    
  }
  let a = loder(data);
  return a;
}

// let a = randomNumber('data')
// console.log(a)

function main(chatId,io){
  if(io){
    let data = fs.readFileSync('data','utf-8');
  data = JSON.parse(data);
  let random = randomNumber('data'); // getting a random number  form randomNumber();
console.log(random)
  try{
    let video = bot.sendVideo(chatId,data[random],{
      reply_markup:{
        inline_keyboard:[
          [
            {text:`👍`,callback_data:`file${fileCouont}-like`},
            {text:`👎`,callback_data:`file${fileCouont}-not`},
            {text:`❤️`,callback_data:`file${fileCouont}-heart`},
          ]
        ]
      }
    });
    video.then((val)=>{
      fs.writeFileSync(`./like/file${fileCouont}`,`{
        "user":[1],
        "like" :0,
        "not" :0,
        "heart": 0
    }`)
    fileCouont++;
    })
  }
  catch(err){
    console.log('an error occur');
    // main(msg.chat.id,true);
    bot.sendMessage(msg.chat.id,'Give me a kiss babe🤣🤣🤣🤣🤣🤣')
  }
  }

}

// main();


        

function videoAdder(msg,option){
  
    if(option){
      if(msg.video){
        console.log('its video');
        let fileId = msg.video.file_id;
        data.push(fileId);
      }
      else if(msg.animation){
        console.log('its gifs');
        let fileId = msg.animation.file_id;
        data.push(fileId)
        console.log(data); 
      }
      else if(msg.photo){
        console.log('its photo');
        let  fileId = msg.photo[3].file_id;
        data.push(fileId)
      }
      else{
        console.log('cannot save other files expect vidoe,animation(gifs),photo')
      }
    
      fs.writeFileSync('data',JSON.stringify(data));
    }
    else{
      
    }
}

// I'm suck in there day

