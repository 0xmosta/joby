import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Code not provided!');
  }

  try {
    // Exchange the authorization code for an access token
    const response = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const { access_token } = response.data;

    // Use access token to fetch the user's GitHub profile
    const userResponse = await axios.get(`https://api.github.com/user`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Save user info to session or database as needed
    const userData = userResponse.data;
    console.log(userData);

    // Redirect user to desired page
    res.redirect('/');
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).json({ error: 'Error during GitHub authentication' });
  }
}