import Page from './page';
import Twilio from "twilio";
import { setTimeout } from 'timers/promises';
import { config } from '../../../config/wdio.conf'
import axios from 'axios';
import { createHmac } from 'crypto';

if (!process.env.CIRCLECI) {
  require('dotenv').config({path: `.env.${process.env.NODE_ENV}`});
}
/**
 * sub page containing specific selectors and methods for a specific page
 */
const SELECTORS = {

  // IOS
  CONFIRM_IOS: '//XCUIElementTypeButton[@name="Confirm"]',
  WEBVIEW_OTPCODEINPUT_IOS: '//XCUIElementTypeTextField',
  WEBVIEW_RESENDBUTTON_IOS: '//XCUIElementTypeButton[@name="Resend"]',
  WEBVIEW_CONFIRMBUTTON_IOS: '//XCUIElementTypeButton[@name="Confirm"]',
  WEBVIEW_BACKICON_IOS: '//XCUIElementTypeImage[contains(@name,"icon")][1]',
  WEBVIEW_ERRMSG_INCORRECT_OTPCODE_IOS: '//XCUIElementTypeStaticText[@name="Incorrect code. Please request a new one"]',
  WEBVIEW_DONE_IOS : '//XCUIElementTypeButton[@name="Done"]',
  WEBVIEW_OTPHELPER_LINK_IOS: '//XCUIElementTypeStaticText[@name="Not receiving an OTP?"]',
  WEBVIEW_OTPHELPER_WINDOW_TITLE_IOS: '(//XCUIElementTypeStaticText[@name="Not receiving an OTP?"])[2]',
  WEBVIEW_OTPHELPER_WINDOW_TEXT_IOS: '//XCUIElementTypeOther[@name="main"]/XCUIElementTypeOther[5]/*',
  WEBVIEW_OTPHELPER_WINDOW_CLOSEBUTTON_IOS: '//XCUIElementTypeStaticText[@name="Ok"]',
  WEBVIEW_OTPCODEINPUT_COFFEECLUB_IOS: '//XCUIElementTypeOther[@name="main"]/XCUIElementTypeSecureTextField[1]',

  //email-based  login
  WEBVIEW_OTPCODEINPUT_MXP_IOS: '//XCUIElementTypeTextField[@name="○○○○○"]',
  WEBVIEW_RESENDBUTTON_MXP_IOS: '//XCUIElementTypeButton[@name="Request new code"]',
  WEBVIEW_CONFIRMBUTTON_MXP_IOS: '(//XCUIElementTypeButton)[3]',
  WEBVIEW_BACKICON_MXP_IOS: '//XCUIElementTypeImage[@name="Back arrow icon"]', 
  WEBVIEW_ERRMSG_INCORRECT_OTPCODE_MXP_IOS: '//XCUIElementTypeStaticText[@name="Incorrect code. Please request a new one"]',
  WEBVIEW_SKIPLOGIN_IOS: '//XCUIElementTypeButton[@name="Skip"]',
  WEBVIEW_SIGNUPBUTTON_IOS: '//XCUIElementTypeButton[@name="Sign up"]', 
  
  
  // ANDROID
  WEBVIEW_OTPCODEINPUT_MXP_ANDROID: '//android.widget.EditText[@text="○○○○○"]',
  WEBVIEW_OTPCODEINPUT_ANDROID: '//android.widget.EditText',
  WEBVIEW_RESENDBUTTON_ANDROID: '//*[@text="Resend"]',
  WEBVIEW_CONFIRMBUTTON_ANDROID: '//*[@text="Confirm"]', 
  WEBVIEW_SIGNUPBUTTON_ANDROID: '//android.widget.Button[@text="Sign up"]', 
  WEBVIEW_BACKICON_ANDROID: '//*[contains(@text,"icon")][1]',
  WEBVIEW_ERRMSG_INCORRECT_OTPCODE_ANDROID: '//*[@text="Incorrect code. Please request a new one"]',
  WEBVIEW_OTPHELPER_LINK_ANDROID: '//*[@text="Not receiving an OTP?"]',
  WEBVIEW_OTPHELPER_WINDOW_TITLE_ANDROID: '(//*[@text="Not receiving an OTP?"])[2]',
  WEBVIEW_OTPHELPER_WINDOW_TEXT_ANDROID: '//android.view.View[contains(@text,"Make sure Yara is not ")]',
  WEBVIEW_OTPHELPER_WINDOW_CLOSEBUTTON_ANDROID: '//*[@text="Ok"]',
  WEBVIEW_OTPCODEINPUT_COFFEECLUB_ANDROID: '//android.widget.EditText[1]',

 
  //email-based login
  WEBVIEW_RESENDBUTTON_MXP_ANDROID: '//*[@text="Request new code"]',
  WEBVIEW_CONFIRMBUTTON_MXP_ANDROID: '(//android.widget.Button)[3]', 
  WEBVIEW_BACKICON_MXP_ANDROID: '//*[@text="Back arrow icon"]',
  WEBVIEW_ERRMSG_INCORRECT_OTPCODE_MXP_ANDROID: '//*[@text="Incorrect code. Please request a new one"]',
  WEBVIEW_SKIPLOGIN_ANDROID : '//*[@text="Skip"]'

};

