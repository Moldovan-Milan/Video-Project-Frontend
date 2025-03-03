const formatDuration = (duration) => {
    const parts = duration.split(":");
    return parts.length === 3 ? parts.slice(1).join(":") : duration;
  };

export default formatDuration;