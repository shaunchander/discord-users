import React from 'react';

const Footer = () => {
  return (
    <footer style={{ padding: 40, textAlign: 'center' }}>
      Created by{' '}
      <a
        href="https://shaunchander.me"
        target="_blank"
        rel="noopener noreferrer"
      >
        Shaun Chander
      </a>{' '}
      for fun and practice with{' '}
      <a
        href="https://github.com/nextauthjs/next-auth"
        target="_blank"
        rel="noopener noreferrer"
      >
        Next Auth
      </a>
      . View on{' '}
      <a href="https://github.com/shaunchander/discord-users">GitHub</a>
    </footer>
  );
};

export default Footer;
