# Karate API Testing - Getting Started

[Karate](https://github.com/karatelabs/karate) is a powerful open-source tool for API testing that combines API testing, mocking, and performance testing in a single framework.

## 🎯 Why Karate?

- **No Java/Programming Knowledge Required** - Uses Gherkin syntax
- **Built-in JSON/XML Support** - Native data handling
- **Powerful Assertions** - Rich assertion capabilities  
- **Test Reports** - Cucumber-style HTML reports
- **Performance Testing** - Built-in Gatling integration

## 📦 Installation

### Prerequisites
- Java 8+ installed
- Maven or Gradle

### Maven Setup

Add to your `pom.xml`:

```xml
<dependency>
    <groupId>com.intuit.karate</groupId>
    <artifactId>karate-junit5</artifactId>
    <version>1.4.1</version>
    <scope>test</scope>
</dependency>
```

## 🚀 Your First Karate Test

Create a feature file `users.feature`:

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

## 🔧 Key Features

### JSON Path & Assertions
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

### Data-Driven Testing
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

## 📊 Test Execution

### Run with Maven
```bash
mvn test
```

### Run specific features
```bash
mvn test -Dkarate.options="--tags @smoke"
```

## 📈 Reports

Karate generates beautiful HTML reports at:
```
target/karate-reports/karate-summary.html
```

## 🎓 Next Steps

- [Advanced Karate Features](./karate-advanced)
- [API Security Testing](./api-security-testing)
- [Performance Testing with Gatling](./gatling-performance-testing)

---

*Master API testing with Karate! 🥋*