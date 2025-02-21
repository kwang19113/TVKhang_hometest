"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const App: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // For displaying the dragged image
  const [numPeople, setNumPeople] = useState<number | null>(null); // For displaying number of people

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file as FileType);
    });

    setUploading(true);

    fetch(`${apiUrl}/upload/`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFileList([]);
        setImageUrl(`${apiUrl}${data.image_url}`); // Set the image URL from the response
        setNumPeople(data.num_people); // Set the number of people from the response
        message.success('Upload successfully');
        console.log(data);
      })
      .catch(() => {
        message.error('Upload failed');
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image')) {
      setImageUrl(URL.createObjectURL(file)); // Show the dragged image
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const clear = () => {
    // Reset all states to their initial values
    setFileList([]);
    setUploading(false);
    setImageUrl(null);
    setNumPeople(null);
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-white">
        <div
          className="flex flex-col justify-end items-center p-8 border-4 border-white w-96 h-96 text-center bg-white shadow-lg"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {imageUrl ? (
            <>
              <img src={imageUrl} alt="Uploaded Image" className="object-contain mb-4 shadow-lg" />
              {numPeople !== null && (
                <div className="text-black text-lg mt-4">
                  <p>Number of People: {numPeople}</p>
                </div>
              )}
            </>
          ) : (
            <Upload {...props}>
              <Button
                icon={<UploadOutlined />}
                className="border-none bg-white text-black hover:bg-black hover:text-white px-6 py-2 mt-auto"
              >
                Select File
              </Button>
            </Upload>
          )}

          <Button
            type="primary"
            onClick={imageUrl ? clear : handleUpload}
            disabled={fileList.length === 0 && !imageUrl}
            loading={uploading}
            style={{ marginTop: 16 }}
            className={`${
              imageUrl ? "bg-white border border-black text-black hover:bg-black hover:text-white shadow-lg" : "shadow-lg bg-white border border-black text-black hover:bg-black hover:text-white"
            } px-6 py-2 mt-2 rounded-none shadow-lg`}
          >
            {imageUrl ? 'Clear' : uploading ? 'Uploading' : 'Start Upload'}
          </Button>
        </div>
      </div>

      {/* Fixed HOME button */}
      <div className="fixed bottom-5 left-5">
        <Link href="/">
          <button className="bg-white hover:bg-black text-black hover:text-white font-bold py-3 px-4 ml-10 rounded-full shadow-md">
            HOME
          </button>
        </Link>
      </div>
    </>
  );
};

export default App;
