import React from "react";
import VideosPage from "../pages/VideosPage";
import { cleanup, render, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import VideoItem from "../components/Video/VideoItem";
import axios from "axios";

jest.mock("../assets/loading.gif", () => ({}), { virtual: true });

jest.mock("axios");

jest.mock("../components/VideoItem", () => {
  return function VideoItem({ video }) {
    return (
      <div data-testid={`video-${video.id}`}>
        <h1>{video.title}</h1>
      </div>
    );
  };
});

afterEach(cleanup);

test("succesfully loads video list", async () => {
  const mockedVideos = [
    {
      id: 1,
      title: "Test video 1",
    },
    {
      id: 2,
      title: "Test video 2",
    },
    {
      id: 3,
      title: "Test video 3",
    },
  ];

  axios.get.mockResolvedValueOnce({
    data: { videos: mockedVideos, hasMore: false },
  });

  render(
    <MemoryRouter>
      <VideosPage />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByTestId("video-1")).toBeInTheDocument();
    expect(screen.getByTestId("video-2")).toBeInTheDocument();
    expect(screen.getByTestId("video-3")).toBeInTheDocument();
  });

  expect(screen.getByText("Test video 1")).toBeInTheDocument();
  expect(screen.getByText("Test video 2")).toBeInTheDocument();
  expect(screen.getByText("Test video 3")).toBeInTheDocument();

  expect(axios.get).toHaveBeenCalled();
  expect(axios.get).toHaveBeenCalledWith("api/video?pageSize=30&pageNumber=1");
});
