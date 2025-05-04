import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Registration from "../pages/Registration";
import { UserContext } from "../components/contexts/UserProvider";
import { BrowserRouter } from "react-router-dom";

jest.mock("axios");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));
jest.mock(
  "../components/ThumbnailUpload",
  () =>
    ({ thumbnail, setThumbnail }) =>
      (
        <button
          onClick={() => setThumbnail("mockFile")}
          data-testid="upload-btn"
        >
          Upload
        </button>
      )
);

describe("Registration component", () => {
  beforeEach(() => {
    document.title = "";
    mockNavigate.mockClear();
    axios.post.mockReset();
    window.alert = jest.fn();
  });

  const renderWithUser = (user = null) => {
    return render(
      <UserContext.Provider value={{ user }}>
        <BrowserRouter>
          <Registration />
        </BrowserRouter>
      </UserContext.Provider>
    );
  };

  test("sets document title on mount", () => {
    renderWithUser();
    expect(document.title).toBe("Register | Omega Stream");
  });

  test("redirects if user is already logged in", () => {
    renderWithUser({ id: "u1" });
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("shows error on password mismatch", async () => {
    renderWithUser();
    fireEvent.change(screen.getByLabelText(/Username:/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/E-mail address:/i), {
      target: { value: "a@b.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Password:/i), {
      target: { value: "pass1" },
    });
    fireEvent.change(screen.getByLabelText(/Confrim Password:/i), {
      target: { value: "pass2" },
    });
    fireEvent.click(screen.getByTestId("upload-btn"));
    fireEvent.click(screen.getByTestId("signUpButton"));
    expect(
      await screen.findByText(/The passwords don't match!/i)
    ).toBeInTheDocument();
  });

  test("submits form successfully", async () => {
    axios.post.mockResolvedValue({ status: 200 });
    renderWithUser();
    fireEvent.change(screen.getByLabelText(/Username:/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/E-mail address:/i), {
      target: { value: "a@b.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Password:/i), {
      target: { value: "pass" },
    });
    fireEvent.change(screen.getByLabelText(/Confrim Password:/i), {
      target: { value: "pass" },
    });
    fireEvent.click(screen.getByTestId("upload-btn"));
    fireEvent.click(screen.getByTestId("signUpButton"));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "api/user/register",
        expect.any(FormData)
      );
      expect(window.alert).toHaveBeenCalledWith("Successfully Registered!");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("displays server error message", async () => {
    axios.post.mockRejectedValue({
      response: { data: [{ description: "Server error" }] },
    });
    renderWithUser();
    // fill required
    fireEvent.change(screen.getByLabelText(/Username:/i), {
      target: { value: "t" },
    });
    fireEvent.change(screen.getByLabelText(/E-mail address:/i), {
      target: { value: "e@e.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Password:/i), {
      target: { value: "p" },
    });
    fireEvent.change(screen.getByLabelText(/Confrim Password:/i), {
      target: { value: "p" },
    });
    fireEvent.click(screen.getByTestId("upload-btn"));
    fireEvent.click(screen.getByTestId("signUpButton"));
    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });
});
