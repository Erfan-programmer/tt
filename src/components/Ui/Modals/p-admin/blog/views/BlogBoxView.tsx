"use client";
import React from "react";
import { BlogInlineBoxViewProps } from "@/types/p-admin/dashoard";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import {FaEdit, FaEye, FaTrash } from "react-icons/fa";

export default function BlogBoxView({ blogs,
  onEdit,
  onDelete,
}: BlogInlineBoxViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-[#0d111d]">
      {blogs.map((blog) => (
        <motion.div
          key={blog.id}
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col border border-[#2a2f3a] rounded-xl overflow-hidden shadow-lg bg-[#161b2b] hover:shadow-[#2a2f3a]/50 transition-shadow duration-300"
        >
          <Link href={`/blog-info/${blog.id}`} className="relative w-full h-48">
            {blog.image ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${blog.image}`}
                alt={blog.title || "Blog"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-[#2a2f3a]" />
            )}
          </Link>

          <div className="p-4 flex flex-col flex-1">
            {blog.category?.title && (
              <motion.button
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-blue-500 text-[.8rem] border-[2px] border-blue-500 px-2 py-1 rounded w-fit mb-2"
              >
                {blog.category.title}
              </motion.button>
            )}

            <motion.h3
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="font-bold text-lg text-white"
            >
              {blog.title}
            </motion.h3>

            <motion.p
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="text-sm text-gray-400 mt-1 flex-1"
            >
              {blog.short_description}
            </motion.p>

            {blog.author && (
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="text-[.8rem] text-gray-500 mt-2"
              >
                By {blog.author}
              </motion.p>
            )}

            {blog.tags && blog.tags.length > 0 && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="flex gap-2 flex-wrap mt-2"
              >
                {blog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[.8rem] text-blue-400 bg-[#2a2f3a] px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </motion.div>
            )}

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="flex justify-between items-center mt-8"
            >
              <span className="text-[.8rem] text-gray-500">
                {blog.created_at
                  ? new Date(blog.created_at).toLocaleDateString()
                  : ""}
              </span>
              <div className="flex gap-2 items-center justify-end">
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
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
