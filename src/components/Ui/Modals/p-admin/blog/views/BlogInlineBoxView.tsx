"use client";
import Image from "next/image";
import React from "react";
import {BlogInlineBoxViewProps } from "@/types/p-admin/dashoard";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";



export default function BlogInlineBoxView({
  blogs,
  onEdit,
  onDelete,
}: BlogInlineBoxViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0d111d] p-6">
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="flex flex-col md:flex-row items-start justify-between border border-[#2a2f3a] p-4 rounded-xl bg-[#161b2b] shadow-lg hover:shadow-[#2a2f3a]/50 transition-shadow duration-300"
        >
          {blog.image ? (
            <div className="w-32 h-32 rounded-lg overflow-hidden relative flex-shrink-0">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${blog.image}`}
                alt={blog.title || "Blog"}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-[#2a2f3a] rounded-lg flex-shrink-0" />
          )}

          <div className="flex-1 ml-0 md:ml-4 mt-4 md:mt-0">
            <h4 className="font-semibold text-lg text-white">{blog.title}</h4>
            <p className="text-sm text-gray-400 mt-1">
              {blog.short_description}
            </p>

            {blog.author && (
              <p className="text-[.8rem] text-gray-500 mt-1">By {blog.author}</p>
            )}
            {blog.category?.title && (
              <span className="text-[.8rem] text-blue-400 mt-1 inline-block">
                {blog.category.title}
              </span>
            )}

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex gap-2 items-center mt-2 flex-wrap">
                {blog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[.8rem] bg-[#2a2f3a] text-blue-400 px-2 py-1 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            <span className="text-[.8rem] text-gray-500 mt-4 md:mt-0  whitespace-nowrap">
              {blog.created_at
                ? new Date(blog.created_at).toLocaleDateString()
                : ""}
            </span>
          </div>

          <div className="flex gap-2 mt-4 items-center justify-end">
            <button onClick={() => onEdit?.(blog)}>
              <FaEye className="text-blue-500 hover:text-blue-600 transition" />
            </button>
            <button onClick={() => onEdit?.(blog)}>
              <FaEdit className=" text-yellow-500 rounded hover:text-yellow-600 " />
            </button>
            <button onClick={() => onDelete?.(blog)}>
              <FaTrash className=" text-red-500 rounded hover:text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
