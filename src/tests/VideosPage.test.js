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

jest.mock("../components/Video/VideoItem", () => ({ video, ref }) => (
  <div data-testid="video-item" ref={ref}>
    {video.title}
  </div>
));

describe("VideosPage", () => {
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

  test("shows loading indicator when no videos", () => {
    axios.get.mockResolvedValue({ data: { videos: [], hasMore: false } });
    render(
      <BrowserRouter>
        <VideosPage />
      </BrowserRouter>
    );
    expect(screen.getByAltText(/loading/i)).toBeInTheDocument();
  });

  test("fetches and displays videos", async () => {
    const mockVideos = [
      { id: "1", title: "Video One" },
      { id: "2", title: "Video Two" },
    ];
    axios.get.mockResolvedValue({
      data: { videos: mockVideos, hasMore: false },
    });
    render(
      <BrowserRouter>
        <VideosPage />
      </BrowserRouter>
    );
    const items = await screen.findAllByTestId("video-item");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Video One");
    expect(items[1]).toHaveTextContent("Video Two");
  });
});
