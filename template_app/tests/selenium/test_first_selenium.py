''' first selenium test, mostly to make sure everything is setup right '''
from template_app.tests.selenium.base.base_pages import WelcomePage
from template_app.tests.selenium.base.base_tests import BaseUserSeleniumTest


class FirstTest(BaseUserSeleniumTest):
    ''' Class for making sure selenium works ok '''

    def test_first(self):
        ''' verify that selenium tests can happen '''
        welcome_page = WelcomePage(self.driver)
        welcome_page.navigate_and_load()
        self.assertEquals(welcome_page.login_disclaimer.get_text(),
                          "You must login to use this site")
        welcome_page.login_good(self.the_user['username'],
                                self.the_user['password'])
        welcome_page.new_cigarshop_widget.create_cigar_shop("Selenium created shop",
                                                            "39.999111", "-77.333444")
        welcome_page.new_cigarshop_widget.create_cigar_shop("Another Selenium created shop",
                                                            "38.888888", "-79.111222")
