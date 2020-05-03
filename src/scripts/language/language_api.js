const http = require('http');
import HOST from '../host';

export async function getAnalysis (tweets) {
    // console.log("Requesting analysis");

    const options = {
        host: HOST,
        port: process.env.PORT || 3000,
        path: '/analysis',
        method: 'POST',
        headers: {
            'Content-Type': 'text/html'
        }  
    }

    return new Promise(function (resolve, reject) {
        const req = http.request(options, res => {
            // console.log(`statusCode: ${res.statusCode}`)

            res.on('data', sentiment => {
                // console.log(`Analysis received: ${sentiment}`);
                resolve(JSON.parse(sentiment));
            })
        })

        req.on('error', (e) => {
            reject(e);
        });

        req.write(tweets);
        req.end();
    })
}

