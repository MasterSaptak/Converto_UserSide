import Link from "next/link";
import { useRewards } from "@/hooks/useRewards";

interface RewardsWidgetProps {
  className?: string;
}

export function RewardsWidget({ className }: RewardsWidgetProps) {
  const { rewards, tierInfo } = useRewards();
  const lifetimeCPoints = rewards?.lifetime_c_points || 0;

  return (
    <div className={`flex flex-col gap-4 ${className || ''}`}>
      <Link href="/profile" className="border-2 border-foreground bg-card p-3 relative overflow-hidden group block hover:bg-secondary/50 transition-colors">
        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/3 group-hover:scale-150 transition-transform duration-500"></div>
        <span className="text-[10px] font-bold uppercase tracking-widest block mb-1 opacity-80">
          {tierInfo.current.icon || '🏆'} Converto Rewards
        </span>

        <div className="flex items-end justify-between mb-2">
          <span className="text-xl font-heading font-bold text-primary">{lifetimeCPoints.toLocaleString()} C</span>
          <span className="text-[10px] font-bold opacity-60 uppercase">{tierInfo.current.name} Tier</span>
        </div>

        <div className="w-full h-2 bg-secondary border-2 border-foreground overflow-hidden mb-2">
          <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${tierInfo.progress}%` }}></div>
        </div>

        {tierInfo.next ? (
          <span className="text-[9px] uppercase tracking-widest font-bold opacity-60">
            {(tierInfo.next.minPoints - lifetimeCPoints).toLocaleString()} C until {tierInfo.next.name}
          </span>
        ) : (
          <span className="text-[9px] uppercase tracking-widest font-bold opacity-60">
            Max Tier Reached!
          </span>
        )}
      </Link>
    </div>
  );
}
