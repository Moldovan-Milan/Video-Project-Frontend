const formatDuration = (duration) => {
  const parts = duration.split(":").map(Number);

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    if (hours === 0) {
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    } else {
      return `${String(hours)}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
  } else if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return duration;
};

export default formatDuration;
