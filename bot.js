require('dotenv').config();
const mastodon = require('mastodon-api');
const fs = require('fs');

const mast = new mastodon({
    client_key: process.env.client_key,
    client_secret: process.env.client_secret,
    access_token: process.env.access_token,
    timeout_ms: 60 * 1000,
    api_url: 'https://fosstodon.org/api/v1/',
})

const num = 1 + (Math.floor(Math.random() * 100));
const params = {
    spoiler_text: "The meaning of life is: ",
    status: num
}
const listener = mast.stream('streaming/user');
listener.on('error', err => console.log(err));

listener.on('message', msg => {

    fs.writeFileSync(`data${new Date().getTime()}.json`, JSON.stringify(msg, null, 2));   
    if (msg.event == 'notification') {
        if (msg.data.type === 'follow') {
            const acct = msg.data.account.acct;
            toot(`@${acct} Thanks for the follow!`);
        }
    }
});

function toot(content) {
    const num = Math.floor(Math.random() * 100);
    const params = {
        status: content
    }   

    mast.post('statuses', params, (error, data) => {
        if (error) {
             console.log(error);
         } else {
            // fs.writeFileSync('',JSON.stringify(data, null, 2));
             console.log(`ID: ${data.id} and timestamp: ${data.created_at}` );
             console.log(`content: ${data.content}`);

         }
     });
}

//toot();

// function toot() {
//     mast.post('statuses', params, (error, data) => {
//         if (error) {
//             console.log(error);
//         } else {
//             fs.writeFileSync('',JSON.stringify(data, null, 2));
//             console.log(`ID: ${data.id} and timestamp: ${data.created_at}` );
//             console.log(`content: ${data.content}`);

//         }
//     });
// }

console.log("mastodon bot starting...");