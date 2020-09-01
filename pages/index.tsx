import { useSession, signIn } from 'next-auth/client';
import useSWR from 'swr';

// Component imports
import User from '../components/User';
import Layout from '../components/Layout';
import { PacmanLoader } from 'react-spinners';

export default function Home() {
  // Session
  const [session] = useSession();

  // SWR
  const { data, error } = useSWR('/api/getUsers', async (query) => {
    const res = await fetch(query);
    const { data } = await res.json();
    return data;
  });

  return (
    <Layout>
      <section>
        <h1>Public facing profiles for your Discord account.</h1>
        {session ? (
          <p>
            Logged in as <strong>{session.user.discordTag}</strong>
          </p>
        ) : (
          <>
            {' '}
            <h6>Sign up today!</h6>
            <button
              className="button-outline"
              onClick={() => signIn('discord')}
            >
              Sign Up
            </button>
          </>
        )}
      </section>
      <br />
      <br />
      {/* Users */}
      <section className="container">
        <div
          className="row"
          style={{ flexWrap: 'wrap', gap: 16, margin: '0 auto' }}
        >
          {data ? (
            data.map((user: any, i: number) => (
              <User
                discordTag={user.discordTag}
                description={user.description}
                avatarURL={user.avatarURL}
                slug={user._id}
              />
            ))
          ) : error ? (
            <div style={{ margin: '0 auto' }}>
              <h4>Error loading data</h4>
            </div>
          ) : (
            <div style={{ margin: '0 auto' }}>
              <PacmanLoader size={25} color={'#9B4DCA'} />
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
