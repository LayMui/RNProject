import Page from './page';
import { config } from '../../../config/wdio.conf'
import { setTimeout } from 'timers/promises';
import axios from 'axios';

/**
 * sub page containing specific selectors and methods for a specific page
 */

const SELECTORS = {
  DONE: '~Done',
  DEVICE_WINDOW_ANDROID: '/hierarchy/android.widget.FrameLayout',
  DEVICE_WINDOW_IOS: '//XCUIElementTypeWindow',
  
  // IOS
  PHONENUMBERINPUT_IOS: '//XCUIElementTypeOther[@name="PhoneNumberInput"]',
  BACK_IOS: '//XCUIElementTypeButton[@name="Back"]',

  // ANDROID
  PHONENUMBERINPUTVIEWGROUP_ANDROID:  '//android.view.ViewGroup[@content-desc="PhoneNumberInput"]/android.view.ViewGroup[1]',
  BACK_ANDROID: '//android.widget.Button[@content-desc="Back"]',

  // IOS
  WEBVIEW_COUNTRYSELECT_IOS: '//*[@name="arrow down"]',
  WEBVIEW_COUNTRYCODESELECT_IOS: '//XCUIElementTypeOther[@name="main"]/XCUIElementTypeOther[6]',
  WEBVIEW_PHONENUMBERINPUT_IOS: '//XCUIElementTypeTextField',
  WEBVIEW_CLOSEICON_IOS: '//XCUIElementTypeImage[contains(@name,"icon")][1]',
  WEBVIEW_DELETE_NUMBER_IOS:'//XCUIElementTypeKey[@name="Delete"]',
  WEBVIEW_CONTINUEBUTTON_IOS: '//XCUIElementTypeButton[@name="Continue"]',
  WEBVIEW_ERRMSG_INCORRECTNUMBER_IOS:  '//XCUIElementTypeStaticText[@name="Invalid phone number, please try again"]',
  WEBVIEW_SKIPLOGIN_IOS: '//XCUIElementTypeButton[@name="Skip"]',
  RECAPTCHA_IOS: '//XCUIElementTypeOther[@name="reCAPTCHA"]',

  // Email-based login
  WEBVIEW_MOBILE_NUMBER_LOGIN_IOS: '//XCUIElementTypeButton[@name="Mobile number"]',
  WEBVIEW_PHONENUMBERINPUT_MXP_IOS: '(//XCUIElementTypeTextField)[1]',
  WEBVIEW_BACKICON_MXP_IOS: '//XCUIElementTypeImage[@name="cancel icon"]',
  WEBVIEW_CONTINUEBUTTON_MXP_IOS: '//XCUIElementTypeButton[@name="Continue"]',
  WEBVIEW_EMAIL_ERROR_IOS: '//XCUIElementTypeStaticText[@name="Enter valid email [example@mail.com]"]',
  WEBVIEW_EMAIL_LOGIN_IOS : '//XCUIElementTypeButton[@name="Email"]',
  WEBVIEW_EMAILINPUT_IOS : '(//XCUIElementTypeTextField)[2]',
  

  // ANDROID
  WEBVIEW_COUNTRYSELECT_ANDROID: '//*[@text="arrow down"]',
  WEBVIEW_COUNTRYCODESELECT_ANDROID: '//android.widget.ListView',
  WEBVIEW_PHONENUMBERINPUT_ANDROID:  '//android.widget.EditText',
  WEBVIEW_CLOSEICON_ANDROID: '//*[contains(@text,"icon")][1]',
  WEBVIEW_CONTINUEBUTTON_ANDROID:  '//*[@text="Continue"]',
  WEBVIEW_ERRMSG_INCORRECTNUMBER_ANDROID: '//*[@text=\'Invalid phone number, please try again\']' ,
  WEBVIEW_SKIPLOGIN_ANDROID : '//*[@text="Skip"]',
  RECAPTCHA_ANDROID: '//android.widget.CheckBox[contains(@resource-id, "recaptcha-anchor")]',

  // Email-based login
  WEBVIEW_PHONENUMBERINPUT_MXP_ANDROID:  '(//android.widget.EditText)[1]',
  WEBVIEW_BACKICON_MXP_ANDROID: '//*[@text="cancel icon"]',   
  WEBVIEW_CONTINUEBUTTON_MXP_ANDROID:  '//*[@text="Continue"]',
  WEBVIEW_MOBILE_NUMBER_LOGIN_ANDROID : '//*[@text="Mobile number"]',
  WEBVIEW_EMAIL_ERROR_ANDROID : '//*[@text="Enter valid email [example@mail.com]"]',
  WEBVIEW_EMAIL_LOGIN_ANDROID : '//*[@text="Email"]',
  WEBVIEW_EMAILINPUT_ANDROID : '(//android.widget.EditText)[2]'

};


