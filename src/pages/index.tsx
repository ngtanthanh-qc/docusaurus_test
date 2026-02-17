import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {usePluginData} from '@docusaurus/useGlobalData';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import {
  BookOpen,
  PenLine,
  Crosshair,
  Bot,
  RefreshCw,
  Globe,
  User,
  ExternalLink,
  ArrowRight,
  Clock,
  Calendar,
  Tag,
} from 'lucide-react';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.greeting}>Hi there, I'm</div>
            <h1 className={styles.heroTitle}>Thanh Nguyen</h1>
            <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
            <div className={styles.heroButtons}>
              <Link
                className={clsx('button button--primary button--lg', styles.primaryButton)}
                to="/docs/intro">
                <BookOpen size={20} />
                Knowledge Base
              </Link>
              <Link
                className={clsx('button button--outline button--lg', styles.secondaryButton)}
                to="/blog">
                <PenLine size={20} />
                Blog
              </Link>
            </div>
          </div>
          <div className={styles.heroAvatar}>
            <img
              src="/avatar.jpeg"
              alt="Thanh Nguyen"
              className={styles.avatarImage}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

type RecentPost = {
  title: string;
  description: string;
  date: string;
  formattedDate: string;
  permalink: string;
  readingTime: number;
  tags: {label: string; permalink: string}[];
};

function RecentPosts() {
  const {recentPosts} = usePluginData('recent-blog-posts') as {recentPosts: RecentPost[]};

  if (!recentPosts || recentPosts.length === 0) {
    return null;
  }

  return (
    <section className={styles.recentPosts}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Posts</h2>
          <Link to="/blog" className={styles.viewAll}>
            View all posts <ArrowRight size={16} />
          </Link>
        </div>
        <div className={styles.postsGrid}>
          {recentPosts.map((post) => (
            <Link key={post.permalink} to={post.permalink} className={styles.postCard}>
              <div className={styles.postMeta}>
                <span className={styles.postDate}>
                  <Calendar size={14} />
                  {post.formattedDate}
                </span>
                {post.readingTime && (
                  <span className={styles.readingTime}>
                    <Clock size={14} />
                    {Math.ceil(post.readingTime)} min read
                  </span>
                )}
              </div>
              <h3 className={styles.postTitle}>{post.title}</h3>
              {post.description && (
                <p className={styles.postDescription}>{post.description}</p>
              )}
              {post.tags.length > 0 && (
                <div className={styles.postTags}>
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag.label} className={styles.postTag}>
                      <Tag size={12} />
                      {tag.label}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const quickLinks = [
  {to: '/docs/test-automation/intro', icon: Crosshair, title: 'Test Automation', desc: 'API, Web, BDD testing frameworks'},
  {to: '/docs/ai-ml-agents/intro', icon: Bot, title: 'AI/ML & Agents', desc: 'MCP servers, AI agents, ML integration'},
  {to: '/docs/cicd-devops/intro', icon: RefreshCw, title: 'CI/CD & DevOps', desc: 'Jenkins, automation pipelines'},
  {to: '/docs/networking/intro', icon: Globe, title: 'Networking', desc: 'Cisco, CCNA, 802.1X, SDA guides'},
  {to: '/about-me', icon: User, title: 'About Me', desc: 'My journey & experience'},
  {href: 'https://tanthanh.dev', icon: ExternalLink, title: 'Resume', desc: 'Professional portfolio & CV'},
];

function QuickLinks() {
  return (
    <section className={styles.quickLinks}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Explore Topics</h2>
        <div className={styles.linkGrid}>
          {quickLinks.map(({to, href, icon: Icon, title, desc}) =>
            href ? (
              <a key={title} href={href} target="_blank" rel="noopener noreferrer" className={styles.linkCard}>
                <div className={styles.linkIcon}>
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </a>
            ) : (
              <Link key={to} to={to} className={styles.linkCard}>
                <div className={styles.linkIcon}>
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </Link>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home(): React.ReactElement {
  return (
    <Layout
      title="Welcome"
      description="A knowledge sharing platform for technical documentation, networking guides, and automation tutorials">
      <div className="homepage-wrapper">
        <HomepageHeader />
        <main>
          <HomepageFeatures />
          <RecentPosts />
          <QuickLinks />
        </main>
      </div>
    </Layout>
  );
}
