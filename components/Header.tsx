import { signIn, useSession, signOut } from 'next-auth/client';

// Component imports
import Link from 'next/link';

const Header = () => {
  // Session
  const [session] = useSession();
  console.log(session);

  return (
    <header style={{ padding: 32, background: '#eee' }}>
      <nav
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h3>Discord Users</h3>
          <p>
            Created with <a href="https://nextjs.org">NextJS</a>,{' '}
            <a href="https://fauna.com">FaunaDB</a>, and{' '}
            <a href="https://milligram.io/">Milligram</a>
          </p>
        </div>
        <div>
          <ul style={{ display: 'flex', listStyle: 'none', gap: 16 }}>
            <li>
              <Link href="/">
                <a>All Users</a>
              </Link>
            </li>
            <li>
              {session ? (
                <p>
                  Logged in as <strong>{session.user.discordTag}</strong>&nbsp;
                  <Link href={`/profile/${session.user.id}`}>
                    <a>(Profile)</a>
                  </Link>
                  &nbsp;
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      signOut();
                    }}
                  >
                    (Sign out)
                  </a>
                </p>
              ) : (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    signIn('discord');
                  }}
                >
                  Sign in
                </a>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