class OTPPage extends Page {
  async abortOTPCode(app, otpNumber='11111') {
      if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
        let OTPINPUT_SELECTOR;
        switch(app) {
          case 'mxpEurope':
              OTPINPUT_SELECTOR= $(SELECTORS.WEBVIEW_OTPCODEINPUT_MXP_ANDROID);
            break;
          default:
            OTPINPUT_SELECTOR= $(SELECTORS.WEBVIEW_OTPCODEINPUT_ANDROID);
            break;
        }
        await OTPINPUT_SELECTOR.waitForDisplayed({timeout:10000});
        await OTPINPUT_SELECTOR.touchAction('tap');
        await OTPINPUT_SELECTOR.clearValue(); 
        await OTPINPUT_SELECTOR.addValue(otpNumber,{translateToUnicode:false});
      } else {
        await $(SELECTORS.WEBVIEW_OTPCODEINPUT_IOS).waitForDisplayed({timeout:10000});
        await $(SELECTORS.WEBVIEW_OTPCODEINPUT_IOS).touchAction('tap');
        for (let i = 0; i < otpNumber.length; i++) 
          await $(SELECTORS.WEBVIEW_OTPCODEINPUT_IOS).addValue(otpNumber[i]);
        await $(SELECTORS.WEBVIEW_DONE_IOS).waitForDisplayed({timeout:10000}) && $(SELECTORS.WEBVIEW_DONE_IOS).touchAction('tap');
      }
   
  }

  async skipLogin(){
    if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
      await $(SELECTORS.WEBVIEW_SKIPLOGIN_ANDROID).waitForDisplayed({timeout:10000})
      await $(SELECTORS.WEBVIEW_SKIPLOGIN_ANDROID).touchAction('tap');
    } else {
      await $(SELECTORS.WEBVIEW_SKIPLOGIN_IOS).waitForDisplayed({timeout:10000})
      await $(SELECTORS.WEBVIEW_SKIPLOGIN_IOS).touchAction('tap');
    }

}

  async resendOTPCode() {
      if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') { 
        (await $(SELECTORS.WEBVIEW_RESENDBUTTON_ANDROID).waitForEnabled({timeout:20000})) &&
        (await $(SELECTORS.WEBVIEW_RESENDBUTTON_ANDROID).isEnabled()) &&
         $(SELECTORS.WEBVIEW_RESENDBUTTON_ANDROID).touchAction('tap')
      } else {
        (await $(SELECTORS.WEBVIEW_RESENDBUTTON_IOS).waitForEnabled({timeout:10000})) &&
        (await $(SELECTORS.WEBVIEW_RESENDBUTTON_IOS).isEnabled()) &&
        $(SELECTORS.WEBVIEW_RESENDBUTTON_IOS).touchAction('tap')
    }
  }

  async enterOTPInputIOS(app, otpNumber) {
    let OTPINPUT_SELECTOR;
    switch(app) {
      case 'mxpEurope':
            OTPINPUT_SELECTOR= $(SELECTORS.WEBVIEW_OTPCODEINPUT_MXP_IOS);
            await $(SELECTORS.WEBVIEW_SIGNUPBUTTON_IOS).waitForDisplayed({timeout:100000});
            await OTPINPUT_SELECTOR.waitForDisplayed({timeout:10000});
            await OTPINPUT_SELECTOR.clearValue(); 
            await OTPINPUT_SELECTOR.addValue(otpNumber,{translateToUnicode:false});
            await $(SELECTORS.WEBVIEW_SIGNUPBUTTON_IOS).waitForEnabled({timeout:10000}) && 
            await $(SELECTORS.WEBVIEW_SIGNUPBUTTON_IOS).isEnabled() && 
            await $(SELECTORS.WEBVIEW_SIGNUPBUTTON_IOS).touchAction('tap');
          break;

      case 'coffeeClub':
        await $(SELECTORS.WEBVIEW_OTPCODEINPUT_COFFEECLUB_IOS).waitForDisplayed({timeout:10000});
        await $(SELECTORS.WEBVIEW_OTPCODEINPUT_COFFEECLUB_IOS).touchAction('tap');
        for (let i = 0; i < otpNumber.length; i++) 
          await $( `//XCUIElementTypeKey[@name=${otpNumber[i]}]`).touchAction('tap');
        await $(SELECTORS.WEBVIEW_CONFIRMBUTTON_IOS).waitForEnabled({timeout:10000})
        await $(SELECTORS.WEBVIEW_CONFIRMBUTTON_IOS).isEnabled() && await $(SELECTORS.WEBVIEW_CONFIRMBUTTON_IOS).touchAction('tap');
        break;
      default:
        await $(SELECTORS.WEBVIEW_CONFIRMBUTTON_IOS).waitForDisplayed({timeout:100000})
        await $(SELECTORS.WEBVIEW_OTPCODEINPUT_IOS).waitForDisplayed({timeout:100000});
        await $(SELECTORS.WEBVIEW_OTPCODEINPUT_IOS).touchAction('tap');
        for (let i = 0; i < otpNumber.length; i++) {
          await $(SELECTORS.WEBVIEW_OTPCODEINPUT_IOS).addValue(otpNumber[i]);
        }
        await $(SELECTORS.WEBVIEW_DONE_IOS).isEnabled() && 
        await $(SELECTORS.WEBVIEW_DONE_IOS).touchAction('tap');
        await $(SELECTORS.WEBVIEW_CONFIRMBUTTON_IOS).isEnabled() && 
        await $(SELECTORS.WEBVIEW_CONFIRMBUTTON_IOS).touchAction('tap');

      }
  }

  async enterOTPInputANDROID(app, otpNumber)
  {
    let OTPINPUT_SELECTOR;  
    // ANDROID
    switch(app) {
      case 'mxpEurope':
          OTPINPUT_SELECTOR= $(SELECTORS.WEBVIEW_OTPCODEINPUT_MXP_ANDROID);
          await $(SELECTORS.WEBVIEW_SIGNUPBUTTON_ANDROID).waitForDisplayed({timeout:100000});
          await OTPINPUT_SELECTOR.waitForDisplayed({timeout:10000});
          await OTPINPUT_SELECTOR.clearValue(); 
          await OTPINPUT_SELECTOR.addValue(otpNumber,{translateToUnicode:false});
          await $(SELECTORS.WEBVIEW_SIGNUPBUTTON_ANDROID).waitForEnabled({timeout:10000}) && 
          await $(SELECTORS.WEBVIEW_SIGNUPBUTTON_ANDROID).isEnabled() && 
          await $(SELECTORS.WEBVIEW_SIGNUPBUTTON_ANDROID).touchAction('tap');
        break;
      case 'coffeeClub':
          OTPINPUT_SELECTOR=$(SELECTORS.WEBVIEW_OTPCODEINPUT_COFFEECLUB_ANDROID);
          for (let i = 0; i < otpNumber.length; i++) 
            await $(`//android.widget.EditText[${(i+1)+""}]`).addValue(otpNumber[i]);
          await $(SELECTORS.WEBVIEW_CONFIRMBUTTON_ANDROID).waitForEnabled({timeout:10000}) && 
          await $(SELECTORS.WEBVIEW_CONFIRMBUTTON_ANDROID).isEnabled() && 
          await $(SELECTORS.WEBVIEW_CONFIRMBUTTON_ANDROID).touchAction('tap');
        break;

      default:
        OTPINPUT_SELECTOR= $(SELECTORS.WEBVIEW_OTPCODEINPUT_ANDROID);
        await $(SELECTORS.WEBVIEW_CONFIRMBUTTON_ANDROID).waitForDisplayed({timeout:100000});
        await OTPINPUT_SELECTOR.waitForDisplayed({timeout:10000});
        await OTPINPUT_SELECTOR.clearValue(); 
        await OTPINPUT_SELECTOR.addValue(otpNumber,{translateToUnicode:false});
        await $(SELECTORS.WEBVIEW_CONFIRMBUTTON_ANDROID).waitForEnabled({timeout:10000}) && 
        await $(SELECTORS.WEBVIEW_CONFIRMBUTTON_ANDROID).isEnabled() && 
        await $(SELECTORS.WEBVIEW_CONFIRMBUTTON_ANDROID).touchAction('tap');


        // await $(SELECTORS.OTPCODEINPUTVIEWGROUP_ANDROID).waitForDisplayed({timeout:10000});
        // await $(SELECTORS.OTPCODEINPUTVIEWGROUP_ANDROID).touchAction('tap');
        //   for (let i = 0; i < otpNumber.length; i++) 
        //     await $(SELECTORS.OTPCODEINPUTEDITTEXT_ANDROID).addValue(otpNumber[i],{translateToUnicode:false});
        //   await $(SELECTORS.CONFIRM_ANDROID).isEnabled() && $(SELECTORS.CONFIRM_ANDROID).touchAction('tap');

        break;
    }
  }
  async enterOTPInput(app, otpNumber) {
      if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
          this.enterOTPInputANDROID(app, otpNumber);
      } else {
          this.enterOTPInputIOS(app, otpNumber);
      }
  }

  async enterOTPInputLanguageTranslation(otpNumber) {
    if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
      await $(SELECTORS.WEBVIEW_OTPCODEINPUT_ANDROID).waitForDisplayed({timeout:10000});
      await $(SELECTORS.WEBVIEW_OTPCODEINPUT_ANDROID).clearValue(); 
      await $(SELECTORS.WEBVIEW_OTPCODEINPUT_ANDROID).addValue(otpNumber,{translateToUnicode:false});
    } else {
       await $(SELECTORS.WEBVIEW_OTPCODEINPUT_IOS).waitForDisplayed({timeout:100000});
      await $(SELECTORS.WEBVIEW_OTPCODEINPUT_IOS).touchAction('tap');
      for (let i = 0; i < otpNumber.length; i++) {
        await $(SELECTORS.WEBVIEW_OTPCODEINPUT_IOS).addValue(otpNumber[i]);
      }
      await $(SELECTORS.WEBVIEW_DONE_IOS).isEnabled() && 
      $(SELECTORS.WEBVIEW_DONE_IOS).touchAction('tap');
    }
}

  async confirmOTP() {
    await $(SELECTORS.CONFIRM_IOS).waitForEnabled({timeout:10000})
    await $(SELECTORS.CONFIRM_IOS).isEnabled() && $(SELECTORS.CONFIRM_IOS).touchAction('tap');
  }

  async goBack() {
      if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android')
      { await $(SELECTORS.WEBVIEW_BACKICON_ANDROID).waitForDisplayed({timeout:5000}) && await $(SELECTORS.WEBVIEW_BACKICON_ANDROID).touchAction('tap')
      } 
      else { await $(SELECTORS.WEBVIEW_BACKICON_IOS).waitForDisplayed({timeout:5000}) && await $(SELECTORS.WEBVIEW_BACKICON_IOS).touchAction('tap')
      } 
  }

  async verifyErrorMessage() {
      if(JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android')
        {
          await expect (await $(SELECTORS.WEBVIEW_ERRMSG_INCORRECT_OTPCODE_ANDROID)).toBeDisplayed()
        }
        else 
        {
          await expect (await $(SELECTORS.WEBVIEW_ERRMSG_INCORRECT_OTPCODE_IOS)).toBeDisplayed()
        }
  }


  async openOTPHelper(){
      if(JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android'){
        await $(SELECTORS.WEBVIEW_OTPHELPER_LINK_ANDROID).waitForDisplayed({timeout:10000});
        await $(SELECTORS.WEBVIEW_OTPHELPER_LINK_ANDROID).touchAction('tap');
      }else {
        await $(SELECTORS.WEBVIEW_OTPHELPER_LINK_IOS).waitForDisplayed({timeout:10000});
        await $(SELECTORS.WEBVIEW_OTPHELPER_LINK_IOS).touchAction('tap');
      }
   
  }

  async verifyOTPHelperWindow(){
      if(JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android'){
        await expect (await $(SELECTORS.WEBVIEW_OTPHELPER_WINDOW_TITLE_ANDROID)).toBeDisplayed();
        await expect (await $(SELECTORS.WEBVIEW_OTPHELPER_WINDOW_TEXT_ANDROID)).toBeDisplayed();
      }else {
        await expect (await $(SELECTORS.WEBVIEW_OTPHELPER_WINDOW_TITLE_IOS)).toBeDisplayed();
        await expect (await $(SELECTORS.WEBVIEW_OTPHELPER_WINDOW_TEXT_IOS)).toBeDisplayed();
      }
   
  }

  async closeOTPHelperWindow(){
      if(JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android'){
        await $(SELECTORS.WEBVIEW_OTPHELPER_WINDOW_CLOSEBUTTON_ANDROID).waitForDisplayed({timeout:10000});
        await $(SELECTORS.WEBVIEW_OTPHELPER_WINDOW_CLOSEBUTTON_ANDROID).touchAction('tap');
      }else {
        await $(SELECTORS.WEBVIEW_OTPHELPER_WINDOW_CLOSEBUTTON_IOS).waitForDisplayed({timeout:10000});
        await $(SELECTORS.WEBVIEW_OTPHELPER_WINDOW_CLOSEBUTTON_IOS).touchAction('tap');
      }
  }

  async verifyISOTPHelperWindowClosed(){
      if(JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android'){
        await expect (await $(SELECTORS.WEBVIEW_OTPHELPER_WINDOW_TITLE_ANDROID)).not.toBeDisplayed();
        await expect (await $(SELECTORS.WEBVIEW_OTPHELPER_WINDOW_TEXT_ANDROID)).not.toBeDisplayed();
      }else {
        await expect (await $(SELECTORS.WEBVIEW_OTPHELPER_WINDOW_TITLE_IOS)).not.toBeDisplayed();
        await expect (await $(SELECTORS.WEBVIEW_OTPHELPER_WINDOW_TEXT_IOS)).not.toBeDisplayed();
      }
  }


  async resendOTPCodeEmailLogin() {

    if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') { 
      (await $(SELECTORS.WEBVIEW_RESENDBUTTON_MXP_ANDROID).waitForEnabled({timeout:10000}));
      (await $(SELECTORS.WEBVIEW_RESENDBUTTON_MXP_ANDROID).isEnabled()) &&
       $(SELECTORS.WEBVIEW_RESENDBUTTON_MXP_ANDROID).touchAction('tap')
    } else {
      (await $(SELECTORS.WEBVIEW_RESENDBUTTON_MXP_IOS).waitForEnabled({timeout:10000})) &&
      (await $(SELECTORS.WEBVIEW_RESENDBUTTON_MXP_IOS).isEnabled()) &&
      $(SELECTORS.WEBVIEW_RESENDBUTTON_MXP_IOS).touchAction('tap')
  }
}