class LoginPage extends Page {

  async selectCountryCode(countryName, app) {
     if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
            await $(SELECTORS.WEBVIEW_COUNTRYSELECT_ANDROID).waitForDisplayed({timeout:100000})
            if(!(await $(`//*[contains(@text,'${countryName}')]`).isExisting())){
              await $(SELECTORS.WEBVIEW_COUNTRYSELECT_ANDROID).touchAction('tap') 
              await this.slideToCountry(countryName,app); 
              await $(`//*[contains(@text,'${countryName}')]`).touchAction('tap');
            }
    
    } else {
        await $(SELECTORS.WEBVIEW_COUNTRYSELECT_IOS).waitForDisplayed({timeout:100000})
        if (!(await $(`//XCUIElementTypeStaticText[@name='${countryName}']`).isExisting())){
          await $(SELECTORS.WEBVIEW_COUNTRYSELECT_IOS).touchAction('tap')
          await this.slideToCountry(countryName,app); 
          await $(`//XCUIElementTypeStaticText[@name='${countryName}']`).touchAction('tap') 
        }
      }    
  }

  async verifyCountryCodeNameFlag(countryFlagName) {
    const countryFlag = countryFlagName.split(" ")[0]
    const countryCode = countryFlagName.split(" ")[1]
    const countryName = countryFlagName.split(/(\d) /).pop();
      if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
        await expect (await $(`//*[@text=\'${countryName}\']`)).toBeDisplayed()
        await expect (await $(`//*[@text=\'${countryFlag}\']`)).toBeDisplayed()
        await expect (await $(`//*[@text=\'${countryCode}\']`)).toBeDisplayed()
    } 
  }

  async enterMobileNumber(mobileNumber) {
  
        if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
          await $(SELECTORS.WEBVIEW_PHONENUMBERINPUT_ANDROID).waitForDisplayed({timeout:10000});
          await $(SELECTORS.WEBVIEW_PHONENUMBERINPUT_ANDROID).touchAction('tap');
          await $(SELECTORS.WEBVIEW_PHONENUMBERINPUT_ANDROID).setValue(mobileNumber)    
        } else {
          await $(SELECTORS.WEBVIEW_PHONENUMBERINPUT_IOS).waitForDisplayed({timeout:10000});
          await $(SELECTORS.WEBVIEW_PHONENUMBERINPUT_IOS).touchAction('tap');
          await $(SELECTORS.WEBVIEW_PHONENUMBERINPUT_IOS).setValue(mobileNumber); 
          await $(SELECTORS.DONE).touchAction('tap');   
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

  async selectReCAPTCHA() {
    if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') { 
      await $(SELECTORS.RECAPTCHA_ANDROID).waitForDisplayed({timeout:10000});
      await $(SELECTORS.RECAPTCHA_ANDROID).touchAction('tap'); 
    } else {
      await (await $(SELECTORS.RECAPTCHA_IOS)).waitForDisplayed({timeout:10000});
      await (await $(SELECTORS.RECAPTCHA_IOS)).touchAction('tap');  
    }
  }


  async clearMobileNumber(isWebView) {
  
        if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
          await $(SELECTORS.WEBVIEW_PHONENUMBERINPUT_ANDROID).waitForDisplayed({timeout: 10000});
          await $(SELECTORS.WEBVIEW_PHONENUMBERINPUT_ANDROID).touchAction('tap');
          await $(SELECTORS.WEBVIEW_PHONENUMBERINPUT_ANDROID).clearValue()
        } else {
          await $(SELECTORS.WEBVIEW_PHONENUMBERINPUT_IOS).waitForDisplayed({timeout: 10000});
          await $(SELECTORS.WEBVIEW_PHONENUMBERINPUT_IOS).touchAction('tap');
          await $(SELECTORS.WEBVIEW_PHONENUMBERINPUT_IOS).clearValue();  
          await $(SELECTORS.DONE).touchAction('tap');
        }
  }
  
  
  async continueToOTP() {
    if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
      await $(SELECTORS.WEBVIEW_CONTINUEBUTTON_ANDROID).waitForDisplayed({timeout:10000})
      await  $(SELECTORS.WEBVIEW_CONTINUEBUTTON_ANDROID).waitForEnabled({timeout:10000});
      await  $(SELECTORS.WEBVIEW_CONTINUEBUTTON_ANDROID).isEnabled() && 
        await $(SELECTORS.WEBVIEW_CONTINUEBUTTON_ANDROID).touchAction('tap');
      } else {
        await $(SELECTORS.WEBVIEW_CONTINUEBUTTON_IOS).waitForDisplayed({timeout:10000})
        await $(SELECTORS.WEBVIEW_CONTINUEBUTTON_IOS).waitForEnabled({timeout:10000});
        await $(SELECTORS.WEBVIEW_CONTINUEBUTTON_IOS).isEnabled() && 
        await $(SELECTORS.WEBVIEW_CONTINUEBUTTON_IOS).touchAction('tap');
      }
  
  }

  async unableToContinueToOTP(isWebView) {
      if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
        await expect(await $(SELECTORS.WEBVIEW_CONTINUEBUTTON_ANDROID)).toBeDisabled()
      } else {
        await expect(await $(SELECTORS.WEBVIEW_CONTINUEBUTTON_IOS)).toBeDisabled()
      }
  }

  async goBack() {
    if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
      await $(SELECTORS.BACK_ANDROID).waitForDisplayed({timeout: 1000}) && await $(SELECTORS.BACK_ANDROID).touchAction('tap')
    }  
    else {
      await $(SELECTORS.BACK_IOS).waitForDisplayed({timeout:1000}) && await $(SELECTORS.BACK_IOS).touchAction('tap');
    }
}

  async close() {
    if(JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android'){
      if((await $(SELECTORS.WEBVIEW_COUNTRYSELECT_ANDROID).isDisplayed()))
        await $(SELECTORS.WEBVIEW_CLOSEICON_ANDROID).waitForDisplayed({timeout: 10000}) 
        && await $(SELECTORS.WEBVIEW_CLOSEICON_ANDROID).touchAction('tap')
    }else{
      if((await $(SELECTORS.WEBVIEW_COUNTRYSELECT_IOS).isDisplayed()))
        await $(SELECTORS.WEBVIEW_CLOSEICON_IOS).waitForDisplayed({timeout: 10000}) 
        && await $(SELECTORS.WEBVIEW_CLOSEICON_IOS).touchAction('tap')
    }
  }

  async verifyErrorMessage() {
       if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
        await expect (await $(SELECTORS.WEBVIEW_ERRMSG_INCORRECTNUMBER_ANDROID)).toBeDisplayed()
       } else {
        await expect (await $(SELECTORS.WEBVIEW_ERRMSG_INCORRECTNUMBER_IOS)).toBeDisplayed()
       }
   
  }

  async verifyNumberOfDigits(numberOfDigits){
   // if (!isWebView) {
      
        if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
          await $(SELECTORS.PHONENUMBERINPUTVIEWGROUP_ANDROID).waitForDisplayed({timeout:10000});
          await $(SELECTORS.PHONENUMBERINPUTVIEWGROUP_ANDROID).touchAction('tap');
          await expect(await $(`//*[@text='Enter a ${numberOfDigits}-digit mobile number to continue']`)).toBeDisplayed();
          } else {
          await $(SELECTORS.PHONENUMBERINPUT_IOS).waitForDisplayed({timeout:10000});
          await $(SELECTORS.PHONENUMBERINPUT_IOS).touchAction('tap');
          await expect(await $(`//XCUIElementTypeStaticText[@name='Enter a ${numberOfDigits}-digit mobile number to continue']`)).toBeDisplayed();
        
        }
    
  }

  async slideToCountry(countryFlagName,app){
      if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
        const startAndEndX = (await $(SELECTORS.DEVICE_WINDOW_ANDROID).getSize('width'))/2;
        const startY =  (await $(SELECTORS.DEVICE_WINDOW_ANDROID).getSize('height'))/2;
        const endY = startY*0.5;
            while( !(await $(`//*[contains(@text,'${countryFlagName}')]`).isDisplayed()) ){
              await browser.touchAction([
                {action:'longPress', x:startAndEndX, y:startY},
                {action:'moveTo', x:startAndEndX, y:endY},
                'release'])
            }
      }else{
        const startAndEndX = (await $(SELECTORS.DEVICE_WINDOW_IOS).getSize('width'))/2;
        const startY =  (await $(SELECTORS.DEVICE_WINDOW_IOS).getSize('height'))/2;
        const endY = startY*0.5;
        while( !(await $(`//XCUIElementTypeStaticText[@name='${countryFlagName}']`).isDisplayed())){
        await browser.touchAction([
          {action:'longPress', x:startAndEndX, y:startY},
          {action:'moveTo', x:startAndEndX, y:endY},
          'release'])
        }
      }    
}

