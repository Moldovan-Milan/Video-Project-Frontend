import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Login from "../pages/Login";
import { UserContext } from "../components/contexts/UserProvider";
import { BrowserRouter } from "react-router-dom";

jest.mock("axios");
jest.mock("../styles/Login.scss", () => ({}));
jest.mock("../styles/Video/VideoItem.scss", () => ({}));
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Login component", () => {
  let setUser;

  const renderWithContext = (user = null) => {
    setUser = jest.fn();
    return render(
      <UserContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </UserContext.Provider>
    );
  };

  beforeEach(() => {
    document.title = "";
    mockNavigate.mockClear();
    axios.post.mockReset();
  });

  test("sets document title on mount", () => {
    renderWithContext();
    expect(document.title).toBe("Login | Omega Stream");
  });

  test("redirects if already logged in", () => {
    const user = { id: "u1" };
    renderWithContext(user);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("submits credentials and logs in successfully", async () => {
    const userDto = {
      id: "u1",
      email: "a@b.com",
      userName: "tester",
      followers: [],
      avatarId: null,
      avatar: null,
      created: "2025-01-01",
    };
    axios.post.mockResolvedValue({ status: 200, data: { userDto } });

    renderWithContext();

    fireEvent.change(screen.getByLabelText(/Email-address:/i), {
      target: { value: "a@b.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password:/i), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByLabelText(/Remember me:/i));
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "api/user/login",
        expect.any(FormData),
        { withCredentials: true }
      );
      expect(setUser).toHaveBeenCalledWith(
        expect.objectContaining({ id: "u1", rememberMe: true })
      );
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("displays error message on login failure and clears password", async () => {
    axios.post.mockRejectedValue({
      response: { data: "Invalid creds" },
    });
    renderWithContext();

    const passwordInput = screen.getByLabelText(/Password:/i);
    fireEvent.change(screen.getByLabelText(/Email-address:/i), {
      target: { value: "a@b.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(await screen.findByText("Invalid creds")).toBeInTheDocument();
    expect(passwordInput.value).toBe("");
  });
});
