Business Need: Universal Login
  In order to have secured access the app services in webview on native app
  As a farmer James
  James want to able to verify using the One time password authentication method


  @universal @test
  Rule: Must able to get OTP when valid mobile number and country code is provided
  Scenario Outline: James is able to get a OTP by providing a valid mobile number and country code

    Given James is at the universal login for tenant "<app>" and "<region>" and "<env>" in lang "<lang>"
    When he select a country code "<countryFlagName>" and a valid mobile number "<mobileNumber>"
    Then he is able to perform OTP
  Examples:
    | lang | env     | region  | app      |  countryFlagName       | mobileNumber |
    | en   | local   | india   | farmGo | 🇺🇸 +1 United States    | 3854754186  |
    #| en   | local   | india   | mxpEurope   | 🇺🇸 +1 United States    | 3854754185   |
    # | en   | stage   | europe  | mxpEurope   | 🇺🇸 +1 United States    | 3854754187   |
    # | en   | preprod | europe  | mxpEurope   | 🇺🇸 +1 United States    | 3854754188   |

  @universal 
  Rule: Must not able to get OTP when invalid mobile numbenr and country code is provided 
  Example: James is unable to get OTP by providing an invalid mobile number 

    Given James is at the universal login
     | lang | env   | region | app    |
     | en   | local | india  | farmGo |
    When he select a country code and an invalid mobile number
    | countryFlagName      | mobileNumber   |
    | 🇺🇸 +1 United States  | 1111111111     |
    Then he see an error notification and not able to continue

  @universal 
  Rule: Must not able to continue without mobile number
  Example: James is unable to get OTP without mobile number

     Given James is at the universal login 
     | lang | env   | region | app    |
     | en   | local | india  | farmGo |
     When he select a country code but did not provide mobile number
       | countryFlagName     |
       | 🇺🇸 +1 United States  |
    Then he is not able to proceed

  @universal 
  Rule: Must not able to login when an invalid OTP is provided
  Example: James is unable to login with an invalid OTP

     Given James has provided a valid country code and a valid mobile number
      | lang | env   | region | app    | countryFlagName        | mobileNumber |
      | en   | local | india  | farmGo | 🇺🇸 +1 United States    | 3854754186   |
     When he provides OTP that is not valid
       | invalidOTP |
       | 11111      |
     Then he is not able to login

  @universal 
  Rule: Must not able to login when an expired OTP code is provided
  Scenario: James is unable to login with an expired OTP

     Given James has provided a valid country code and a valid mobile number
     | lang | env   | region  | app    | countryFlagName        | mobileNumber |
     | en   | local | india  | farmGo  | 🇺🇸 +1 United States    | 3854754186   |
     When he provides an expired OTP 
     Then he will see an error notification at the OTP
     
  @universal 
  Rule: Must able to resend new OTP after expire time
  Example: James is able to resend a new OTP after expiry time of 2 minutes

    Given James has provided a valid country code and a valid mobile number
     | lang | env   | region | app    | countryFlagName        | mobileNumber |
     | en   | local | india  | farmGo | 🇺🇸 +1 United States    | 3854754186   |
     When he resend a new OTP after expiry time of 2 minutes
     Then he is able to perform new OTP


  @universal
  Rule: Must able to abort the app when logging with the mobile number
  Example: James is able to abort after providing a valid country code and mobile number

    Given James has provided a valid country code and a valid mobile number
     | lang | env   | region | app    | countryFlagName        | mobileNumber |
     | en   | local | india  | farmGo | 🇺🇸 +1 United States    | 3854754186   |
    When he decides to abort after providing his mobile number
    Then he is able to abort at login

   @universal 
  Rule: Must able to abort the app without logging with the mobile number
  Example: James is able to abort before providing a valid country code and mobile number

    Given James has not provided a valid country code and a valid mobile number
     | lang | env   | region | app     | 
     | en   | local | india  | kasetGo |
    When he decides to abort after providing his mobile number
    Then he is able to abort at login
     
  @universal 
  Rule: Must be able to abort the app when providing the OTP
  Example: James is able to abort the app at OTP

    Given James has provided a valid country code and a valid mobile number
     | lang | env   | region | app    | countryFlagName        | mobileNumber |
     | en   | local | india  | farmGo | 🇺🇸 +1 United States    | 3854754186   |
    When he decides to abort after providing the OTP code
    Then he is able to abort at OTP

 
   
   
     
