import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createBlog = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.id("_storage")), // Corrected the field name to `imageUrl`
  },
  handler: async (ctx, args) => {
    const newPostId = await ctx.db.insert("blog", {
      name: args.name,
      description: args.description,
      imageUrl: args.imageUrl, // Corrected the field name to `imageUrl`
    });
    return newPostId;
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const sendImage = mutation({
  args: { imageUrl: v.id("_storage"), author: v.string() }, // Corrected the field name to `imageUrl`
  handler: async (ctx, args) => {
    await ctx.db.insert("images", {
      storageId: args.imageUrl, // Assuming you meant to store the storageId here
      author: args.author,
      format: "image",
    });
  },
});

export const getBlogPosts = query({
  handler: async(ctx) => {
    // Fetch all blog posts
    const blogs = await ctx.db.query('blog').collect();

    // For each blog post, get the image URL from the storageId
    const blogsWithImages = await Promise.all(blogs.map(async (blog) => {
      if (blog.imageUrl) {
        // Fetch the URL for the stored file
        const imageUrl = await ctx.storage.getUrl(blog.imageUrl);
        return { ...blog, imageUrl };  // Include the URL in the response
      } else {
        return blog;  // If no imageUrl, return the blog as is
      }
    }));

    return blogsWithImages;  // Return blogs with the image URLs included
  }
});
