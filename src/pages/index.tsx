import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import { useColorMode } from '@docusaurus/theme-common';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const { colorMode } = useColorMode();
  
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.avatarContainer}>
            <img 
              src="/avatar.jpeg" 
              alt="Avatar" 
              className={styles.heroAvatar}
            />
          </div>
          <h1 className={styles.heroTitle}>
            <span className={styles.titleGradient}>{siteConfig.title}</span>
          </h1>
          <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
          <div className={styles.heroButtons}>
            <Link
              className={clsx('button button--primary button--lg', styles.primaryButton)}
              to="/docs/intro">
              Explore Knowledge Base 📚
            </Link>
            <Link
              className={clsx('button button--outline button--lg', styles.secondaryButton)}
              to="/blog">
              Read Blog Posts ✍️
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statLabel}>Articles</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>10+</span>
              <span className={styles.statLabel}>Topics</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>∞</span>
              <span className={styles.statLabel}>Learning</span>
            </div>
          </div>
        </div>
        <div className={styles.heroDecoration}>
          <div className={styles.floatingShape1}></div>
          <div className={styles.floatingShape2}></div>
          <div className={styles.floatingShape3}></div>
        </div>
      </div>
    </header>
  );
}

function QuickLinks() {
  return (
    <section className={styles.quickLinks}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Quick Navigation</h2>
        <div className={styles.linkGrid}>
          <Link to="/docs/test-automation/intro" className={styles.linkCard}>
            <div className={styles.linkIcon}>🎯</div>
            <h3>Test Automation</h3>
            <p>API, Web, BDD testing frameworks</p>
          </Link>
          <Link to="/docs/ai-ml-agents/intro" className={styles.linkCard}>
            <div className={styles.linkIcon}>🤖</div>
            <h3>AI/ML & Agents</h3>
            <p>MCP servers, AI agents, ML integration</p>
          </Link>
          <Link to="/docs/cicd-devops/intro" className={styles.linkCard}>
            <div className={styles.linkIcon}>🔄</div>
            <h3>CI/CD & DevOps</h3>
            <p>Jenkins, automation pipelines</p>
          </Link>
          <Link to="/docs/networking/intro" className={styles.linkCard}>
            <div className={styles.linkIcon}>🌐</div>
            <h3>Networking</h3>
            <p>Cisco, CCNA, 802.1X, SDA guides</p>
          </Link>
          <Link to="/blog" className={styles.linkCard}>
            <div className={styles.linkIcon}>📝</div>
            <h3>Blog</h3>
            <p>Latest thoughts & tutorials</p>
          </Link>
          <Link to="/about-me" className={styles.linkCard}>
            <div className={styles.linkIcon}>👨‍💻</div>
            <h3>About Me</h3>
            <p>My journey & experience</p>
          </Link>
          <a href="https://tanthanh.dev" target="_blank" rel="noopener noreferrer" className={styles.linkCard}>
            <div className={styles.linkIcon}>📄</div>
            <h3>My Resume</h3>
            <p>Professional portfolio & CV</p>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome`}
      description="A knowledge sharing platform for technical documentation, networking guides, and automation tutorials">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <QuickLinks />
      </main>
    </Layout>
  );
}