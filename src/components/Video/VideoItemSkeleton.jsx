const VideoItemSkeleton = () => {
  return (
    <div
      style={{
        width: "100%",
        padding: "0.5rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          borderRadius: "0.5rem",
          overflow: "hidden",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          backgroundColor: "#2D3748",
        }}
      >
        {/* Thumbnail skeleton */}
        <div
          style={{
            width: "100%",
            backgroundColor: "#4A5568",
            paddingBottom: "56.25%",
          }}
        ></div>
        <div style={{ padding: "1rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            {/* Avatar skeleton */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#4A5568",
                marginRight: "1rem",
              }}
            ></div>
            <div style={{ flex: 1 }}>
              {/* Title skeleton */}
              <div
                style={{
                  width: "80%",
                  height: "1rem",
                  backgroundColor: "#4A5568",
                  marginBottom: "0.5rem",
                }}
              ></div>
              {/* Uploader skeleton */}
              <div
                style={{
                  width: "50%",
                  height: "1rem",
                  backgroundColor: "#4A5568",
                }}
              ></div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* Duration skeleton */}
            <div
              style={{
                width: "2rem",
                height: "1rem",
                backgroundColor: "#4A5568",
              }}
            ></div>
            <div
              style={{
                width: "3rem",
                height: "1rem",
                backgroundColor: "#4A5568",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoItemSkeleton;
