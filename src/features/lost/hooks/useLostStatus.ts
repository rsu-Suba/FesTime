import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { getPublicUrl } from "@/lib/Server/storage";

export const useLostStatus = () => {
  const {
    api: { fetchedData, isLoading },
  } = useData();
  const items = fetchedData?.lostItems || [];
  const [loadedImages, setLoadedImages] = useState<Record<string, string>>({});
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const handleShowImage = (id: string, path: string) => {
    if (loadedImages[id]) return;
    setLoadedImages((prev) => ({ ...prev, [id]: getPublicUrl(path) }));
  };
  const handleHideImage = (id: string) => {
    setLoadedImages((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };
  return {
    items,
    isLoading,
    loadedImages,
    loadingIds,
    handleShowImage,
    handleHideImage,
  };
};
