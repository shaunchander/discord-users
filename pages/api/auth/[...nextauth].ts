import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { NextApiRequest, NextApiResponse } from 'next';
import Client, { gql } from '../../../graphql/client';

const options = {
  // Configure one or more authentication providers
  providers: [
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT,
      clientSecret: process.env.DISCORD_SECRET,
    }),
  ],
  callbacks: {
    signIn: async (user, account, profile) => {
      try {
        // Check if user exists in the database
        const { getUserByEmail } = await Client.request(
          gql`
            query GetUser($email: String!) {
              getUserByEmail(email: $email) {
                _id
              }
            }
          `,
          {
            email: user.email,
          }
        );
        if (!getUserByEmail) {
          // Create the user in the database
          await Client.request(
            gql`
              mutation CreateUser(
                $email: String!
                $discordTag: String!
                $avatarURL: String!
              ) {
                createDiscordUser(
                  data: {
                    email: $email
                    discordTag: $discordTag
                    avatarURL: $avatarURL
                    description: ""
                  }
                ) {
                  _id
                }
              }
            `,
            {
              email: user.email,
              discordTag: `${profile.username}#${profile.discriminator}`,
              avatarURL: user.image,
            }
          );
        } else if (getUserByEmail) {
          // Update user
          await Client.request(
            gql`
              mutation UpdateUser(
                $discordTag: String!
                $avatarURL: String!
                $userID: ID!
              ) {
                partialUpdateDiscordUser(
                  id: $userID
                  data: { discordTag: $discordTag, avatarURL: $avatarURL }
                ) {
                  _id
                }
              }
            `,
            {
              discordTag: `${profile.username}#${profile.discriminator}`,
              avatarURL: user.image,
              userID: getUserByEmail._id,
            }
          );
        }

        return Promise.resolve(true);
      } catch (err) {
        console.dir(err);
      }
    },
    jwt: async (token, user, account, profile, isNewUser) => {
      const isSignIn = user ? true : false;
      if (isSignIn) {
        // Add discordTag to the user's token
        token.discordTag = `${profile.username}#${profile.discriminator}`;

        // Add user's ID to user's token
        const {
          getUserByEmail: { _id },
        } = await Client.request(
          gql`
            query GetUser($email: String!) {
              getUserByEmail(email: $email) {
                _id
              }
            }
          `,
          {
            email: user.email,
          }
        );
        token.id = _id;
      }
      return Promise.resolve(token);
    },
    session: async (session, user) => {
      session.user = user;

      // Unset name, it's not needed
      session.user.name = undefined;
      return Promise.resolve(session);
    },
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
