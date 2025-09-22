import React from "react";

export default function Breadcrumbs({ items }: { items: string[] }) {
  return (
    <div className=" hidden sm:flex justify-start items-center gap-3 w-[95%] mx-auto my-4">
      {items.map((road, index) => (
        <React.Fragment key={index}>
          <p className="text-[var(--main-background)] dark:text-white">{road}</p>
          {index !== items.length - 1 && <span className="text-[var(--main-background)] dark:text-white">|</span>} 
        </React.Fragment>
      ))}
    </div>
  );
}
