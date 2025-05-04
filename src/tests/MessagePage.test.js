// File: src/tests/MessagePage.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MessagePage from "../pages/MessagePage";
import { UserContext } from "../components/contexts/UserProvider";
import { useSignalR } from "../components/contexts/SignalRProvider";
import { MemoryRouter, Route, Routes } from "react-router-dom";

jest.mock("../styles/MessagePage.scss", () => ({}));
jest.mock("../styles/MessageItem.scss", () => ({}));
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "5" }),
    useLocation: () => ({ search: "?name=Alice" }),
  };
});
const mockHistory = jest.fn();
const mockSend = jest.fn();
let mockConnection;
let mockMessages;

jest.mock("../components/contexts/SignalRProvider", () => ({
  useSignalR: () => ({
    connection: mockConnection,
    messages: mockMessages,
    setMessages: jest.fn(),
    requestHistory: mockHistory,
    sendMessage: mockSend,
  }),
}));

describe("MessagePage component", () => {
  beforeEach(() => {
    document.title = "";
    mockConnection = { state: "Connected" };
    mockMessages = [];
    mockHistory.mockClear();
    mockSend.mockClear();
  });

  const renderWithUser = (user) =>
    render(
      <UserContext.Provider value={{ user }}>
        <MemoryRouter initialEntries={["/messages/5?name=Alice"]}>
          <Routes>
            <Route path="/messages/:id" element={<MessagePage />} />
          </Routes>
        </MemoryRouter>
      </UserContext.Provider>
    );

  test("sets document title based on query param", () => {
    renderWithUser({ id: "u1" });
    expect(document.title).toBe("Private chat with Alice | Omega Stream");
  });

  test("requests history when connection established", () => {
    renderWithUser({ id: "u1" });
    expect(mockHistory).toHaveBeenCalledWith(5);
  });

  test("shows no messages text when empty", () => {
    renderWithUser({ id: "u1" });
    expect(screen.getByText(/No messages yet/i)).toBeInTheDocument();
  });

  test("renders messages when present", () => {
    mockMessages = [
      { id: "m1", content: "Hello" },
      { id: "m2", content: "World" },
    ];
    renderWithUser({ id: "u1" });
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("World")).toBeInTheDocument();
  });

  test("shows error on sending empty message", () => {
    renderWithUser({ id: "u1" });
    fireEvent.click(screen.getByText(/Send/i));
    expect(screen.getByText(/Message cannot be empty/i)).toBeInTheDocument();
  });

  test("sends message and clears input", () => {
    renderWithUser({ id: "u1" });
    const input = screen.getByPlaceholderText(/Write a message/i);
    fireEvent.change(input, { target: { value: "Hi there" } });
    fireEvent.click(screen.getByText(/Send/i));
    expect(mockSend).toHaveBeenCalledWith(5, "Hi there");
    expect(input.value).toBe("");
  });
});
