import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function NotFound() {
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
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const suggestions = [
    { icon: '🎯', text: 'Test Automation', link: '/docs/test-automation/intro' },
    { icon: '🤖', text: 'AI/ML & Agents', link: '/docs/ai-ml-agents/intro' },
    { icon: '🔄', text: 'CI/CD & DevOps', link: '/docs/cicd-devops/jenkins/jenkins-test-automation-pipeline' },
    { icon: '🌐', text: 'Networking', link: '/docs/networking' },
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

  const styles = {
    container: {
      minHeight: 'calc(100vh - 60px)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    darkContainer: {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    },
    content: {
      position: 'relative',
      zIndex: 1,
      textAlign: 'center',
      padding: '2rem',
      maxWidth: '800px',
      width: '100%',
    },
    glitch: {
      fontSize: '10rem',
      fontWeight: 900,
      color: 'white',
      textShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(102, 126, 234, 0.5)',
      margin: 0,
      position: 'relative',
      animation: 'glitch 2s infinite',
    },
    title: {
      fontSize: '2rem',
      color: 'white',
      marginBottom: '1rem',
      fontWeight: 700,
    },
    message: {
      fontSize: '1.2rem',
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '2rem',
      lineHeight: 1.6,
    },
    terminal: {
      background: '#1e1e1e',
      borderRadius: '8px',
      margin: '2rem auto',
      maxWidth: '600px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      overflow: 'hidden',
    },
    terminalHeader: {
      background: '#2d2d2d',
      padding: '0.5rem 1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    terminalButton: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
    },
    terminalTitle: {
      marginLeft: 'auto',
      color: '#888',
      fontSize: '0.85rem',
      fontFamily: 'Courier New, monospace',
    },
    terminalBody: {
      padding: '1rem',
      fontFamily: 'Courier New, monospace',
      color: '#0f0',
      background: '#0a0a0a',
      minHeight: '200px',
      textAlign: 'left',
    },
    terminalLine: {
      margin: '0.5rem 0',
      fontSize: '0.95rem',
    },
    terminalPrompt: {
      color: '#4fc3f7',
      fontWeight: 'bold',
    },
    errorText: {
      color: '#ff5252',
    },
    actions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      margin: '2rem 0',
      flexWrap: 'wrap',
    },
    primaryButton: {
      padding: '0.8rem 2rem',
      borderRadius: '8px',
      fontWeight: 600,
      textDecoration: 'none',
      fontSize: '1.1rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
      display: 'inline-block',
    },
    secondaryButton: {
      padding: '0.8rem 2rem',
      borderRadius: '8px',
      fontWeight: 600,
      textDecoration: 'none',
      fontSize: '1.1rem',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      display: 'inline-block',
    },
    suggestions: {
      marginTop: '4rem',
    },
    suggestionsTitle: {
      color: 'white',
      fontSize: '1.3rem',
      marginBottom: '1.5rem',
      fontWeight: 600,
    },
    suggestionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem',
      marginTop: '1rem',
    },
    suggestionCard: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
      textDecoration: 'none',
      color: 'white',
      transition: 'all 0.3s ease',
    },
    suggestionIcon: {
      fontSize: '2rem',
    },
    suggestionText: {
      fontSize: '0.9rem',
      fontWeight: 500,
    },
    floatingCode: {
      position: 'absolute',
      fontFamily: 'Courier New, monospace',
      fontSize: '1.5rem',
      color: 'white',
      opacity: 0.1,
    },
  };

  const isDarkTheme = typeof window !== 'undefined' && 
    document.documentElement.getAttribute('data-theme') === 'dark';

  return (
    <Layout title="404: Page Not Found">
      <div style={{...styles.container, ...(isDarkTheme ? styles.darkContainer : {})}}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
        }}>
          <div style={{
            ...styles.floatingCode,
            top: '20%',
            left: '10%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}>
            {'{ status: 404 }'}
          </div>
          <div style={{
            ...styles.floatingCode,
            top: '70%',
            right: '15%',
            transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`
          }}>
            {'console.error()'}
          </div>
          <div style={{
            ...styles.floatingCode,
            bottom: '30%',
            left: '60%',
          }}>
            {'// TODO: Find page'}
          </div>
        </div>

        <div style={styles.content}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={styles.glitch}>
              {glitchText}
            </h1>
          </div>

          <div>
            <h2 style={styles.title}>Oops! Page Not Found</h2>
            <p style={styles.message}>{currentMessage}</p>
          </div>

          <div style={styles.terminal}>
            <div style={styles.terminalHeader}>
              <span style={{...styles.terminalButton, background: '#ff5f56'}}></span>
              <span style={{...styles.terminalButton, background: '#ffbd2e'}}></span>
              <span style={{...styles.terminalButton, background: '#27c93f'}}></span>
              <span style={styles.terminalTitle}>debug.log</span>
            </div>
            <div style={styles.terminalBody}>
              <p style={styles.terminalLine}>
                <span style={styles.terminalPrompt}>❯</span> GET /your-page HTTP/1.1
              </p>
              <p style={styles.terminalLine}>
                <span style={styles.errorText}>Error: 404 - Resource not found</span>
              </p>
              <p style={styles.terminalLine}>
                <span style={styles.terminalPrompt}>❯</span> Suggested actions:
              </p>
              <p style={styles.terminalLine}>
                &nbsp;&nbsp;1. Check the URL for typos
              </p>
              <p style={styles.terminalLine}>
                &nbsp;&nbsp;2. Try searching for what you need
              </p>
              <p style={styles.terminalLine}>
                &nbsp;&nbsp;3. Go back to homepage
              </p>
              <p style={styles.terminalLine}>
                <span style={{ animation: 'blink 1s infinite' }}>▊</span>
              </p>
            </div>
          </div>

          <div style={styles.actions}>
            <Link to="/" style={styles.primaryButton}>
              🏠 Back to Homepage
            </Link>
            <Link to="/docs/intro" style={styles.secondaryButton}>
              📚 Browse Documentation
            </Link>
          </div>

          <div style={styles.suggestions}>
            <h3 style={styles.suggestionsTitle}>Maybe you were looking for:</h3>
            <div style={styles.suggestionGrid}>
              {suggestions.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  style={styles.suggestionCard}
                >
                  <span style={styles.suggestionIcon}>{item.icon}</span>
                  <span style={styles.suggestionText}>{item.text}</span>
                </Link>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '3rem', opacity: 0.7, fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            <p>🔍 Fun fact: You're the {Math.floor(Math.random() * 9000) + 1000}th visitor to this 404 page!</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}