async enterOTPInputEmailLogin(otpNumber) {
  if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {    
    await $(SELECTORS.WEBVIEW_OTPCODEINPUT_ANDROID).waitForDisplayed({timeout:10000});
    await $(SELECTORS.WEBVIEW_OTPCODEINPUT_ANDROID).touchAction('tap');
    await $(SELECTORS.WEBVIEW_OTPCODEINPUT_ANDROID).setValue(otpNumber);
  } else {
    await $(SELECTORS.WEBVIEW_OTPCODEINPUT_MXP_IOS).waitForDisplayed({timeout:10000});
    await setTimeout(4000,'resolved');
    await (await $(SELECTORS.WEBVIEW_OTPCODEINPUT_MXP_IOS)).touchAction('tap');
    for (let i = 0; i < otpNumber.length; i++) 
      await $( `//XCUIElementTypeKey[@name=${otpNumber[i]}]`).touchAction('tap');
  }
  
}

async verifyOTPCode(OTPcode){
 await expect (OTPcode).not.toEqual("000000");
}

async goBackEmailLogin() {
  if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android')
    await $(SELECTORS.WEBVIEW_BACKICON_MXP_ANDROID).waitForDisplayed({timeout: 10000}) && await $(SELECTORS.WEBVIEW_BACKICON_MXP_ANDROID).touchAction('tap')
  else  
    await $(SELECTORS.WEBVIEW_BACKICON_MXP_IOS).waitForDisplayed({timeout:10000}) && await $(SELECTORS.WEBVIEW_BACKICON_MXP_IOS).touchAction('tap');
}

