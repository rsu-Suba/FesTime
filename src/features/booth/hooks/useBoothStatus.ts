import { useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useData } from "@/contexts/DataContext";
import { useRole } from "@/contexts/RoleContext";
import { StatusLevel } from "@/features/booth/types";
import { updateStallStatus } from "@/features/booth/api";;
import { useFavorites } from "@/features/booth/hooks/useFavorites";

export const useBoothStatus = (split?: "first" | "second", onlyFavorites?: boolean) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    api: { fetchedData, isLoading, fetchData, lastUpdated, isStallsLive },
  } = useData();
  const { isAdmin, isStallAdmin, assignedStall } = useRole();
  const allStatuses = fetchedData?.stalls || [];

  const { favorites, toggleFavorite, mounted } = useFavorites();

  const statuses = useMemo(() => {
    let sortedStatuses = [...allStatuses].sort((a, b) => Number(a.id) - Number(b.id));

    if (onlyFavorites) {
      sortedStatuses = sortedStatuses.filter((status) => favorites.includes(status.stallName));
    }

    if (!split) return sortedStatuses;
    const mid = Math.floor(sortedStatuses.length / 2);
    return split === "first" ? sortedStatuses.slice(0, mid) : sortedStatuses.slice(mid);
  }, [allStatuses, split, onlyFavorites, favorites]);

  const handleStallClick = (stallName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("booth-info", stallName);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const cycleStatus = (current: StatusLevel): StatusLevel => (((current + 1) % 3) as StatusLevel);

  const canEdit = (stallName: string) => {
    if (isAdmin) return true;
    if (isStallAdmin && assignedStall === stallName) return true;
    return false;
  };

  const handleStatusUpdate = async (stallName: string, updates: Parameters<typeof updateStallStatus>[1], current: StatusLevel) => {
    if (!canEdit(stallName)) return;
    await updateStallStatus(stallName, updates);
    fetchData();
  };

  const handleCrowdClick = (stallName: string, currentLevel: StatusLevel) =>
    handleStatusUpdate(stallName, { crowdLevel: cycleStatus(currentLevel) }, currentLevel);

  const handleStockClick = (stallName: string, currentLevel: StatusLevel) =>
    handleStatusUpdate(stallName, { stockLevel: cycleStatus(currentLevel) }, currentLevel);

  return {
    isLoading,
    mounted,
    statuses,
    lastUpdated,
    isStallsLive,
    favorites,
    toggleFavorite,
    handleStallClick,
    handleCrowdClick,
    handleStockClick,
    canEdit,
  };
};