async deleteConsents(userIdentity, APIkey='39825c4b-20f3-4715-b8e9-26e5451e1a19'){
  let options = {
    method: 'DELETE',
    url: `https://consent-service.stage.apac.yaradigitallabs.io/v1/consent/guest-consents/${userIdentity}`, 
    headers: 
    { 
      'x-api-key': APIkey
    },
  };
  try {
    const result = await axios.request(options);
    const userData = result.data[0];
    console.log(`User ${userIdentity} consents is deleted`)
  } catch (error) {
    console.log('ERROR WHILE DELETE USER ====>', error);
  }
}

async createConsentsByPhoneNumber(phoneNumber, APIkey='39825c4b-20f3-4715-b8e9-26e5451e1a19'){
  const response = await axios.post(
    'https://consent-service.stage.apac.yaradigitallabs.io/v1/consent/guest-consents',
    {
        'phoneNumber': phoneNumber,
        'email': '',
        'bundleId': '37ea1658-6bab-4441-a79e-294e899d3866',
        'agree': true
    },
    {
        headers: {
            'accept': 'application/json',
            'x-api-key': APIkey,
            'Content-Type': 'application/json'
        }
    }
).then(function (response) {
  console.log(`User ${phoneNumber} consents is created`)
  console.log(response);
}).catch(function (error) {
  console.log(error);
})
}

