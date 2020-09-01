import { NextApiRequest, NextApiResponse } from 'next';
import Client, { gql } from '../../../graphql/client';
import { getSession } from 'next-auth/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Reject non-POST requests
  if (req.method !== 'POST') return res.status(405).send('Method not allowed.');

  // Reject malformed requests
  const { description } = JSON.parse(req.body);
  const { id } = req.query;
  if (typeof description !== 'string')
    return res.status(400).send('Bad request.');
  if (!id) return res.status(400).send('Bad request.');

  try {
    // Reject unauthorized requests
    const session = await getSession({ req });

    if (!session || session.user.id !== id)
      return res.status(400).send('Bad request.');
    await Client.request(
      gql`
        mutation UpdateUserDescription($description: String, $id: ID!) {
          partialUpdateDiscordUser(
            id: $id
            data: { description: $description }
          ) {
            _id
            description
          }
        }
      `,
      {
        id,
        description,
      }
    );

    res.status(200).send('User was updated!');
  } catch (err) {
    console.log(err);
    res.status(400).send('User not found.');
  }
};
