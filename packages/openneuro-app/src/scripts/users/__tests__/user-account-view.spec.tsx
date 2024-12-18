import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserAccountView } from '../user-account-view';

const baseUser = {
    name: "John Doe",
    email: "johndoe@example.com",
    orcid: "0000-0001-2345-6789",
    location: "San Francisco, CA",
    institution: "University of California",
    links: ["https://example.com", "https://example.org"],
    github: "johndoe",
  };

describe('<UserAccountView />', () => {
  it('should render the user details correctly', () => {
    render(<UserAccountView user={baseUser} />);

    // Check if user details are rendered
    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('johndoe@example.com')).toBeInTheDocument();
    expect(screen.getByText('ORCID:')).toBeInTheDocument();
    expect(screen.getByText('0000-0001-2345-6789')).toBeInTheDocument();
    expect(screen.getByText('Connect your github')).toBeInTheDocument();
  });

  it('should render links with EditableContent', () => {
    render(<UserAccountView user={baseUser} />);

    // Editable Links section
    const linksSection = screen.getByText('Links');
    expect(linksSection).toBeInTheDocument();

    const linkItems = screen.getAllByRole('listitem');
    expect(linkItems).toHaveLength(2); // initially 2 links

    // Edit a link
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'https://newlink.com' } });
    fireEvent.click(screen.getByText('Save'));

    // Check if new link was added
    expect(screen.getByText('https://newlink.com')).toBeInTheDocument();
  });

  it('should render location with EditableContent', () => {
    render(<UserAccountView user={baseUser} />);

    // Editable Location section
    const locationSection = screen.getByText('Location');
    expect(locationSection).toBeInTheDocument();

    // Edit location
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Los Angeles, USA' } });
    fireEvent.click(screen.getByText('Save'));

    // Verify updated location
    expect(screen.getByText('Los Angeles, USA')).toBeInTheDocument();
  });

  it('should render institution with EditableContent', () => {
    render(<UserAccountView user={baseUser} />);

    // Editable Institution section
    const institutionSection = screen.getByText('Institution');
    expect(institutionSection).toBeInTheDocument();

    // Edit institution
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New University' } });
    fireEvent.click(screen.getByText('Save'));

    // Verify updated institution
    expect(screen.getByText('New University')).toBeInTheDocument();
  });
});
