import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  BarChart3, 
  Newspaper, 
  Network,
  Settings,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'demo-trading', label: 'Demo Trading', icon: Wallet },
  { id: 'backtesting', label: 'Backtesting', icon: History },
  { id: 'strategies', label: 'Strategies', icon: BarChart3 },
  { id: 'news', label: 'News Analysis', icon: Newspaper },
  { id: 'bitnodes', label: 'Bitnodes', icon: Network },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0b0b0b] border-r border-[#222222] z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d0ff59] to-[#a8cc47] flex items-center justify-center">
            <Zap className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#f6f6f6]">CryptoAI Pro</h1>
            <p className="text-xs text-[#888888]">Intelligent Trading</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  'hover:bg-[#1a1a1a] group',
                  isActive 
                    ? 'bg-[#1a1a1a] border border-[#d0ff59]/30' 
                    : 'border border-transparent'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5 transition-colors',
                  isActive ? 'text-[#d0ff59]' : 'text-[#888888] group-hover:text-[#cccccc]'
                )} />
                <span className={cn(
                  'text-sm font-medium transition-colors',
                  isActive ? 'text-[#f6f6f6]' : 'text-[#888888] group-hover:text-[#cccccc]'
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d0ff59] animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[#222222]">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1a1a1a] transition-colors group">
          <Settings className="w-5 h-5 text-[#888888] group-hover:text-[#cccccc]" />
          <span className="text-sm font-medium text-[#888888] group-hover:text-[#cccccc]">Settings</span>
        </button>
      </div>
    </aside>
  );
}
