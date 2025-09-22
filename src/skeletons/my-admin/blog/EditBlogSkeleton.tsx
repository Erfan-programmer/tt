"use client";
import React from "react";

export default function EditBlogSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* Title */}
      <div className="h-8 w-1/2 bg-gray-700 rounded animate-pulse"></div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
      </div>

      {/* Tags */}
      <div className="h-20 bg-gray-700 rounded animate-pulse"></div>

      {/* Image Upload */}
      <div className="h-48 w-full bg-gray-700 rounded-lg animate-pulse"></div>

      {/* CKEditor / Long Description */}
      <div className="h-64 w-full bg-gray-700 rounded animate-pulse"></div>

      {/* Save Button */}
      <div className="h-10 w-32 bg-gray-600 rounded animate-pulse mt-4"></div>
    </div>
  );
}
