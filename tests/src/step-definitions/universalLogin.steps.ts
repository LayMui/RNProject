
import { DataTable, Given, Then, When } from '@cucumber/cucumber'
import { Actor, actorCalled, actorInTheSpotlight, notes} from '@serenity-js/core';
import HomePage from '../page-objects/HomePage';
import LoginPage from '../page-objects/LoginPage';
import LogoutPage from '../page-objects/LogoutPage';
import { setTimeout } from 'timers/promises';
import { ReadSMS } from '../tasks/ReadSMS';
import { ChangeApiConfig } from '@serenity-js/rest';
import OTPPage from '../page-objects/OTPPage';

Given('{actor} is at the home app', 
async function (actor: Actor) {
  await actor.attemptsTo(
    ChangeApiConfig.setUrlTo(
        'https://usermanagement-sms.stage.xxx.xxxxx.io'   
    ))
});


 
Then('{pronoun} is able to perform OTP', async function (actor: Actor) {
      await setTimeout(5000, 'resolved');
      const recipient = '+6596666666';
      const environment = "stage";
      const vendor = 'twilio';
      const hmac = await OTPPage.generateHMAC({ recipient: recipient, environment: environment, vendor: vendor })
      console.log('HMAC: ' + hmac);
      await actorCalled('James').attemptsTo(
         ReadSMS.withCredentials(hmac, recipient, this.env, vendor, false),
        // notes().set('vendor', vendor),
         )
     
      const OTP = await OTPPage.readOTP(this.countryCode + this.mobileNumber);
});



