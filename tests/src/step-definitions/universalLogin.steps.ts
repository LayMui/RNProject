
import { DataTable, Given, Then, When } from '@cucumber/cucumber'
import { Actor, notes} from '@serenity-js/core';
import HomePage from '../page-objects/HomePage';
import LoginPage from '../page-objects/LoginPage';
import LogoutPage from '../page-objects/LogoutPage';
import { setTimeout } from 'timers/promises';
import { ReadSMS } from '../tasks/ReadSMS';
import { ChangeApiConfig } from '@serenity-js/rest';
import OTPPage from '../page-objects/OTPPage';

Given('{actor} is at the universal login for tenant {string} and {string} and {string} in lang {string}', 
async function (actor: Actor, app: string, region: string,  env: string, lang: string) {
  await HomePage.selectWebViewLangEnvRegionApp(lang, env, region, app)
  // Remember the app selected
  this.app = app;
  this.env = env;
  await HomePage.webViewLogin()
  await actor.attemptsTo(
    ChangeApiConfig.setUrlTo(
        'https://usermanagement-sms.stage.xxx.xxxxx.io'   
    ))
});


 
Then('{pronoun} is able to perform OTP', async function (actor: Actor) {
  switch(this.app) {
    case 'mxpEurope':

      break;
    default:
      await setTimeout(5000, 'resolved');
      const recipient = this.countryCode + this.mobileNumber;
      const vendor = 'twilio';
      const hmac = await OTPPage.generateHMAC({ recipient: recipient, environment: this.env, vendor: vendor })
      console.log('HMAC: ' + hmac);
      await actor.attemptsTo(
         ReadSMS.withCredentials(hmac, recipient, this.env, vendor, false),
        // notes().set('vendor', vendor),
         )
     
      const OTP = await OTPPage.readOTP(this.countryCode + this.mobileNumber);
      await OTPPage.enterOTPInput(this.app, OTP);
      await LogoutPage.logout();
    break;
  }
});



