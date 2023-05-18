import Page from './page';
import { config } from '../../../config/wdio.conf'
/**
 * sub page containing specific selectors and methods for a specific page
 */

const SELECTORS = {

  // IOS
  INPUTFIELD_IOS: '//XCUIElementTypeTextField[@name="inputField"]',
  INPUTVALUE_IOS: '//XCUIElementTypeTextField[@name="inputValue"]',
  GETTOKEN_IOS: '//XCUIElementTypeButton[@name="getToken"]',
  UPDATE_IOS: '//XCUIElementTypeButton[@name="updateBtn"]',
  LOGOUT_IOS: '//XCUIElementTypeButton[@name="logoutBtn"]',

  // ANDROID
  INPUTFIELD_ANDROID: '//android.widget.EditText[@content-desc="inputField"]',
  INPUTVALUE_ANDROID: '//android.widget.EditText[@content-desc="inputValue"]',
  GETTOKEN_ANDROID: '//android.widget.Button[@content-desc="getToken"]/android.widget.TextView',
  UPDATE_ANDROID: '//android.widget.Button[@content-desc="updateBtn"]/android.widget.TextView',
  LOGOUT_ANDROID: '//android.widget.Button[@content-desc="logoutBtn"]/android.widget.TextView',
};

class LogoutPage extends Page {
  
  async logout() {
    JSON.parse(JSON.stringify(config.capabilities))[0].platformName === 'Android'
    ? await $(SELECTORS.LOGOUT_ANDROID).waitForDisplayed({timeout:100000}) && await $(SELECTORS.LOGOUT_ANDROID).touchAction('tap')
    : await $(SELECTORS.LOGOUT_IOS).waitForDisplayed({timeout:100000}) && await $(SELECTORS.LOGOUT_IOS).touchAction('tap');
  }

  /**
   * overwrite specifc options to adapt it to page object
   */
  open() {
    return super.open('logout');
  }
}

export default new LogoutPage();
