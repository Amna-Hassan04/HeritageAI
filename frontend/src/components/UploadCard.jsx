import { Upload, Camera } from "lucide-react";

export default function UploadCard({ title, icon, onSelect, capture }) {
  return (
    <div className="upload-card">
      <h3>{title}</h3>

      <label className="drop-zone">
        <input
          type="file"
          accept="image/*"
          capture={capture ? "environment" : undefined}
          hidden
          onChange={e => onSelect(e.target.files[0])}
        />

        {icon === "upload" ? <Upload size={48} /> : <Camera size={48} />}
        <p>Click or drag image</p>
      </label>
    </div>
  );
}
