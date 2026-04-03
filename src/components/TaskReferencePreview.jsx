const TaskReferencePreview = ({ images = [], alt, size = 'inline' }) => {
  const previewImage = images[0];

  if (!previewImage) {
    return null;
  }

  return (
    <div className={`task-reference-preview task-reference-preview-${size}`}>
      <img src={previewImage} alt={`${alt} reference`} className="task-reference-image" />
      {images.length > 1 && (
        <span className="task-reference-count">+{images.length - 1}</span>
      )}
    </div>
  );
};

export default TaskReferencePreview;
