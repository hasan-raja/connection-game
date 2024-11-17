import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Edit, Plus, X } from "lucide-react";
import CollectionForm from "./CollectionForm";
import ImageRevealGallery from "./ImageRevealGallery";
import initializeDB from "./utils/db";

const STORE_NAME = import.meta.env.STORE_NAME;

// Main Gallery Component
const CollectionGallerySystem = () => {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      const db = await initializeDB();
      const storedCollections = await db.getAll(STORE_NAME);
      setCollections(storedCollections);
    };
    fetchCollections();
  }, []);

  const handleSaveCollection = async (collectionData) => {
    const db = await initializeDB();
    await db.put(STORE_NAME, collectionData);

    setCollections((prev) =>
      prev.some((c) => c.id === collectionData.id)
        ? prev.map((c) => (c.id === collectionData.id ? collectionData : c))
        : [...prev, collectionData]
    );

    setEditingCollection(null);
    setIsAddingNew(false);
  };

  const handleDeleteCollection = async (collectionId) => {
    const db = await initializeDB();
    await db.delete(STORE_NAME, collectionId);
    setCollections((prev) => prev.filter((c) => c.id !== collectionId));
  };

  const showCollectionList =
    !selectedCollection && !editingCollection && !isAddingNew;

  return (
    <Card className='w-full max-w-5xl mx-auto shadow-lg'>
      <CardHeader className='flex flex-row items-center justify-between p-6 bg-gray-100 sm:p-8 md:p-12 lg:p-16 xl:p-20 2xl:p-24'>
        <CardTitle className='text-xl font-bold'>Connection game</CardTitle>
        {showCollectionList && (
          <Button
            onClick={() => setIsAddingNew(true)}
            className='bg-blue-500 text-white flex items-center justify-center w-fill'>
            <Plus className='h-3 w-3 mr-1' />
            New connection
          </Button>
        )}
      </CardHeader>
      <CardContent className='p-6'>
        {selectedCollection ? (
          <ImageRevealGallery
            images={selectedCollection.images}
            onBack={() => setSelectedCollection(null)}
          />
        ) : editingCollection || isAddingNew ? (
          <CollectionForm
            collection={editingCollection}
            onSave={handleSaveCollection}
            onCancel={() => {
              setEditingCollection(null);
              setIsAddingNew(false);
            }}
          />
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
            {collections.map((collection) => (
              <Card
                key={collection.id}
                className='hover:bg-gray-50 transition-transform transform hover:scale-105 duration-300 ease-in-out'>
                <CardContent className='flex flex-col md:flex-row items-center gap-4 p-4'>
                  <div className='overflow-hidden rounded-full shadow-md flex items-center justify-center'>
                    <img
                      src={collection.images[0]?.src}
                      alt='Thumbnail'
                      className='h-20 w-20 object-fill'
                    />
                  </div>
                  <div className='text-center md:text-left'>
                    <h3 className='text-lg font-semibold'>
                      {collection.title}
                    </h3>
                    <p className='text-sm text-gray-600'>
                      {collection.description}
                    </p>
                  </div>
                  <div className='mt-4 md:mt-0 md:ml-auto flex flex-wrap justify-center gap-2'>
                    <Button
                      onClick={() => setSelectedCollection(collection)}
                      variant='outline'
                      className='hover:bg-blue-100 transition duration-200 ease-in-out'>
                      <FolderOpen className='h-4 w-4' />
                    </Button>
                    <Button
                      onClick={() => setEditingCollection(collection)}
                      variant='outline'
                      className='hover:bg-yellow-100 transition duration-200 ease-in-out'>
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                      onClick={() => handleDeleteCollection(collection.id)}
                      variant='destructive'
                      className='hover:bg-red-100 transition duration-200 ease-in-out'>
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CollectionGallerySystem;
