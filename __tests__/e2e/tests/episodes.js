const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Episodes': function (browser) {
    browser
      .click('div a[href="/episodes"] div')
      .waitForElementWithText('.app-main-wrapper main div p', 'episodes!!!')

  },
  after: function (browser) {
    browser.end()
  }
}
