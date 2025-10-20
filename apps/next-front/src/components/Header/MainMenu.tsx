import { LocaleLink } from '@/components/LocaleLink';
import { getMenuItems } from '@/lib/wordpress';

interface MenuItem {
  id: string;
  label: string;
  url: string;
  path: string;
  parentId: string | null;
  cssClasses: string[];
  description: string;
  target: string;
  title: string;
  childItems?: {
    nodes: MenuItem[];
  };
}

export default async function MainMenu() {
  const menuItems = await getMenuItems('PRIMARY');
  
  return (
    <nav className="hidden md:flex items-center space-x-8">
      {menuItems.map((item: MenuItem) => (
        <div key={item.id} className="relative group">
          <LocaleLink
            href={item.path || item.url}
            className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            target={item.target === '_blank' ? '_blank' : undefined}
            rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
          >
            {item.label}
          </LocaleLink>
          
          {/* Dropdown menu for child items */}
          {item.childItems && item.childItems.nodes.length > 0 && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                {item.childItems.nodes.map((child: MenuItem) => (
                  <LocaleLink
                    key={child.id}
                    href={child.path || child.url}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    target={child.target === '_blank' ? '_blank' : undefined}
                    rel={child.target === '_blank' ? 'noopener noreferrer' : undefined}
                  >
                    {child.label}
                  </LocaleLink>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
} 