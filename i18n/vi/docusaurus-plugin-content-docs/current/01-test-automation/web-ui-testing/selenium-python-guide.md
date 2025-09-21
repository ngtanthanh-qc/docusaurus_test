# Selenium webdriver với Python

Selenium WebDriver là công cụ phổ biến nhất để tự động hóa các trình duyệt web.Hướng dẫn này bao gồm mọi thứ bạn cần biết để bắt đầu với Selenium bằng Python.

## Selenium là gì?

Selenium WebDriver cho phép bạn:
- Tự động hóa các tương tác trình duyệt
- Kiểm tra các ứng dụng web trên các trình duyệt khác nhau
-Tạo các bài kiểm tra từ đầu đến cuối mạnh mẽ
- Thực hiện kiểm tra trình duyệt chéo

## Cài đặt

### Cài đặt selen
```bash
pip install selenium
```

### Cài đặt Trình quản lý WebDriver (được đề xuất)
```bash
pip install webdriver-manager
```

### Trình điều khiển trình duyệt
Trình quản lý WebDriver tự động xử lý tải xuống trình điều khiển, nhưng bạn cũng có thể tải xuống thủ công:
- ** Chrome **: [Chromedriver] (https://chromedriver.chromium.org/)
- ** Firefox **: [Geckodriver] (https://github.com/mozilla/geckodriver)
-** Edge **: [Edgedriver] (https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/)

## 🚀 Bài kiểm tra selen đầu tiên của bạn

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

## 🔧 Chiến lược vị trí nguyên tố

### bằng ID (đáng tin cậy nhất)
```python
element = driver.find_element(By.ID, "username")
```

### bởi bộ chọn CSS
```python
element = driver.find_element(By.CSS_SELECTOR, ".btn-primary")
element = driver.find_element(By.CSS_SELECTOR, "input[type='email']")
```

### bởi xpath (mạnh nhất)
```python
element = driver.find_element(By.XPATH, "//button[text()='Submit']")
element = driver.find_element(By.XPATH, "//input[@placeholder='Enter email']")
```

### theo tên lớp
```python
elements = driver.find_elements(By.CLASS_NAME, "menu-item")
```

## ⏰ Chờ đợi rõ ràng (được đề xuất)

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

## Mô hình đối tượng trang

### Lớp trang cơ sở
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

### Ví dụ về lớp trang
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

## Tích hợp khung kiểm tra

### với pytest
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

### với Unittest
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

## Các tính năng nâng cao

### Ảnh chụp màn hình về thất bại
```python
def take_screenshot(driver, test_name):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"screenshots/{test_name}_{timestamp}.png"
    driver.save_screenshot(filename)
    return filename
```

### Xử lý nhiều cửa sổ
```python
# Switch to new window
driver.switch_to.window(driver.window_handles[-1])

# Switch back to main window
driver.switch_to.window(driver.window_handles[0])
```

### Làm việc với các khung
```python
# Switch to frame by name/id
driver.switch_to.frame("frame_name")

# Switch to frame by element
frame_element = driver.find_element(By.TAG_NAME, "iframe")
driver.switch_to.frame(frame_element)

# Switch back to default content
driver.switch_to.default_content()
```

## 🎓 Thực hành tốt nhất

1. ** Sử dụng mô hình đối tượng trang ** - duy trì mã sạch, có thể sử dụng lại
2.
3.
4. ** Xử lý lỗi ** - Luôn sử dụng thử/Cuối cùng để dọn dẹp trình điều khiển
5. ** Ảnh chụp màn hình ** - chụp ảnh màn hình khi thất bại thử nghiệm
6. ** Kiểm tra dựa trên dữ liệu ** - Sử dụng các nguồn dữ liệu bên ngoài để đầu vào kiểm tra

## 🎓 Các bước tiếp theo

-[Hướng dẫn khung robot] (./
-[Kiểm tra di động Appium] (./ appium-mobile-testing)
- [Chiến lược kiểm tra trực quan] (./ Thử nghiệm trực quan)

---

*Tự động hóa tất cả mọi thứ!🤖*