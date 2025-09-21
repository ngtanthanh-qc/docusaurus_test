# Selenium WebDriver with Python

Selenium WebDriver is the most popular tool for automating web browsers. This guide covers everything you need to know to get started with Selenium using Python.

## 🎯 What is Selenium?

Selenium WebDriver allows you to:
- Automate browser interactions
- Test web applications across different browsers
- Create robust end-to-end tests
- Perform cross-browser testing

## 📦 Installation

### Install Selenium
```bash
pip install selenium
```

### Install WebDriver Manager (Recommended)
```bash
pip install webdriver-manager
```

### Browser Drivers
WebDriver Manager automatically handles driver downloads, but you can also manually download:
- **Chrome**: [ChromeDriver](https://chromedriver.chromium.org/)
- **Firefox**: [GeckoDriver](https://github.com/mozilla/geckodriver)
- **Edge**: [EdgeDriver](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/)

## 🚀 Your First Selenium Test

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

# Setup Chrome driver
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

try:
    # Navigate to page
    driver.get("https://example.com")
    
    # Find element and interact
    search_box = driver.find_element(By.NAME, "q")
    search_box.send_keys("Selenium testing")
    search_box.submit()
    
    # Wait for results
    wait = WebDriverWait(driver, 10)
    results = wait.until(
        EC.presence_of_element_located((By.ID, "search-results"))
    )
    
    print(f"Found {len(results.find_elements(By.TAG_NAME, 'div'))} results")
    
finally:
    driver.quit()
```

## 🔧 Element Location Strategies

### By ID (Most Reliable)
```python
element = driver.find_element(By.ID, "username")
```

### By CSS Selector
```python
element = driver.find_element(By.CSS_SELECTOR, ".btn-primary")
element = driver.find_element(By.CSS_SELECTOR, "input[type='email']")
```

### By XPath (Most Powerful)
```python
element = driver.find_element(By.XPATH, "//button[text()='Submit']")
element = driver.find_element(By.XPATH, "//input[@placeholder='Enter email']")
```

### By Class Name
```python
elements = driver.find_elements(By.CLASS_NAME, "menu-item")
```

## ⏰ Explicit Waits (Recommended)

```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

wait = WebDriverWait(driver, 10)

# Wait for element to be clickable
button = wait.until(EC.element_to_be_clickable((By.ID, "submit-btn")))

# Wait for element to be visible
element = wait.until(EC.visibility_of_element_located((By.ID, "result")))

# Wait for text to be present
wait.until(EC.text_to_be_present_in_element((By.ID, "status"), "Complete"))
```

## 🏗️ Page Object Model

### Base Page Class
```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 10)
    
    def find_element(self, locator):
        return self.wait.until(EC.presence_of_element_located(locator))
    
    def click(self, locator):
        element = self.wait.until(EC.element_to_be_clickable(locator))
        element.click()
    
    def send_keys(self, locator, text):
        element = self.find_element(locator)
        element.clear()
        element.send_keys(text)
```

### Page Class Example
```python
from selenium.webdriver.common.by import By

class LoginPage(BasePage):
    # Locators
    USERNAME_INPUT = (By.ID, "username")
    PASSWORD_INPUT = (By.ID, "password") 
    LOGIN_BUTTON = (By.CSS_SELECTOR, "button[type='submit']")
    ERROR_MESSAGE = (By.CLASS_NAME, "error-message")
    
    def login(self, username, password):
        self.send_keys(self.USERNAME_INPUT, username)
        self.send_keys(self.PASSWORD_INPUT, password)
        self.click(self.LOGIN_BUTTON)
    
    def get_error_message(self):
        return self.find_element(self.ERROR_MESSAGE).text
```

## 🧪 Test Framework Integration

### With PyTest
```python
import pytest
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

@pytest.fixture
def driver():
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    driver.maximize_window()
    yield driver
    driver.quit()

def test_login_success(driver):
    login_page = LoginPage(driver)
    driver.get("https://example.com/login")
    
    login_page.login("testuser", "password123")
    
    # Assert successful login
    assert "dashboard" in driver.current_url
```

### With unittest
```python
import unittest
from selenium import webdriver

class LoginTest(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
    
    def tearDown(self):
        self.driver.quit()
    
    def test_valid_login(self):
        # Test implementation
        pass

if __name__ == "__main__":
    unittest.main()
```

## 🛠️ Advanced Features

### Screenshot on Failure
```python
def take_screenshot(driver, test_name):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"screenshots/{test_name}_{timestamp}.png"
    driver.save_screenshot(filename)
    return filename
```

### Handling Multiple Windows
```python
# Switch to new window
driver.switch_to.window(driver.window_handles[-1])

# Switch back to main window
driver.switch_to.window(driver.window_handles[0])
```

### Working with Frames
```python
# Switch to frame by name/id
driver.switch_to.frame("frame_name")

# Switch to frame by element
frame_element = driver.find_element(By.TAG_NAME, "iframe")
driver.switch_to.frame(frame_element)

# Switch back to default content
driver.switch_to.default_content()
```

## 🎓 Best Practices

1. **Use Page Object Model** - Maintain clean, reusable code
2. **Explicit Waits** - Always use explicit waits over implicit/time.sleep()
3. **Unique Locators** - Prefer ID > CSS Selector > XPath
4. **Error Handling** - Always use try/finally for driver cleanup
5. **Screenshots** - Capture screenshots on test failures
6. **Data-Driven Tests** - Use external data sources for test inputs

## 🎓 Next Steps

- [Robot Framework Guide](./robot-framework-guide)
- [Appium Mobile Testing](./appium-mobile-testing)
- [Visual Testing Strategies](./visual-testing)

---

*Automate all the things! 🤖*