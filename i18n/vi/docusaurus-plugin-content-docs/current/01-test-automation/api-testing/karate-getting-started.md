# Kiểm tra API Karate - Bắt đầu

.

## Tại sao karate?

- ** Không có kiến ​​thức Java/lập trình yêu cầu ** - Sử dụng cú pháp Gherkin
- ** Hỗ trợ JSON/XML tích hợp ** - Xử lý dữ liệu gốc
- ** Khẳng định mạnh mẽ ** - Khả năng khẳng định phong phú
- ** Báo cáo kiểm tra ** - Báo cáo HTML kiểu dưa chuột
- ** Kiểm tra hiệu suất ** - Tích hợp Gatling tích hợp

## Cài đặt

### Điều kiện tiên quyết
- Cài đặt Java 8+
- Maven hoặc Gradle

### Thiết lập Maven

Thêm vào `pom.xml` của bạn:

```xml
<dependency>
    <groupId>com.intuit.karate</groupId>
    <artifactId>karate-junit5</artifactId>
    <version>1.4.1</version>
    <scope>test</scope>
</dependency>
```

## 🚀 Bài kiểm tra karate đầu tiên của bạn

Tạo một tệp tính năng `user.feature`:

```gherkin
Feature: User API Testing

Background:
  * url 'https://jsonplaceholder.typicode.com'
  * header Accept = 'application/json'

Scenario: Get all users
  Given path 'users'
  When method get
  Then status 200
  And match response[0].name == '#string'
  And match response[0].email == '#string'

Scenario: Create a new user
  Given path 'users'
  And request { name: 'John Doe', email: 'john@example.com' }
  When method post
  Then status 201
  And match response.name == 'John Doe'
```

## Các tính năng chính

### Đường dẫn & xác nhận của JSON
```gherkin
# Simple assertions
Then match response.status == 'success'
Then match response.users[0].name == 'John'

# Schema validation
Then match response ==
"""
{
  "id": "#number",
  "name": "#string", 
  "active": "#boolean"
}
"""

# Array validation
Then match response.users == '#[3]'  # Array with 3 elements
```

### Kiểm tra dựa trên dữ liệu
```gherkin
Scenario Outline: Test multiple users
  Given path 'users/<id>'
  When method get
  Then status 200
  And match response.name == '<name>'

Examples:
  | id | name |
  | 1  | John |
  | 2  | Jane |
```

## 📊 Thực thi kiểm tra

### chạy với maven
```bash
mvn test
```

### chạy các tính năng cụ thể
```bash
mvn test -Dkarate.options="--tags @smoke"
```

## Báo cáo

Karate tạo ra các báo cáo HTML đẹp tại:
```
target/karate-reports/karate-summary.html
```

## 🎓 Các bước tiếp theo

- [Các tính năng karate nâng cao] (./ Karate-Advanced)
-[Kiểm tra bảo mật API] (./ Testing API-Security)
-

---

*Thử nghiệm API chính với Karate!🥋*