async createConsentsByEmail(email='', phoneNumber='', APIkey='39825c4b-20f3-4715-b8e9-26e5451e1a19'){
  const response = await axios.post(
    'https://consent-service.stage.apac.yaradigitallabs.io/v1/consent/guest-consents',
    {
        'phoneNumber': phoneNumber,
        'email': email,
        'bundleId': '37ea1658-6bab-4441-a79e-294e899d3866',
        'agree': true
    },
    {
        headers: {
            'accept': 'application/json',
            'x-api-key': APIkey,
            'Content-Type': 'application/json'
        }
    }
).then(function (response) {
  console.log(`User ${email} consents is created`)
  console.log(response);
}).catch(function (error) {
  console.log(error);
})
}


async selectEmailLogin(){
  if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
    await $(SELECTORS.WEBVIEW_EMAIL_LOGIN_ANDROID).waitForDisplayed();
    await $(SELECTORS.WEBVIEW_EMAIL_LOGIN_ANDROID).touchAction('tap');
  } else{
    await $(SELECTORS.WEBVIEW_EMAIL_LOGIN_IOS).waitForDisplayed();
    await $(SELECTORS.WEBVIEW_EMAIL_LOGIN_IOS).touchAction('tap'); 
  }
}

async verifyEmailInput(){
  if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
    await expect ($(SELECTORS.WEBVIEW_EMAILINPUT_ANDROID)).toBeDisplayed()
  } else{
    expect (await $(SELECTORS.WEBVIEW_EMAILINPUT_IOS).getValue()).toEqual('example@mail.com');
  }
}

