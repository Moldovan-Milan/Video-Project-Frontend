// File: src/tests/VideosPage.test.js
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import VideosPage from "../pages/VideosPage";
import { BrowserRouter } from "react-router-dom";

jest.mock("axios");
jest.mock("../assets/loading.gif", () => "loading.gif");
jest.mock("../components/Video/VideoItemSkeleton", () => () => (
  <div data-testid="skeleton" />
));

class MockObserver {
  constructor(cb) {
    this.cb = cb;
  }
  observe() {}
  disconnect() {}
  trigger(entry) {
    this.cb([entry]);
  }
}
beforeAll(() => {
  global.IntersectionObserver = MockObserver;
});

describe("VideosPage component", () => {
  beforeEach(() => {
    axios.get.mockReset();
    document.title = "";
  });

  test("sets document title on mount", async () => {
    axios.get.mockResolvedValue({ data: { videos: [], hasMore: false } });
    render(
      <BrowserRouter>
        <VideosPage />
      </BrowserRouter>
    );
    await waitFor(() => expect(document.title).toBe("Omega Stream"));
  });

  test("displays loading skeleton when fetching videos", () => {
    axios.get.mockResolvedValue({ data: { videos: [], hasMore: false } });
    render(
      <BrowserRouter>
        <VideosPage />
      </BrowserRouter>
    );
    expect(screen.getByAltText(/loading/i)).toBeInTheDocument();
  });

  test("fetches videos with correct query params", async () => {
    axios.get.mockResolvedValue({
      data: { videos: [{ id: "1", title: "A" }], hasMore: true },
    });
    render(
      <BrowserRouter>
        <VideosPage />
      </BrowserRouter>
    );
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(
        "api/video?pageSize=30&pageNumber=1"
      )
    );
  });
});
