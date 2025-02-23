import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RecVideoItem";
import RecVideoItem from "./RecVideoItem";

export default function RecommendedVideos({ data }) {
  return (
    <div>
      {data && data.map((video, id) => <RecVideoItem key={id} video={video} />)}
    </div>
  );
}
