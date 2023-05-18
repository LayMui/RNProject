import Page from './page';
import { config } from '../../../config/wdio.conf'
import { Selected } from '@serenity-js/web';
import { setTimeout } from 'timers/promises';

/**
 * sub page containing specific selectors and methods for a specific page
 */


const SELECTORS = {
  // Using accessibilityLabel and testID
  LOGIN: '~login',
  FORCE_LOGIN: '~forceLogin',
  LOGOUT: '~logOut',
  DEVICE_WINDOW_ANDROID: '/hierarchy/android.widget.FrameLayout',
  DEVICE_WINDOW_IOS: '//XCUIElementTypeWindow',
  PICKER_UPBUTTON_IOS: '//XCUIElementTypeOther[@name="input_accessory_view"]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]',
  PICKER_DOWNBUTTON_IOS: '//XCUIElementTypeOther[@name="picker_item"]',
  PICKERWHEEL_DONE: '~done_button',


  // Need to use xpath on Browserstack devices

  // IOS
  LANGINPUT_IOS: '(//XCUIElementTypeOther[@name="langInput"])',
  ENVINPUT_IOS: '(//XCUIElementTypeOther[@name="envInput"])',
  REGIONINPUT_IOS: '(//XCUIElementTypeOther[@name="regionInput"])',
  APPINPUT_IOS: '(//XCUIElementTypeOther[@name="appInput"])',
  PICKER_IOS: '//XCUIElementTypePickerWheel',
 
  // ANDROID
 LANGINPUT_ANDROID: '//android.view.ViewGroup[@content-desc="langInput"]/android.view.ViewGroup[1]',
 ENVINPUT_ANDROID:'//android.view.ViewGroup[@content-desc="envInput"]/android.view.ViewGroup[1]',
 REGIONINPUT_ANDROID: '//android.view.ViewGroup[@content-desc="regionInput"]/android.view.ViewGroup[1]',
 APPINPUT_ANDROID:'//android.view.ViewGroup[@content-desc="appInput"]/android.view.ViewGroup[1]',
 SELECT_LISTVIEW_ANDROID: '//android.view.ViewGroup/android.widget.ScrollView',

  // IOS
 EMBEDDED_IOS:'(//XCUIElementTypeButton[@name="embedded"])',
 FORCE_LOGIN_VIA_BROWSER_IOS: '(//XCUIElementTypeButton[@name="forceLoginViaBrowser"])',
 FORCE_LOGOUT_VIA_BROWSER_IOS: '(//XCUIElementTypeButton[@name="logoutViaBrowser"])',
 LOGIN_IOS: '(//XCUIElementTypeButton[@name="login"])',
 FORCE_LOGIN_IOS: '(//XCUIElementTypeButton[@name="forceLogin"])',
 LOGOUT_IOS: '//XCUIElementTypeButton[@name="logOut"]',
 ENABLE_INNER_SKIP_LOGIN_IOS: '(//XCUIElementTypeOther[@name="enableInnerSkipLogin"])[2]',
 ENABLE_SKIP_LOGIN_IOS: '(//XCUIElementTypeOther[@name="enableSkipLogin"])[2]',
 

 // ANDROID
  EMBEDDED_ANDROID:'//android.widget.Button[@content-desc="embedded"]',
  FORCE_LOGIN_VIA_BROWSER_ANDROID: '//android.widget.Button[@content-desc="forceLoginViaBrowser"]',
  FORCE_LOGOUT_VIA_BROWSER_ANDROID: '//android.widget.Button[@content-desc="logoutViaBrowser"]',
  LOGIN_ANDROID: '//android.widget.Button[@content-desc="login"]',
  FORCE_LOGIN_ANDROID: '//android.widget.Button[@content-desc="forceLogin"]',
  LOGOUT_ANDROID: '//android.widget.Button[@content-desc="logOut"]',
  ENABLE_INNER_SKIP_LOGIN_ANDROID: '//android.widget.CheckBox[@content-desc="enableInnerSkipLogin"]',
  ENABLE_SKIP_LOGIN_ANDROID : '//android.widget.CheckBox[@content-desc="enableSkipLogin"]',
  
};

class HomePage extends Page {

  setSessionID() {
    process.env['BROWSERSTACK_SESSIONID'] = driver.sessionId
    console.log('BROWSERSTACK_SESSIONID:' + process.env.BROWSERSTACK_SESSIONID)
  }
  