async confirmEmailOTP() {
  if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {         
    await $(SELECTORS.WEBVIEW_CONFIRMBUTTON_MXP_ANDROID).waitForDisplayed({timeout:10000})
    await $(SELECTORS.WEBVIEW_CONFIRMBUTTON_MXP_ANDROID).isEnabled() && $(SELECTORS.WEBVIEW_CONFIRMBUTTON_MXP_ANDROID).touchAction('tap');
  } else{
    await $(SELECTORS.WEBVIEW_CONFIRMBUTTON_MXP_IOS).waitForDisplayed({timeout:10000})
    await $(SELECTORS.WEBVIEW_CONFIRMBUTTON_MXP_IOS).isEnabled() && $(SELECTORS.WEBVIEW_CONFIRMBUTTON_MXP_IOS).touchAction('tap');
  }
}


async verifyOTPInput() {
  if(JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android')
    {
      expect (await $(SELECTORS.WEBVIEW_OTPCODEINPUT_MXP_ANDROID)).toBeDisplayed()
    }
    else 
    {
      await expect ($(SELECTORS.WEBVIEW_OTPCODEINPUT_MXP_IOS)).toBeDisplayed()
} 
}

async verifyErrorMessageEmailLogin() {
    if(JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android')
      {
        await expect ($(SELECTORS.WEBVIEW_ERRMSG_INCORRECT_OTPCODE_MXP_ANDROID)).toBeDisplayed()
      }
      else 
      {
        await expect ($(SELECTORS.WEBVIEW_ERRMSG_INCORRECT_OTPCODE_MXP_IOS)).toBeDisplayed()
  } 
}

async generateHMAC(payload) {
      return createHmac('sha256', process.env.HMAC_SECRET).update(JSON.stringify(payload)).digest('hex');  
}

async readOTPFromEmail(sendTO){
  let OTPcode
  let optionsGet = {
    method: 'GET',
    url: `https://mailsac.com/api/addresses/${sendTO}/messages`,
    headers: {'Mailsac-Key': 'k_UJwqFZEqe2Xha7BTrxTb2CrcNG3A8a8fc'},
  };
  try {
    const result = await axios.request(optionsGet);
    const message = result.data[0].subject;
    OTPcode = message.match(/\d/g);
    OTPcode = OTPcode.join("");
    console.log("OPT code: "+OTPcode) 
  
  } catch (error) {
    console.log('ERROR ====>', error);
    return "000000";
  }

  return OTPcode;
}

  async readOTP(sentTo) {
    console.log('SENTTO: ' + sentTo)
    const date = new Date();
    const timeStamp = date.toUTCString();

    
    const TWILIO_ACCOUNT_ID = process.env.TWILIO_ACCOUNT_ID;
    const TWILIO_ACCOUNT_API_KEY = process.env.TWILIO_ACCOUNT_API_KEY;
    const TWILIO_ACCOUNT_API_SECRET = process.env.TWILIO_ACCOUNT_API_SECRET;

    if (typeof TWILIO_ACCOUNT_ID !== "undefined" && TWILIO_ACCOUNT_ID) {
      console.log("TWILIO_ACCOUNT_ID is defined");
    } else {
      console.log(`TWILIO_ACCOUNT_ID: ${TWILIO_ACCOUNT_ID}`);
    }

    if (
      typeof TWILIO_ACCOUNT_API_KEY !== "undefined" &&
      TWILIO_ACCOUNT_API_KEY
    ) {
      console.log("TWILIO_ACCOUNT_API_KEY is defined");
    } else {
      console.log(`TWILIO_ACCOUNT_API_KEY: ${TWILIO_ACCOUNT_API_KEY}`);
    }

    if (
      typeof TWILIO_ACCOUNT_API_SECRET !== "undefined" &&
      TWILIO_ACCOUNT_API_SECRET
    ) {
      console.log("TWILIO_ACCOUNT_API_SECRET is defined");
    } else {
      console.log(`TWILIO_ACCOUNT_API_SECRET: ${TWILIO_ACCOUNT_API_SECRET}`);
    }

    const client = new Twilio(TWILIO_ACCOUNT_API_KEY, TWILIO_ACCOUNT_API_SECRET, { accountSid: TWILIO_ACCOUNT_ID});


    let message;

    try {
      const messages = await client.messages.list({
        to: sentTo,
        limit: 1,
        // direction: "inbound",
        // dateSentBefore: timeStamp,
      });
      console.log('messages:' + messages)
      message = messages[0].body;
    } catch (e) {
      console.error("Got an error:", e.code, e.message);
      return "00000";
    }
    // <#> 24562 is your FarmGo-debug OTP. Do not share this with anyone
    let otpNumber = message.match(/\d/g);
    otpNumber = otpNumber.join("");
    console.info("Otp message : " + message);
    console.info("Otp : " + otpNumber);
    return otpNumber;
  }

  /**
   * overwrite specifc options to adapt it to page object
   */
  open() {
    return super.open('otp');
  }
}

export default new OTPPage();
