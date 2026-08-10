import { NotificationBell } from './NotificationBell';
import { ProfileDropdown } from './ProfileDropdown';

export function DesktopHeader() {
  return (
    <div className="hidden md:flex justify-end p-4 md:px-12 md:pt-8 absolute top-0 right-0 z-40 w-full pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-4">
        <NotificationBell />
        <ProfileDropdown />
      </div>
    </div>
  );
}
