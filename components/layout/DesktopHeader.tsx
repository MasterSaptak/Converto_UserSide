import { NotificationBell } from './NotificationBell';
import { ProfileDropdown } from './ProfileDropdown';

export function DesktopHeader() {
  return (
    <div className="hidden lg:flex justify-end p-4 lg:px-8 xl:px-12 lg:pt-8 absolute top-0 right-0 z-40 w-full pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-4">
        <NotificationBell />
        <ProfileDropdown />
      </div>
    </div>
  );
}
