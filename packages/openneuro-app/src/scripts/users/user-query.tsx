import React from "react";
import { useParams } from 'react-router-dom';
import { UserRoutes } from './user-routes';
import FourOFourPage from '../errors/404page';
import { isValidOrcid } from "../utils/validationUtils"; // Assume this checks length and format
import { gql, useQuery } from "@apollo/client";

// GraphQL query to fetch user by ORCID
const GET_USER_BY_ORCID = gql`
  query User($userId: ID!) {
    user(id: $userId) {
      id
      name
      orcid
      email
      avatar
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
  const { orcid } = useParams();
  
  // Check if the ORCID is valid
  if (!orcid || !isValidOrcid(orcid)) {
    // ORCID is invalid or missing, immediately return 404
    return <FourOFourPage />;
  }
  

  

  const { data, loading, error } = useQuery(GET_USER_BY_ORCID, {
    variables: { userId: orcid },
    skip: !orcid || !isValidOrcid(orcid),
  });

  if (loading) return <div>Loading...</div>;

  // If the query encounters an error or no user is found, return 404
  if (error || !data?.user || data.user.orcid !== orcid) return <FourOFourPage />;

  // Assuming 'hasEdit' is true for now (you can modify this based on your logic)
  const hasEdit = true;

  // Render user data with UserRoutes
  return <UserRoutes user={data.user} hasEdit={hasEdit} />;
};
