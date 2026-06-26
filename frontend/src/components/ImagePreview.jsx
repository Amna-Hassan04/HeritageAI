// const ImagePreview = ({ file }) => {
//   if (!file) return null;

//   return (
//     <img
//       src={URL.createObjectURL(file)}
//       alt="Preview"
//       style={{ width: "100%", borderRadius: "8px" }}
//     />
//   );
// };

// export default ImagePreview;
// src/components/ImagePreview.jsx
export default function ImagePreview({ image }) {
  if (!image) return null;
  return (
    <div className="preview-card">
      <h2>Preview</h2>
      <img src={image} alt="Preview" className="preview-image" />
    </div>
  );
}
