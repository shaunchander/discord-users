import { NextApiRequest, NextApiResponse } from 'next';
import Client, { gql } from '../../graphql/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Reject non-GET requests
  if (req.method !== 'GET') return res.status(405).send('Method not allowed.');

  try {
    const { getUsers: data } = await Client.request(gql`
      {
        getUsers {
          data {
            discordTag
            _id
            avatarURL
            description
          }
        }
      }
    `);

    res.status(200).send(JSON.stringify(data));
  } catch (err) {
    res.status(400).send('Something went wrong.');
  }
};
