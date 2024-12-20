import React from 'react';
import { useParams } from 'react-router-dom';
import { UserRoutes } from './user-routes';
import FourOFourPage from '../errors/404page';
import { isValidOrcid } from "../utils/validationUtils";
import { gql, useQuery } from "@apollo/client";

// GraphQL query to fetch user by ORCID
const GET_USER_BY_ORCID = gql`
  query User($userId: ID!) {
    user(id: $userId) {
      id
      name
      orcid
    }
  }
`;

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

  // Fetch user data using GraphQL
  const { data, loading, error } = useQuery(GET_USER_BY_ORCID, {
    variables: { userId: orcid }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <FourOFourPage />; // Handle error as 404 page

  if (!data?.user) {
    return <FourOFourPage />;
  }

  // Assuming hasEdit is a static boolean value for now need to check against logged in user
  const hasEdit = true;

  return <UserRoutes user={data.user} hasEdit={hasEdit} />;
};
