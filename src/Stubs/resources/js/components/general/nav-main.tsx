import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { type NavItem } from '@/types'
import { Link, usePage } from '@inertiajs/react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'

export function NavMain({ items = [] }: { items: NavItem[] }) {
  const page = usePage()

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          item.children && item.children.length > 0 ? (
            <Collapsible key={item.title} 
              defaultOpen={
                item.href
                  ? page.url.startsWith(item.href)
                  : item.children?.some((child) =>
                      page.url.startsWith(child.href || '')
                    )
              }
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton isActive={item.children.some((c) => page.url.startsWith(c.href || ''))}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.children.map((child) => (
                      <SidebarMenuSubItem key={child.title}>
                        <SidebarMenuButton asChild isActive={page.url.startsWith(child.href || '')}>
                          <Link href={child.href || '#'}>
                            {child.icon && <child.icon />}
                            <span>{child.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={page.url.startsWith(item.href || '')}
                tooltip={{ children: item.title }}
              >
                <Link href={item.href || '#'}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
