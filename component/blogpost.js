'use client'
import React from 'react'

const BlogPost = ({blog}) => {
  console.log("Blog component ", blog)
  return (
    <div>
        <h2>{blog.name}</h2>
        <img
        src={blog?.imageUrl}
        alt={blog.name}
        />
    </div>
  )
}

export default BlogPost