async verifyMobileNumberInput(){
  if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
    await expect ($(SELECTORS.WEBVIEW_PHONENUMBERINPUT_MXP_ANDROID)).toBeDisplayed()
  } else{
    expect (await $(SELECTORS.WEBVIEW_PHONENUMBERINPUT_MXP_IOS).getValue()).toEqual('Mobile number');
  }
}

async selectMobileNumberLogin(){
  if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
    await $(SELECTORS.WEBVIEW_MOBILE_NUMBER_LOGIN_ANDROID).waitForDisplayed();
    await $(SELECTORS.WEBVIEW_MOBILE_NUMBER_LOGIN_ANDROID).touchAction('tap'); 
  } else{
    await $(SELECTORS.WEBVIEW_MOBILE_NUMBER_LOGIN_IOS).waitForDisplayed();
    await $(SELECTORS.WEBVIEW_MOBILE_NUMBER_LOGIN_IOS).touchAction('tap'); 
  }
}

async enterEmail(email:string) {
  if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
    await $(SELECTORS.WEBVIEW_EMAILINPUT_ANDROID).waitForDisplayed();
    await $(SELECTORS.WEBVIEW_EMAILINPUT_ANDROID).touchAction('tap');
    await $(SELECTORS.WEBVIEW_EMAILINPUT_ANDROID).setValue(email);
  } else{
    await $(SELECTORS.WEBVIEW_EMAILINPUT_IOS).waitForDisplayed();
    await $(SELECTORS.WEBVIEW_EMAILINPUT_IOS).touchAction('tap');
    await $(SELECTORS.WEBVIEW_EMAILINPUT_IOS).setValue(email);
    await $(SELECTORS.DONE).touchAction('tap');
  }
}

async verifyIsAbleToContinue() {
    if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
      await expect ($(SELECTORS.WEBVIEW_CONTINUEBUTTON_MXP_ANDROID)).toBeEnabled()
    } else {
      await expect ($(SELECTORS.WEBVIEW_CONTINUEBUTTON_MXP_IOS)).toBeEnabled()
    }    
}

async verifyEmailErrorMessage() {
  if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
    expect (await $(SELECTORS.WEBVIEW_EMAIL_ERROR_ANDROID)).toBeDisplayed()
  } else {
    expect (await $(SELECTORS.WEBVIEW_EMAIL_ERROR_IOS)).toBeDisplayed()
  }    
}


async continue() {
      if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
        await $(SELECTORS.WEBVIEW_CONTINUEBUTTON_MXP_ANDROID).waitForDisplayed({timeout:10000}) &&
        await $(SELECTORS.WEBVIEW_CONTINUEBUTTON_MXP_ANDROID).touchAction('tap');
      } else {
        await $(SELECTORS.WEBVIEW_CONTINUEBUTTON_MXP_IOS).waitForDisplayed({timeout:10000}) &&
        await $(SELECTORS.WEBVIEW_CONTINUEBUTTON_MXP_IOS).touchAction('tap');
      } 
      
}

async goBackEmailLogin() {
  if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android')
  {
    await browser.touchAction([
      {action:'tap', x:400, y:400},
    ])
    await $(SELECTORS.WEBVIEW_BACKICON_MXP_ANDROID).waitForDisplayed({timeout:10000}) && 
    await $(SELECTORS.WEBVIEW_BACKICON_MXP_ANDROID).touchAction('tap');
  } else {  
    await $(SELECTORS.WEBVIEW_BACKICON_MXP_IOS).waitForDisplayed({timeout: 10000}) && 
    await $(SELECTORS.WEBVIEW_BACKICON_MXP_IOS).touchAction('tap');
  }
}
  
  open() {
    return super.open('login');
  }
}

export default new LoginPage();
