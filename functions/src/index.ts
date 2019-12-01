//nimport * as functions from 'firebase-functions';
import { dialogflow } from 'actions-on-google';
import * as express from 'express';
import * as BodyParser from 'body-parser';
const Swagger = require('swagger-client')

const app = dialogflow({
    debug: true
});

const openhab = Swagger('http://demo.openhab.org:8080/rest/swagger.json');

openhab.then((client: any) => client
    .apis
    .items
    .getItemData({itemname: "FF_Office_Light"})
    .then((data: any) => console.log(data)))


app.intent('smarthome.device.switch.on', (conv) => {
    switch (conv.action) {
        case 'smarthome.device.switch.on':
            const params = conv.parameters;
            const room = params.room;
            const device = params.device;
            if (room === 'office' && device == 'table lamp') {
                openhab.then((client: any) => {
                    client.apis.items.postItemCommand({
                        itemname: 'FF_Office_Light',
                        body: 'OFF'
                    });
                    conv.close('Done');
                });
            }
            break;
        default:
            conv.ask("I can't do that action yet.")
            break;
    }

    // conv.ask(new SimpleResponse({
    //     speech: `You asked me to : ${conv.query}`,
    //     text: `Your parametes are : ${JSON.stringify(conv.parameters)}`
    // }))
});

const expressApp = express().use(BodyParser.json())
expressApp.post('/intents', app);
expressApp.listen(6666);

//exports.intents = functions.https.onRequest(app);àç)