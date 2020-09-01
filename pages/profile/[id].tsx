import React, { useState, useRef, useEffect } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';

// Component imports
import Layout from '../../components/Layout';
import { PacmanLoader } from 'react-spinners';

const UserProfile = () => {
  // State
  const [copyDiscordTag, setCopyDiscordTag] = useState(false);
  const [copyProfileURL, setCopyProfileURL] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [profileDescription, setProfileDescription] = useState('');
  const [profileDescriptionError, setProfileDescriptionError] = useState(false);

  // Refs
  const input = useRef<HTMLInputElement>(null);

  // Session
  const [session] = useSession();

  // Query params
  const router = useRouter();
  const { id } = router.query;

  // SWR
  const { data, error, mutate } = useSWR(
    `/api/getUserById/${id}`,
    async (query) => {
      const res = await fetch(query);
      return await res.json();
    }
  );

  // Helpers
  const handleEditProfile = () => {
    if (session && session.user.id === id) {
      setEditProfile(true);
    }
  };

  // Handle input focus when 'editProfile' is true
  useEffect(() => {
    if (editProfile) input.current.focus();
  }, [editProfile]);

  // Update user's description
  const updateDescription = () => {
    fetch(`/api/updateUser/${id}`, {
      method: 'POST',
      body: JSON.stringify({ description: profileDescription }),
    });
  };

  // Set 'profileDescription' on page load
  useEffect(() => {
    if (data && data.description) setProfileDescription(data.description);
  }, [data]);

  return (
    <Layout>
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {data ? (
          <div
            style={{
              background: '#f9f9f9',
              boxShadow: '0px 5px 10px rgba(0, 0, 0, .15)',
              borderRadius: 5,
              padding: 24,
            }}
          >
            <img
              src={data.avatarURL}
              alt=""
              style={{
                width: 128,
                height: 128,
                borderRadius: '100%',
                objectFit: 'cover',
              }}
              draggable={false}
            />
            <br />
            <br />
            <h2>{data.discordTag}</h2>
            <p onClick={handleEditProfile}>
              {data.description && !editProfile ? (
                data.description
              ) : editProfile ? (
                <>
                  <input
                    ref={input}
                    onBlur={async () => {
                      if (profileDescription.length > 50) {
                        return setProfileDescriptionError(true);
                      }
                      setEditProfile(false);
                      updateDescription();
                      mutate(
                        { ...data, description: profileDescription },
                        false
                      );
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (profileDescription.length > 50) {
                          return setProfileDescriptionError(true);
                        }

                        setEditProfile(false);
                        updateDescription();
                        mutate(
                          { ...data, description: profileDescription },
                          false
                        );
                      }
                    }}
                    value={profileDescription}
                    onChange={(e) => setProfileDescription(e.target.value)}
                  ></input>
                  {profileDescriptionError && (
                    <p>
                      Please enter a description that's less than 50 characters.
                    </p>
                  )}
                </>
              ) : (
                <em>No description provided.</em>
              )}
            </p>
            <button
              style={{ marginRight: 16 }}
              onClick={() => {
                navigator.clipboard.writeText(data.discordTag);

                setCopyDiscordTag(true);

                setTimeout(() => {
                  setCopyDiscordTag(false);
                }, 1000);
              }}
            >
              {copyDiscordTag ? 'Copied' : 'Copy Discord Tag'}
            </button>
            <button
              className="button button-outline"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/profile/${data._id}`
                );

                setCopyProfileURL(true);

                setTimeout(() => {
                  setCopyProfileURL(false);
                }, 1000);
              }}
            >
              {copyProfileURL ? 'Copied' : 'Copy Profile URL'}
            </button>
            {session && session.user.id === id && (
              <button
                className="button button-clear"
                onClick={handleEditProfile}
              >
                Edit Profile
              </button>
            )}
          </div>
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
    </Layout>
  );
};

export default UserProfile;