  async setupSkipLogin(isEnable){
    if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
     if(isEnable === 'normal'){
        if (await $(SELECTORS.ENABLE_INNER_SKIP_LOGIN_ANDROID).getAttribute("checked") == 'true' )
          await (await $(SELECTORS.ENABLE_INNER_SKIP_LOGIN_ANDROID)).touchAction('tap');
        if (await $(SELECTORS.ENABLE_SKIP_LOGIN_ANDROID).getAttribute("checked") == 'false')
          await (await $(SELECTORS.ENABLE_SKIP_LOGIN_ANDROID)).touchAction('tap');
      } else if(isEnable==='empty'){
        if (await $(SELECTORS.ENABLE_INNER_SKIP_LOGIN_ANDROID).getAttribute("checked") == 'false' )
          await $(SELECTORS.ENABLE_INNER_SKIP_LOGIN_ANDROID).touchAction('tap');
        if (await $(SELECTORS.ENABLE_SKIP_LOGIN_ANDROID).getAttribute("checked") == 'false' )
          await (await $(SELECTORS.ENABLE_SKIP_LOGIN_ANDROID)).touchAction('tap');
      }
     } else {
      if(isEnable === 'normal'){
        if ((await $(SELECTORS.ENABLE_INNER_SKIP_LOGIN_IOS).getAttribute("value")).split(" ").pop() == "on")
        {
          await browser.touchAction({
            action:'tap',
            x: await (await $(SELECTORS.ENABLE_INNER_SKIP_LOGIN_IOS)).getLocation('x'),
            y: await (await $(SELECTORS.ENABLE_INNER_SKIP_LOGIN_IOS)).getLocation('y'),
           })
        }
        if ((await $(SELECTORS.ENABLE_SKIP_LOGIN_IOS).getAttribute("value")).split(" ").pop() == "off")
        {
          await browser.touchAction({
            action:'tap',
            x: await (await $(SELECTORS.ENABLE_SKIP_LOGIN_IOS)).getLocation('x'),
            y: await (await $(SELECTORS.ENABLE_SKIP_LOGIN_IOS)).getLocation('y'),
           })
        }
      } else if(isEnable === 'empty'){
        if ((await $(SELECTORS.ENABLE_INNER_SKIP_LOGIN_IOS).getAttribute("value")).split(" ").pop() == "off")
        {
          await browser.touchAction({
            action:'tap',
            x: await (await $(SELECTORS.ENABLE_INNER_SKIP_LOGIN_IOS)).getLocation('x'),
            y: await (await $(SELECTORS.ENABLE_INNER_SKIP_LOGIN_IOS)).getLocation('y'),
           })
        }
        if ((await $(SELECTORS.ENABLE_SKIP_LOGIN_IOS).getAttribute("value")).split(" ").pop() == "off")
        {
          await browser.touchAction({
            action:'tap',
            x: await (await $(SELECTORS.ENABLE_SKIP_LOGIN_IOS)).getLocation('x'),
            y: await (await $(SELECTORS.ENABLE_SKIP_LOGIN_IOS)).getLocation('y'),
           })
        }
      }
  }
}

  async selectEmbeddedLogin() {
    this.setSessionID()
    if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
     (await $(SELECTORS.EMBEDDED_ANDROID).waitForDisplayed({timeout:10000})) &&
      (await $(SELECTORS.EMBEDDED_ANDROID).touchAction('tap'));
    }
    else {
      (await $(SELECTORS.EMBEDDED_IOS).waitForDisplayed({timeout:10000})) &&
      (await $(SELECTORS.EMBEDDED_IOS).touchAction('tap'));
    }
  }

  async webViewLogin() {
    this.setSessionID()
    if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
      await $(SELECTORS.LOGIN_ANDROID).waitForDisplayed({timeout:100000}) &&
      await $(SELECTORS.LOGIN_ANDROID).touchAction('tap');
    } else {
      await $(SELECTORS.LOGIN_IOS).waitForDisplayed({timeout:100000}) &&
        await $(SELECTORS.LOGIN_IOS).touchAction('tap');
    }
  }


  async selectWebViewLang(lang) {
    if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
      await this.slideToValue($(SELECTORS.LANGINPUT_ANDROID), "es", lang); 
    } 
    else {
      await this.slideToValue($(SELECTORS.LANGINPUT_IOS), "es", lang); 
    }
  }

  async selectWebViewEnv(env) {
    if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
      await this.slideToValue($(SELECTORS.ENVINPUT_ANDROID), "debug", env); 
     } 
     else {
      await this.slideToValue($(SELECTORS.ENVINPUT_IOS), "debug", env); 
     }
  }

 
  async selectWebViewRegion(region) {
    if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
      await this.slideToValue($(SELECTORS.REGIONINPUT_ANDROID), "kenya", region); 
    } 
    else {
      await this.slideToValue($(SELECTORS.REGIONINPUT_IOS), "kenya", region); 
    }
  }

  async selectWebViewApps(app) {
    if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
      await this.slideToValue($(SELECTORS.APPINPUT_ANDROID), "farmCare", app); 
    } 
    else {
      await this.slideToValue($(SELECTORS.APPINPUT_IOS), "farmCare", app); 
    }
  }

  
  async selectWebViewLangEnvRegionApp(lang="en", env="debug", region="india", app="farmCare") {
   await this.selectWebViewLang(lang)
   await this.selectWebViewEnv(env)
   await this.selectWebViewRegion(region)
   await this.selectWebViewApps(app)

  }

  async selectLogout() {
    if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
    (await $(SELECTORS.LOGOUT_ANDROID).waitForDisplayed({timeout:100000})) &&
      (await $(SELECTORS.LOGOUT_ANDROID).touchAction('tap'));
    } else {
      (await $(SELECTORS.LOGOUT_IOS).waitForDisplayed({timeout:100000})) &&
      (await $(SELECTORS.LOGOUT_IOS).touchAction('tap'));
    }
  }

  async verifyElements() {
    if (JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android') {
      expect (await $(SELECTORS.LOGIN_ANDROID)).toBeDisplayed();
      expect (await $(SELECTORS.APPINPUT_ANDROID)).toBeDisplayed();
    } else {
      expect (await $(SELECTORS.LOGIN_IOS)).toBeDisplayed();
      expect (await $(SELECTORS.APPINPUT_IOS)).toBeDisplayed();
    }
  }

  open() {
    return super.open('home');
  }

  async slideToValue(selector, firstValue, value){
    (await selector.waitForDisplayed({timeout:10000}) && await selector.touchAction('tap')); 
    if(JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android'){
      await $(SELECTORS.SELECT_LISTVIEW_ANDROID).waitForExist({timeout: 11000})
      const startAndEndX = (await $(SELECTORS.DEVICE_WINDOW_ANDROID).getSize('width'))/2;
      const startY =  (await $(SELECTORS.DEVICE_WINDOW_ANDROID).getSize('height'))/2;
      const endY = startY*0.75;
      while( !(await $(`${SELECTORS.SELECT_LISTVIEW_ANDROID}//*[@text='${value}']`).isDisplayed())){
        await browser.touchAction([
          {action:'longPress', x:startAndEndX, y:startY},
          {action:'moveTo', x:startAndEndX, y:endY},
          'release'])
      }
      await $(`${SELECTORS.SELECT_LISTVIEW_ANDROID}//*[@text='${value}']`).touchAction('tap');
    } 
    else 
    {
        (await $(SELECTORS.PICKER_IOS)).waitForDisplayed({timeout: 10000});
        if (value == await $(SELECTORS.PICKER_IOS).getValue()) {
          await $(SELECTORS.PICKERWHEEL_DONE).waitForDisplayed();
          await $(SELECTORS.PICKERWHEEL_DONE).touchAction('tap');
        } else {
          while (! await $(`//*[@value='${firstValue}']`).isDisplayed()) {
            await $(SELECTORS.PICKER_UPBUTTON_IOS).waitForDisplayed();
            await $(SELECTORS.PICKER_UPBUTTON_IOS).touchAction('tap');
          } 
          while( ! await $(`//*[@value='${value}']`).isDisplayed()) {
            await $(SELECTORS.PICKER_DOWNBUTTON_IOS).waitForDisplayed();
            await $(SELECTORS.PICKER_DOWNBUTTON_IOS).touchAction('tap');
          } 
          await $(`//*[@value='${value}']`).waitForDisplayed({timeout:10000}) &&
          await $(`//*[@value='${value}']`).touchAction('tap');
          await $(SELECTORS.PICKERWHEEL_DONE).waitForDisplayed({timeout:10000}) && 
          await $(SELECTORS.PICKERWHEEL_DONE).touchAction('tap');
        }
      }
    }
  }

export default new HomePage();
