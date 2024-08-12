'use client'
'use client'
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import React, { useState } from 'react';

const HomePage = () => {
  const createPost = useMutation(api.blog.createBlog);
  const posts = useQuery(api.blog.getBlogPosts);
  const generateUploadUrl = useMutation(api.blog.generateUploadUrl);

  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formValues.name || !formValues.description || !formValues.file) {
      alert("Please fill out all fields and select a file.");
      return;
    }

    try {
      // Step 1: Generate an upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: Upload the image file to the generated URL
      const uploadResponse = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": formValues.file.type },
        body: formValues.file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Image upload failed");
      }

      const { storageId } = await uploadResponse.json();

      // Step 3: Create the blog post with the uploaded image's storageId
      await createPost({
        name: formValues.name,
        description: formValues.description,
        imageUrl: storageId, // Ensure the field name matches what is used on the server
      });

      // Clear the form after successful submission
      setFormValues({
        name: '',
        description: '',
        file: null,
      });

      alert("Post created successfully!");

    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  return (
    <div>
      <h1>New Post</h1>
      <form onSubmit={handleSubmit}>
        <span>Name</span>
        <input
          placeholder='Name...'
          name='name'
          value={formValues.name}
          onChange={handleChange}
        />
        <textarea
          placeholder='Description...'
          name='description'
          value={formValues.description}
          onChange={handleChange}
        />
        <input
          name='file'
          type='file'
          onChange={handleChange}
        />
        <button type='submit'>Post</button>
      </form>

      <div>
        <h1>All Posts</h1>
        {posts?.map(post => (
          <div key={post._id}>
            <p>{post.name}</p>
            {post.imageUrl && (
              <img
              src={post?.imageUrl}
                alt={post.name}
                style={{ maxWidth: '100%' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
