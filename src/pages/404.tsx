import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './404.module.css';

export default function NotFound(): JSX.Element {
  const [glitchText, setGlitchText] = useState('404');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const glitchChars = ['4̸0̸4̸', '4̵0̵4', '4̶0̶4', '404'];
      const randomGlitch = glitchChars[Math.floor(Math.random() * glitchChars.length)];
      setGlitchText(randomGlitch);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const suggestions = [
    { icon: '🎯', text: 'Test Automation', link: '/docs/test-automation/intro' },
    { icon: '🤖', text: 'AI/ML & Agents', link: '/docs/ai-ml-agents/intro' },
    { icon: '🔄', text: 'CI/CD & DevOps', link: '/docs/cicd-devops/jenkins/jenkins-test-automation-pipeline' },
    { icon: '🌐', text: 'Networking', link: '/docs/networking/intro' },
  ];

  const funnyMessages = [
    "Looks like this page failed its unit test! 🧪",
    "404: Page not found, but your debugging skills are! 🔍",
    "This page is in another castle... 🏰",
    "Have you tried turning it off and on again? 🔌",
    "The page you're looking for is probably in production, not here! 🚀",
    "Congratulations! You found the secret 404 page! 🎉",
    "This page is currently being refactored... permanently. 🔧",
    "Error 404: Coffee not found. Please refill and try again. ☕",
  ];

  const [currentMessage] = useState(
    funnyMessages[Math.floor(Math.random() * funnyMessages.length)]
  );

  return (
    <Layout title="404: Page Not Found">
      <div className={styles.container}>
        <div className={styles.backgroundAnimation}>
          <div 
            className={styles.floatingCode}
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
            }}
          >
            {'{ status: 404 }'}
          </div>
          <div 
            className={styles.floatingCode2}
            style={{
              transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`
            }}
          >
            {'console.error()'}
          </div>
          <div className={styles.floatingCode3}>
            {'// TODO: Find page'}
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.errorCode}>
            <h1 className={styles.glitch} data-text={glitchText}>
              {glitchText}
            </h1>
            <div className={styles.scanline}></div>
          </div>

          <div className={styles.errorInfo}>
            <h2 className={styles.title}>Oops! Page Not Found</h2>
            <p className={styles.message}>{currentMessage}</p>
          </div>

          <div className={styles.terminal}>
            <div className={styles.terminalHeader}>
              <span className={styles.terminalButton} style={{background: '#ff5f56'}}></span>
              <span className={styles.terminalButton} style={{background: '#ffbd2e'}}></span>
              <span className={styles.terminalButton} style={{background: '#27c93f'}}></span>
              <span className={styles.terminalTitle}>debug.log</span>
            </div>
            <div className={styles.terminalBody}>
              <p className={styles.terminalLine}>
                <span className={styles.terminalPrompt}>❯</span> GET /your-page HTTP/1.1
              </p>
              <p className={styles.terminalLine}>
                <span className={styles.errorText}>Error: 404 - Resource not found</span>
              </p>
              <p className={styles.terminalLine}>
                <span className={styles.terminalPrompt}>❯</span> Suggested actions:
              </p>
              <p className={styles.terminalLine}>
                &nbsp;&nbsp;1. Check the URL for typos
              </p>
              <p className={styles.terminalLine}>
                &nbsp;&nbsp;2. Try searching for what you need
              </p>
              <p className={styles.terminalLine}>
                &nbsp;&nbsp;3. Go back to homepage
              </p>
              <p className={styles.terminalLine}>
                <span className={styles.terminalCursor}>▊</span>
              </p>
            </div>
          </div>

          <div className={styles.actions}>
            <Link
              to="/"
              className={styles.primaryButton}
            >
              🏠 Back to Homepage
            </Link>
            <Link
              to="/docs/intro"
              className={styles.secondaryButton}
            >
              📚 Browse Documentation
            </Link>
          </div>

          <div className={styles.suggestions}>
            <h3 className={styles.suggestionsTitle}>Maybe you were looking for:</h3>
            <div className={styles.suggestionGrid}>
              {suggestions.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className={styles.suggestionCard}
                >
                  <span className={styles.suggestionIcon}>{item.icon}</span>
                  <span className={styles.suggestionText}>{item.text}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.easteregg}>
            <p>🔍 Fun fact: You're the {Math.floor(Math.random() * 9000) + 1000}th visitor to this 404 page!</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}