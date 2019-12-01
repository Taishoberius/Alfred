//nimport * as functions from 'firebase-functions';
import { dialogflow } from 'actions-on-google';
import * as express from 'express';
import * as BodyParser from 'body-parser';
const Swagger = require('swagger-client')

const app = dialogflow({
    debug: true
});

const openhab = Swagger('http://demo.openhab.org:8080/rest/swagger.json');


app.intent('smart_home_action', (conv) => {
    const action = conv.parameters.smart_action + "";
    const target = conv.parameters.smart_object + "";

    if (action == "") {
        openhab.then((client: any) => {
            client.apis.items.getItemData({
                itemname: target
            })
            .then((res: any) => {
                console.log(res.obj.state);
            });
            conv.close('Done');
        });
        return;
    }
    
    openhab.then((client: any) => {
        console.log("sending " + action + " for " +  target + " to openhab");
        client.apis.items.postItemCommand({
            itemname: target,
            body: action
        });
        conv.close('Done');
    });
});


const expressApp = express().use(BodyParser.json())
expressApp.post('/intents', app);
expressApp.listen(8080);

//exports.intents = functions.https.onRequest(app);àç)