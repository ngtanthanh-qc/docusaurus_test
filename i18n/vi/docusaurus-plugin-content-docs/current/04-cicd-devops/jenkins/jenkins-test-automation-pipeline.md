# Đường ống tự động thử nghiệm Jenkins

Jenkins là máy chủ tự động hóa nguồn mở hàng đầu để xây dựng đường ống CI/CD.Hướng dẫn này bao gồm việc thiết lập Jenkins để tự động hóa thử nghiệm với các khung thử nghiệm khác nhau.

## Tại sao Jenkins cho tự động hóa thử nghiệm?

- ** Đường ống làm mã ** - Phiên bản điều khiển đường ống CI/CD của bạn
- ** Hệ sinh thái plugin ** - Plugin rộng rãi cho các công cụ kiểm tra
- ** Thực thi song song ** - Chạy kiểm tra song song trên nhiều nút
- ** Báo cáo kiểm tra ** - Báo cáo và phân tích thử nghiệm phong phú
- ** Tích hợp ** - Tích hợp liền mạch với Git, Docker, nền tảng đám mây

## Thiết lập Jenkins

### Tùy chọn cài đặt

#### Docker (Khuyến nghị để phát triển)
```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts
```

#### Cài đặt gói (Ubuntu)
```bash
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt update
sudo apt install jenkins
```

### Thiết lập ban đầu
1. Điều hướng đến `http: // localhost: 8080`
2. Nhận mật khẩu quản trị ban đầu: `Docker Exec Jenkins CAT/VAR/JENKINS_HOME/Secrets/initaladminPassword`
3. Cài đặt các plugin được đề xuất
4. Tạo người dùng quản trị viên

## plugin thiết yếu để tự động hóa thử nghiệm

```bash
# Test Framework Plugins
- JUnit Plugin
- TestNG Results Plugin
- Robot Framework Plugin
- Karate Reports Plugin

# Build Tools
- Maven Integration Plugin
- Gradle Plugin
- NodeJS Plugin
- Python Plugin

# Version Control
- Git Plugin
- GitHub Plugin
- Bitbucket Plugin

# Reporting & Analytics
- HTML Publisher Plugin
- Allure Plugin
- Performance Plugin
- Blue Ocean (Modern UI)

# Notification
- Email Extension Plugin
- Slack Notification Plugin
- Microsoft Teams Plugin
```

## Jenkinsfile cho tự động hóa thử nghiệm

### Cấu trúc đường ống cơ bản

```groovy
pipeline {
    agent any
    
    environment {
        // Environment variables
        JAVA_HOME = '/usr/lib/jvm/java-11-openjdk'
        MAVEN_HOME = '/usr/share/maven'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/your-repo/test-automation.git'
            }
        }
        
        stage('Build') {
            steps {
                sh 'mvn clean compile'
            }
        }
        
        stage('Unit Tests') {
            steps {
                sh 'mvn test'
            }
            post {
                always {
                    junit 'target/surefire-reports/*.xml'
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'target/surefire-reports',
                        reportFiles: 'index.html',
                        reportName: 'Unit Test Report'
                    ])
                }
            }
        }
        
        stage('Integration Tests') {
            steps {
                sh 'mvn verify -Dtest.suite=integration'
            }
            post {
                always {
                    junit 'target/failsafe-reports/*.xml'
                }
            }
        }
        
        stage('API Tests') {
            steps {
                script {
                    sh 'java -jar karate.jar --tags @smoke'
                }
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'target/karate-reports',
                        reportFiles: 'karate-summary.html',
                        reportName: 'Karate API Test Report'
                    ])
                }
            }
        }
        
        stage('UI Tests') {
            parallel {
                stage('Chrome Tests') {
                    steps {
                        sh 'mvn test -Dbrowser=chrome -Dtest.suite=ui'
                    }
                }
                stage('Firefox Tests') {
                    steps {
                        sh 'mvn test -Dbrowser=firefox -Dtest.suite=ui'
                    }
                }
            }
        }
    }
    
    post {
        always {
            // Archive artifacts
            archiveArtifacts artifacts: 'target/**/*.jar', fingerprint: true
            
            // Cleanup workspace
            cleanWs()
        }
        
        failure {
            // Send notification on failure
            emailext(
                subject: "Test Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "Build failed. Check console output at ${env.BUILD_URL}",
                to: 'team@company.com'
            )
        }
        
        success {
            echo 'All tests passed successfully!'
        }
    }
}
```

### Python/pytest đường ống

