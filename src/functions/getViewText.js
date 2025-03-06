const getViewText = (views) => {
    if (views <= 0) {
        return "No views";
    } else if (views === 1) {
        return "1 view";
    } else {
        return `${views} views`;
    }
};
  
export default getViewText;