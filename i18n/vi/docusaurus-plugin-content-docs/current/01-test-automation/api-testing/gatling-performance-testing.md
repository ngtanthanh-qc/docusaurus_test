# Kiểm tra hiệu suất Gatling

[Gatling] (https://gatling.io/) là một công cụ kiểm tra hiệu suất mạnh mẽ được thiết kế để kiểm tra tải hiệu suất cao của các ứng dụng web và API.

## Tại sao phải gatling?

- ** Hiệu suất cao ** - Có thể mô phỏng hàng ngàn người dùng
- ** dựa trên scala ** - nhưng dễ sử dụng mà không có kiến ​​thức scala
- ** Giám sát thời gian thực ** - Số liệu trực tiếp trong khi thực hiện kiểm tra
- ** Báo cáo đẹp ** - Báo cáo HTML phong phú với biểu đồ
- ** Tích hợp CI/CD ** - Tích hợp dễ dàng với các đường ống xây dựng

## Cài đặt

### Tùy chọn 1: Gói độc lập
Tải xuống từ [Tải xuống Gatling] (https://gatling.io/doad/)

### Tùy chọn 2: Tích hợp Maven
Thêm vào `pom.xml` của bạn:

```xml
<plugin>
    <groupId>io.gatling</groupId>
    <artifactId>gatling-maven-plugin</artifactId>
    <version>4.3.7</version>
</plugin>
```

## 🚀 Bài kiểm tra đầu tiên của bạn

Tạo `cơ bản .Scala`:

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

## Các tính năng nâng cao

### Các mẫu tải
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

### nguồn cấp dữ liệu
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

### Asserions
```scala
setUp(scn.inject(rampUsers(100) during (60.seconds)))
  .protocols(httpProtocol)
  .assertions(
    global.responseTime.max.lt(2000),        // Max response time < 2s
    global.responseTime.mean.lt(500),        // Mean response time < 500ms
    global.successfulRequests.percent.gt(95) // Success rate > 95%
  )
```

## 📊 Kiểm tra chạy

### Dòng lệnh
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

## Báo cáo & phân tích

Gatling tạo ra các báo cáo HTML chi tiết bao gồm:

- ** Dòng thời gian ** - Yêu cầu phân phối theo thời gian
- ** Phân phối thời gian phản hồi ** - Tỷ lệ phần trăm và biểu đồ
- ** Người dùng đang hoạt động ** - Số lượng người dùng đồng thời
- ** Yêu cầu mỗi giây ** - Số liệu thông lượng

Báo cáo Vị trí: `Kết quả/Mô phỏng thời gian thời gian/index.html`

## Giám sát và gỡ lỗi

### Giám sát thời gian thực
```scala
// Add during simulation
.exec { session =>
  println(s"User ${session.userId}: Current response time trend")
  session
}
```

### Ghi nhật ký chi tiết
```scala
val httpProtocol = http
  .baseUrl("https://api.example.com")
  .header("Accept", "application/json")
  .logLevel(Trace)  // Enable detailed logging
```

## 🚀 Thực hành tốt nhất

1. ** Bắt đầu nhỏ ** - Bắt đầu với một vài người dùng, tăng dần
2. ** Tài nguyên giám sát ** - Xem CPU, bộ nhớ trên máy kiểm tra
3. ** Dữ liệu thực tế ** - Sử dụng dữ liệu thử nghiệm giống như sản xuất
4. ** Nghĩ thời gian ** - Thêm tạm dừng để mô phỏng hành vi người dùng thực
5. ** Phân lập môi trường ** - Sử dụng môi trường thử nghiệm chuyên dụng

## 🎓 Các bước tiếp theo

-[Karate + Gatling tích hợp] (./ tích hợp Karate-Gatling)
-[Kiểm tra bảo mật API] (./ Testing API-Security)
-[Kiểm tra hiệu suất CI/CD] (../ CICD-DEVOPS/Hiệu suất-CICD)

---

*Tải thử như một pro!🚀*