```groovy
pipeline {
    agent any
    
    stages {
        stage('Setup') {
            steps {
                sh '''
                    python3 -m venv venv
                    . venv/bin/activate
                    pip install -r requirements.txt
                '''
            }
        }
        
        stage('Lint & Format') {
            steps {
                sh '''
                    . venv/bin/activate
                    flake8 tests/
                    black --check tests/
                '''
            }
        }
        
        stage('Unit Tests') {
            steps {
                sh '''
                    . venv/bin/activate
                    pytest tests/unit/ --junitxml=reports/unit-results.xml
                '''
            }
            post {
                always {
                    junit 'reports/unit-results.xml'
                }
            }
        }
        
        stage('Integration Tests') {
            steps {
                sh '''
                    . venv/bin/activate
                    pytest tests/integration/ --junitxml=reports/integration-results.xml
                '''
            }
            post {
                always {
                    junit 'reports/integration-results.xml'
                }
            }
        }
    }
}
```

### Đường ống Khung Robot

```groovy
pipeline {
    agent any
    
    stages {
        stage('Robot Tests') {
            steps {
                sh '''
                    robot --outputdir results \
                          --variable BROWSER:headlesschrome \
                          --include smoke \
                          tests/
                '''
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'results',
                        reportFiles: 'report.html',
                        reportName: 'Robot Framework Report'
                    ])
                    
                    step([
                        $class: 'RobotPublisher',
                        outputPath: 'results',
                        outputFileName: 'output.xml',
                        reportFileName: 'report.html',
                        logFileName: 'log.html'
                    ])
                }
            }
        }
    }
}
```

## Các tính năng đường ống nâng cao

### Xây dựng ma trận
```groovy
pipeline {
    agent none
    
    stages {
        stage('Test Matrix') {
            matrix {
                axes {
                    axis {
                        name 'BROWSER'
                        values 'chrome', 'firefox', 'edge'
                    }
                    axis {
                        name 'ENVIRONMENT'
                        values 'staging', 'production'
                    }
                }
                stages {
                    stage('Test') {
                        agent any
                        steps {
                            sh "mvn test -Dbrowser=${BROWSER} -Denv=${ENVIRONMENT}"
                        }
                    }
                }
            }
        }
    }
}
```

### Thực thi có điều kiện
```groovy
stage('Deploy') {
    when {
        allOf {
            branch 'main'
            expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
        }
    }
    steps {
        sh 'deploy.sh'
    }
}
```

### Tích hợp kiểm tra hiệu suất
```groovy
stage('Performance Tests') {
    steps {
        sh 'jmeter -n -t performance-test.jmx -l results.jtl'
    }
    post {
        always {
            perfReport(
                sourceDataFiles: 'results.jtl',
                compareBuildPrevious: true,
                modePerformancePerTestCase: true
            )
        }
    }
}
```

## 📊 Báo cáo và phân tích kiểm tra

### Tích hợp JUnit
```groovy
post {
    always {
        junit(
            allowEmptyResults: true,
            testResults: '**/target/surefire-reports/*.xml'
        )
    }
}
```

### Báo cáo Allure
```groovy
post {
    always {
        allure([
            includeProperties: false,
            jdk: '',
            properties: [],
            reportBuildPolicy: 'ALWAYS',
            results: [[path: 'target/allure-results']]
        ])
    }
}
```

### Báo cáo HTML tùy chỉnh
```groovy
publishHTML([
    allowMissing: false,
    alwaysLinkToLastBuild: true,
    keepAll: true,
    reportDir: 'reports',
    reportFiles: '*.html',
    reportName: 'Test Report',
    reportTitles: 'Custom Test Results'
])
```

## 🚀 Thực hành tốt nhất

### 1. Tổ chức đường ống
```groovy
// Use shared libraries for common functionality
@Library('jenkins-shared-library') _

pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                runTestSuite(framework: 'karate', suite: 'api-tests')
            }
        }
    }
}
```

### 2. Quản lý môi trường
```groovy
environment {
    TEST_URL = credentials('test-environment-url')
    DB_PASSWORD = credentials('test-db-password')
    SLACK_WEBHOOK = credentials('slack-webhook-url')
}
```

### 3. Thực hiện song song
```groovy
stage('Parallel Tests') {
    parallel {
        stage('API Tests') {
            agent { label 'api-test-node' }
            steps { sh 'run-api-tests.sh' }
        }
        stage('UI Tests') {
            agent { label 'ui-test-node' }
            steps { sh 'run-ui-tests.sh' }
        }
        stage('Performance Tests') {
            agent { label 'perf-test-node' }
            steps { sh 'run-performance-tests.sh' }
        }
    }
}
```

### 4. Quản lý dữ liệu kiểm tra
```groovy
stage('Setup Test Data') {
    steps {
        script {
            // Create test data
            sh 'python create-test-data.py --environment ${ENV}'
        }
    }
}
```

## 🎓 Các bước tiếp theo

-[Cấu hình Jenkins nâng cao] (./ Jenkins-Advanced-Config)
-[Jenkins với Docker] (./ Jenkins-Docker-Intevration)
- [Quy mô Jenkins cho các đội lớn] (./ Jenkins-Scaling)

---

*Tự động hóa tự động hóa của bạn!🔄*