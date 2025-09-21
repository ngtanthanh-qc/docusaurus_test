# Jenkins Test Automation Pipeline

Jenkins is the leading open-source automation server for building CI/CD pipelines. This guide covers setting up Jenkins for test automation with various testing frameworks.

## 🎯 Why Jenkins for Test Automation?

- **Pipeline as Code** - Version control your CI/CD pipelines
- **Plugin Ecosystem** - Extensive plugins for testing tools
- **Parallel Execution** - Run tests in parallel across multiple nodes
- **Test Reporting** - Rich test reports and analytics
- **Integration** - Seamless integration with Git, Docker, cloud platforms

## 🚀 Setting Up Jenkins

### Installation Options

#### Docker (Recommended for Development)
```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts
```

#### Package Installation (Ubuntu)
```bash
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt update
sudo apt install jenkins
```

### Initial Setup
1. Navigate to `http://localhost:8080`
2. Get initial admin password: `docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword`
3. Install suggested plugins
4. Create admin user

## 🔧 Essential Plugins for Test Automation

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

## 📝 Jenkinsfile for Test Automation

### Basic Pipeline Structure

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

### Python/Pytest Pipeline

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

### Robot Framework Pipeline

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

## 🔀 Advanced Pipeline Features

### Matrix Builds
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

### Conditional Execution
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

### Performance Testing Integration
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

## 📊 Test Reporting & Analytics

### JUnit Integration
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

### Allure Reports
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

### Custom HTML Reports
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

## 🚀 Best Practices

### 1. Pipeline Organization
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

### 2. Environment Management
```groovy
environment {
    TEST_URL = credentials('test-environment-url')
    DB_PASSWORD = credentials('test-db-password')
    SLACK_WEBHOOK = credentials('slack-webhook-url')
}
```

### 3. Parallel Execution
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

### 4. Test Data Management
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

## 🎓 Next Steps

- [Advanced Jenkins Configuration](./jenkins-advanced-config)
- [Jenkins with Docker](./jenkins-docker-integration)
- [Scaling Jenkins for Large Teams](./jenkins-scaling)

---

*Automate your automation! 🔄*