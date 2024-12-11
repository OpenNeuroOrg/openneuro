import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { UserAccountTabs } from "../user-tabs"; 

// Wrapper component to allow dynamic modification of `hasEdit`
const UserAccountTabsWrapper: React.FC = () => {
  const [hasEdit, setHasEdit] = useState(true);

  return (
    <>
      <button onClick={() => setHasEdit(!hasEdit)}>Toggle hasEdit</button>
      <MemoryRouter>
        <Routes>
          <Route path="*" element={<UserAccountTabs hasEdit={hasEdit} />} />
        </Routes>
      </MemoryRouter>
    </>
  );
};

describe("UserAccountTabs Component", () => {
  it("should not render tabs when hasEdit is false", () => {
    render(<UserAccountTabsWrapper />);

    expect(screen.getByText("User Datasets")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Toggle hasEdit"));

    expect(screen.queryByText("User Datasets")).not.toBeInTheDocument();
  });

  it("should render tabs when hasEdit is toggled back to true", () => {
    render(<UserAccountTabsWrapper />);

    expect(screen.getByText("User Datasets")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Toggle hasEdit"));
    expect(screen.queryByText("User Datasets")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Toggle hasEdit"));
    expect(screen.getByText("User Datasets")).toBeInTheDocument();
  });

    it("should update active class on the correct NavLink based on route", () => {
      render(<UserAccountTabsWrapper />);
  
     // Utility function to check if an element has 'active' class - used because of CSS module discrepancies between classNames
      const hasActiveClass = (element) => element.className.includes('active');
  
      const datasetsTab = screen.getByText("User Datasets");
      expect(hasActiveClass(datasetsTab)).toBe(true);
  
      const notificationsTab = screen.getByText("User Notifications");

      fireEvent.click(notificationsTab);
      
      expect(hasActiveClass(notificationsTab)).toBe(true);
      expect(hasActiveClass(datasetsTab)).toBe(false);
  
      const accountTab = screen.getByText("Account Info");

      fireEvent.click(accountTab);

      expect(hasActiveClass(accountTab)).toBe(true);
      expect(hasActiveClass(datasetsTab)).toBe(false);
      expect(hasActiveClass(notificationsTab)).toBe(false);
    });


    it("should trigger animation state when a tab is clicked", async () => {
        render(<UserAccountTabsWrapper />);
    
        const notificationsTab = screen.getByText("User Notifications");
        // Utility function to check if an element has 'clicked' class - used because of CSS module discrepancies between classNames
        const hasClickedClass = (element) => element.className.includes('clicked');
        const tabsContainer = await screen.findByRole("list");

        expect(hasClickedClass(tabsContainer)).toBe(false);
    
        fireEvent.click(notificationsTab);
  
        expect(hasClickedClass(tabsContainer)).toBe(true);
    });
    
      
});
