import { NextApiRequest, NextApiResponse } from 'next';
import Client, { gql } from '../../../graphql/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Reject non-GET requests
  if (req.method !== 'GET') return res.status(405).send('Method not allowed.');

  try {
    const { findDiscordUserByID } = await Client.request(
      gql`
        query GetUserById($id: ID!) {
          findDiscordUserByID(id: $id) {
            discordTag
            _id
            avatarURL
            description
          }
        }
      `,
      {
        id: req.query.id,
      }
    );

    res.status(200).send(JSON.stringify(findDiscordUserByID));
  } catch (err) {
    res.status(400).send('User not found.');
  }
};
