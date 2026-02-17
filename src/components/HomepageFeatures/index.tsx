import React from 'react';
import clsx from 'clsx';
import { Crosshair, BrainCircuit, Network, type LucideIcon } from 'lucide-react';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Icon: LucideIcon;
  description: React.ReactElement;
  gradient: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'SDET Expertise',
    Icon: Crosshair,
    description: (
      <>
        Software Development Engineer in Test with expertise in API testing,
        web automation, CI/CD pipelines, and test framework development.
      </>
    ),
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    title: 'AI/ML Innovation',
    Icon: BrainCircuit,
    description: (
      <>
        Exploring AI agents, MCP servers, LLM integration, and building
        intelligent automation systems for next-generation testing.
      </>
    ),
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    title: 'Network Automation',
    Icon: Network,
    description: (
      <>
        Cisco technologies, pyATS framework, 802.1X authentication,
        and enterprise networking solutions with automation focus.
      </>
    ),
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
];

function Feature({title, Icon, description, gradient}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className={styles.iconWrapper} style={{background: gradient}}>
          <Icon size={48} strokeWidth={1.5} color="white" />
        </div>
        <div className="text--center padding-horiz--md">
          <h3 className={styles.featureTitle}>{title}</h3>
          <p className={styles.featureDescription}>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): React.ReactElement {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresHeader}>
          <h2 className={styles.featuresTitle}>Why This Platform?</h2>
          <p className={styles.featuresSubtitle}>
            A curated collection of technical knowledge and practical insights
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
