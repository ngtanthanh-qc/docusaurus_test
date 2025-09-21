# Gatling Performance Testing

[Gatling](https://gatling.io/) is a powerful performance testing tool designed for high-performance load testing of web applications and APIs.

## 🎯 Why Gatling?

- **High Performance** - Can simulate thousands of users
- **Scala-based** - But easy to use without Scala knowledge
- **Real-time Monitoring** - Live metrics during test execution
- **Beautiful Reports** - Rich HTML reports with charts
- **CI/CD Integration** - Easy integration with build pipelines

## 📦 Installation

### Option 1: Standalone Bundle
Download from [Gatling Downloads](https://gatling.io/download/)

### Option 2: Maven Integration
Add to your `pom.xml`:

```xml
<plugin>
    <groupId>io.gatling</groupId>
    <artifactId>gatling-maven-plugin</artifactId>
    <version>4.3.7</version>
</plugin>
```

## 🚀 Your First Gatling Test

Create `BasicSimulation.scala`:

```scala
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._

class BasicSimulation extends Simulation {

  val httpProtocol = http
    .baseUrl("https://jsonplaceholder.typicode.com")
    .acceptHeader("application/json")

  val scn = scenario("Basic API Test")
    .exec(
      http("Get Users")
        .get("/users")
        .check(status.is(200))
    )
    .pause(1)
    .exec(
      http("Get Posts")
        .get("/posts")
        .check(status.is(200))
        .check(jsonPath("$[0].title").exists)
    )

  setUp(
    scn.inject(
      atOnceUsers(10),           // 10 users at once
      rampUsers(50) during (30.seconds)  // 50 users over 30 seconds
    )
  ).protocols(httpProtocol)
}
```

## 🔧 Advanced Features

### Load Patterns
```scala
setUp(
  scn.inject(
    nothingFor(4.seconds),                    // Wait 4 seconds
    atOnceUsers(10),                          // 10 users immediately
    rampUsers(50) during (30.seconds),        // Ramp up 50 users over 30s
    constantUsersPerSec(20) during (60.seconds), // Constant rate
    heavisideUsers(1000) during (20.seconds)  // Gradual ramp
  )
)
```

### Data Feeders
```scala
val userFeeder = csv("users.csv").random

val scn = scenario("User Creation")
  .feed(userFeeder)
  .exec(
    http("Create User")
      .post("/users")
      .body(StringBody("""{"name": "${name}", "email": "${email}"}"""))
      .header("Content-Type", "application/json")
  )
```

### Assertions
```scala
setUp(scn.inject(rampUsers(100) during (60.seconds)))
  .protocols(httpProtocol)
  .assertions(
    global.responseTime.max.lt(2000),        // Max response time < 2s
    global.responseTime.mean.lt(500),        // Mean response time < 500ms
    global.successfulRequests.percent.gt(95) // Success rate > 95%
  )
```

## 📊 Running Tests

### Command Line
```bash
# Run all simulations
./bin/gatling.sh

# Run specific simulation  
./bin/gatling.sh -s com.example.BasicSimulation
```

### Maven
```bash
mvn gatling:test
```

## 📈 Reports & Analysis

Gatling generates detailed HTML reports including:

- **Timeline** - Request distribution over time
- **Response Time Distribution** - Percentiles and histogram
- **Active Users** - Concurrent user count
- **Requests per Second** - Throughput metrics

Reports location: `results/simulation-timestamp/index.html`

## 🔍 Monitoring & Debugging

### Real-time Monitoring
```scala
// Add during simulation
.exec { session =>
  println(s"User ${session.userId}: Current response time trend")
  session
}
```

### Detailed Logging
```scala
val httpProtocol = http
  .baseUrl("https://api.example.com")
  .header("Accept", "application/json")
  .logLevel(Trace)  // Enable detailed logging
```

## 🚀 Best Practices

1. **Start Small** - Begin with few users, gradually increase
2. **Monitor Resources** - Watch CPU, memory on test machine
3. **Realistic Data** - Use production-like test data
4. **Think Time** - Add pauses to simulate real user behavior
5. **Environment Isolation** - Use dedicated test environment

## 🎓 Next Steps

- [Karate + Gatling Integration](./karate-gatling-integration)
- [API Security Testing](./api-security-testing)
- [CI/CD Performance Testing](../cicd-devops/performance-cicd)

---

*Load test like a pro! 🚀*