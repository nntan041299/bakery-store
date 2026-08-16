import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSignOut } from "@/hook/useSignOut";
import { selectUser } from "@/redux/user/selectors";
import { SIDEBAR_TEXT } from "@/constant/sidebar";
import { FONT_DISPLAY, FONT_SANS } from "@/constant/common";

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const BASE_NAV_ITEMS: NavItem[] = [
  { path: "/", label: SIDEBAR_TEXT.HOME, icon: "pi-th-large" },
];

const SHOP_OWNER_NAV_ITEMS: NavItem[] = [
  { path: "/products", label: SIDEBAR_TEXT.INVENTORY, icon: "pi-box" },
];

interface SideBarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function SideBar({ open, onClose }: SideBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useSelector(selectUser);

  const navItems =
    role === "SHOP_OWNER"
      ? [...BASE_NAV_ITEMS, ...SHOP_OWNER_NAV_ITEMS]
      : BASE_NAV_ITEMS;

  const { mutate: handleSignOut, isPending } = useSignOut();

  const handleNav = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const sidebarContent = (
    <aside className="w-60 h-full flex flex-col flex-shrink-0 bg-ink-900 select-none">
      {/* Brand */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-white/8 flex-shrink-0">
        <span
          className="text-lg font-bold tracking-tight text-parchment"
          style={{ fontFamily: FONT_DISPLAY }}
        >
          {SIDEBAR_TEXT.BRAND_PREFIX}{" "}
          <span className="text-gold-500">{SIDEBAR_TEXT.BRAND_SUFFIX}</span>
        </span>
        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-white/50 hover:text-white transition-colors p-1 cursor-pointer"
            aria-label={SIDEBAR_TEXT.CLOSE_MENU}
          >
            <i className="pi pi-times text-base" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ path, label, icon }) => {
          const active =
            path === "/"
              ? location.pathname === path
              : location.pathname.startsWith(path);
          return (
            <button
              key={path}
              onClick={() => handleNav(path)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-150 cursor-pointer text-left
                ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/6 hover:text-white/80"
                }
              `}
              style={{ fontFamily: FONT_SANS }}
            >
              <i
                className={`pi ${icon} text-sm ${active ? "text-gold-400" : ""}`}
              />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-white/8">
        <button
          onClick={() => handleSignOut()}
          disabled={isPending}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                     text-white/40 hover:bg-white/6 hover:text-white/70
                     transition-colors duration-150 cursor-pointer
                     disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ fontFamily: FONT_SANS }}
        >
          <i className="pi pi-sign-out text-sm" />
          {isPending ? SIDEBAR_TEXT.SIGNING_OUT : SIDEBAR_TEXT.SIGN_OUT}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex h-full">{sidebarContent}</div>

      {/* Mobile drawer */}
      {open !== undefined && (
        <>
          {/* Backdrop */}
          <div
            className={`
              fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden
              ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
            `}
            onClick={onClose}
          />
          {/* Drawer */}
          <div
            className={`
              fixed inset-y-0 left-0 z-50 flex h-full transition-transform duration-300 md:hidden
              ${open ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
}
