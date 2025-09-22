import RankSlider from "./RankSlider";
import TeamRankContentSkeleton from "@/skeletons/User-Panel/dashboard/TeamRankContentSkeleton";




export default function TeamRankProgessionContent({
  ranks,
  loading,
}: {
  ranks?: any[];
  loading?: boolean;
}) {
  if (loading) return <TeamRankContentSkeleton />;
  return (
    <div className="team-account-analytic-content px-4 sm:px-[2rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-xl py-4">
      <RankSlider ranks={ranks} />
    </div>
  );
}
