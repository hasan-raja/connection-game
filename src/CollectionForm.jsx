import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";

const CollectionForm = ({ collection, onSave, onCancel }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: collection?.title || "",
    description: collection?.description || "",
    images: collection?.images || [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: collection?.id || Date.now(),
      imageCount: formData.images.length,
    });
  };

  const addImage = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const newImage = {
        id: Date.now(),
        src: reader.result, // Data URL for the image preview
        alt: `Image ${formData.images.length + 1}`,
      };
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage],
      }));
    };
    reader.readAsDataURL(file); // Convert the file to a Data URL
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      Array.from(files).forEach((file) => addImage(file));
    }
    e.target.value = ""; // Reset file input
  };
  const removeImage = (imageId) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-1'>Title</label>
        <input
          type='text'
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className='w-full p-2 border rounded-md'
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-1'>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          className='w-full p-2 border rounded-md'
          rows={3}
        />
      </div>

      {/* <div>
        <label className='block text-sm font-medium mb-1'>Add Images</label>
        <div className='flex gap-2'>
          <input
            type='file'
            accept='image/*'
            multiple
            onChange={handleFileChange}
            className='flex-1 p-2 border rounded-md'
          />
        </div>
      </div> */}
      <div>
        <label className='block text-sm font-medium mb-1'>Add Images</label>
        <div className='flex gap-2'>
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleFileChange}
            className='hidden'
            multiple
            accept='image/*'
          />
          <Button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            className='w-full'>
            <Upload className='h-4 w-4 mr-2' />
            Choose Images
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-3 gap-4'>
        {formData.images.map((image) => (
          <div key={image.id} className='relative group'>
            <img
              src={image.src}
              alt={image.alt}
              className='w-full h-32 object-cover rounded-lg'
            />
            <button
              type='button'
              onClick={() => removeImage(image.id)}
              className='absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
              <X className='h-4 w-4' />
            </button>
          </div>
        ))}
      </div>

      <div className='flex justify-end gap-2'>
        <Button type='button' variant='ghost' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit'>
          {collection ? "Save Changes" : "Create Collection"}
        </Button>
      </div>
    </form>
  );
};

export default CollectionForm;
