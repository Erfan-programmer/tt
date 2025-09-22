import SluDetailPage from "@/components/modules/p-admin/SettingPage/SlugDetailPage";
import React from "react";

interface SlugPageProps {
  params: {
    slug: string
  };
}

export default function SlugDetail({ params }: SlugPageProps) {
  return <SluDetailPage slug={params.slug} />;
}
