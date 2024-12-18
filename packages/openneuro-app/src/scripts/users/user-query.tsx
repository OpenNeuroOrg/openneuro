// UserQuery.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import { UserRoutes } from './user-routes';
import FourOFourPage from '../errors/404page';
import { isValidOrcid } from "../../utils/validationUtils";



// Dummy user data
const dummyUsers: Record<string, User> = {
  '0000-0001-6755-0259': {
    id: '1',
    name: 'Gregory Noack',
    location: 'Stanford, CA',
    github: 'thinknoack',
    institution: 'Stanford University',
    email: 'gregorynoack@thinknoack.com',
    avatar: 'https://dummyimage.com/200x200/000/fff',
    orcid: '0000-0001-6755-0259',
    links: ['onelink.com', 'https://www.twolink.com'],
  },
  '0000-0002-1234-5678': {
    id: '2',
    name: 'Jane Doe',
    location: 'Stanford, CA',
    institution: 'Stanford University',
    email: 'janedoe@example.com',
    avatar: 'https://dummyimage.com/200x200/000/fff',
    orcid: '0000-0002-1234-5678',
    links: ['onelink.com', 'https://www.twolink.com'],
  },
  '0000-0003-2345-6789': {
    id: '3',
    name: 'John Smith',
    location: 'Stanford, CA',
    institution: 'Stanford University',
    email: 'johnsmith@example.com',
    avatar: 'https://dummyimage.com/200x200/000/fff',
    orcid: '0000-0003-2345-6789',
    links: ['onelink.com', 'https://www.twolink.com'],
  },
};



export interface User {
  id: string;
  name: string;
  location: string;
  github?: string;
  institution: string;
  email: string;
  avatar: string;
  orcid: string;
  links: string[];
}

export const UserQuery: React.FC = () => {
  const { orcid } = useParams<{ orcid: string }>();

  // Validate ORCID and return 404 if invalid or missing
  if (!orcid || !isValidOrcid(orcid)) {
    return <FourOFourPage />;
  }

  // Check if the user exists in the dummyUsers data
  const user = dummyUsers[orcid];

  if (!user) {
    // If user is not found, render 404 page
    return <FourOFourPage />;
  }

  // Mocked for now
  const hasEdit = true;

  return <UserRoutes user={user} hasEdit={hasEdit} />;
};
