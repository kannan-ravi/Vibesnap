export const extractHashTagsFromContent = (content) => {
  const regex = /#(\w+)/g;
  const hashTags = [];
  let match;
  while ((match = regex.exec(content))) {
    hashTags.push(match[1]);
  }
  return hashTags;
};

export const extractContenWithoutHashtags = (content) => {
  const extractedContent = content.replace(/#(\w+)/g, "").trim();
  return extractedContent;
};

export const handlePlayClick = (ref, isPlaying, setIsPlaying) => {
  if (ref.current) {
    if (isPlaying) {
      ref.current.pause();
    } else {
      ref.current.play();
    }
    setIsPlaying(!isPlaying);
  }
};

export const base64ToBlob = (base64, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};
