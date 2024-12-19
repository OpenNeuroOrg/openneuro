import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { UserQuery } from "../user-query";
import FourOFourPage from "../../errors/404page";


// TODO update these once the correct query is in place and dummy data is not used.
// maybe there is a better way to do this
const VALID_ORCID = "0000-0001-6755-0259";
const INVALID_ORCID = "0000-000X-1234-5678";
const UNKNOWN_ORCID = "0000-0000-0000-0000";

const renderWithRouter = (orcid: string) => {
  return render(
    <MemoryRouter initialEntries={[`/user/${orcid}`]}>
      <Routes>
        <Route path="/user/:orcid" element={<UserQuery />} />
        <Route path="*" element={<FourOFourPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("UserQuery Component", () => {
  // TODO update these once the correct query is in place and dummy data is not used.
  // maybe there is a better way to do this
  it("renders UserRoutes for a valid ORCID", async () => {
    renderWithRouter(VALID_ORCID);
    const userName = await screen.findByText("Gregory Noack");
    expect(userName).toBeInTheDocument();

    const userLocation = screen.getByText("Stanford, CA");
    expect(userLocation).toBeInTheDocument();
  });

  it("renders FourOFourPage for an invalid ORCID", async () => {
    renderWithRouter(INVALID_ORCID);
    const errorMessage = await screen.findByText(
      /404: The page you are looking for does not exist./i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("renders FourOFourPage for a missing ORCID", async () => {
    renderWithRouter("");
    const errorMessage = await screen.findByText(
      /404: The page you are looking for does not exist./i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("renders FourOFourPage for an unknown ORCID", async () => {
    renderWithRouter(UNKNOWN_ORCID);
    const errorMessage = await screen.findByText(
      /404: The page you are looking for does not exist./i
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
