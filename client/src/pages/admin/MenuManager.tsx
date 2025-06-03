import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Trash2, Edit, Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Link } from 'wouter';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Types for Menu and MenuItem
interface Menu {
  id: number;
  name: string;
  location: string;
  description: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MenuItem {
  id: number;
  title: string;
  url?: string;
  icon: string | null;
  iconType?: string;
  itemType?: string;
  order: number;
  menuId: number;
  parentId: number | null;
  target: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const MenuManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [showMenuDialog, setShowMenuDialog] = useState(false);
  const [showMenuItemDialog, setShowMenuItemDialog] = useState(false);
  const [isMenuItemCreate, setIsMenuItemCreate] = useState(true);
  
  // Form states
  const [menuForm, setMenuForm] = useState({
    name: '',
    location: '',
    description: '',
    active: true
  });
  
  const [menuItemForm, setMenuItemForm] = useState({
    title: '',
    url: '',
    icon: '',
    iconType: 'fas',
    itemType: 'link',
    order: 0,
    menuId: 0,
    parentId: null as number | null,
    target: '_self',
    active: true
  });
  
  // Fetch all menus
  const { data: menus, isLoading: menusLoading } = useQuery({
    queryKey: ['/api/admin/menus'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/admin/menus');
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching menus:', error);
        return [];
      }
    }
  });
  
  // Fetch menu items for selected menu
  const { data: menuItems, isLoading: menuItemsLoading } = useQuery({
    queryKey: ['/api/admin/menus', selectedMenu?.id, 'items'],
    queryFn: async () => {
      if (!selectedMenu) return [];
      
      try {
        // Fetch menu items for the selected menu
        const response = await fetch(`/api/admin/menus/${selectedMenu.id}/items`);
        if (response.ok) {
          return await response.json();
        } else {
          console.error(`Error fetching menu items: ${response.status}`);
          return [];
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        return [];
      }
    },
    enabled: !!selectedMenu
  });
  
  // Create menu mutation
  const createMenuMutation = useMutation({
    mutationFn: async (menu: Omit<Menu, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await fetch('/api/admin/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menu),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error ${response.status}: ${text || response.statusText}`);
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/menus'] });
      toast({
        title: 'Menu created',
        description: 'The menu has been created successfully.',
      });
      resetMenuForm();
      setShowMenuDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating menu',
        description: error.message || 'An error occurred while creating the menu.',
        variant: 'destructive',
      });
    }
  });
  
  // Update menu mutation
  const updateMenuMutation = useMutation({
    mutationFn: async (menu: Partial<Menu> & { id: number }) => {
      const response = await fetch(`/api/admin/menus/${menu.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menu),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error ${response.status}: ${text || response.statusText}`);
      }
      
      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/menus'] });
      toast({
        title: 'Menu updated',
        description: 'The menu has been updated successfully.',
      });
      setShowMenuDialog(false);
      if (selectedMenu?.id === variables.id) {
        setSelectedMenu(prev => prev ? { ...prev, ...variables } : null);
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating menu',
        description: error.message || 'An error occurred while updating the menu.',
        variant: 'destructive',
      });
    }
  });
  
  // Delete menu mutation
  const deleteMenuMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/menus/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error ${response.status}: ${text || response.statusText}`);
      }
      
      return await response.json();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/menus'] });
      toast({
        title: 'Menu deleted',
        description: 'The menu has been deleted successfully.',
      });
      if (selectedMenu?.id === id) {
        setSelectedMenu(null);
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting menu',
        description: error.message || 'An error occurred while deleting the menu.',
        variant: 'destructive',
      });
    }
  });
  
  // Create menu item mutation
  const createMenuItemMutation = useMutation({
    mutationFn: (menuItem: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => 
      apiRequest<MenuItem>('/api/admin/menu-items', { 
        method: 'POST', 
        body: JSON.stringify(menuItem)
      }),
    onSuccess: () => {
      if (selectedMenu) {
        queryClient.invalidateQueries({ queryKey: ['/api/admin/menus', selectedMenu.id, 'items'] });
      }
      toast({
        title: 'Menu item created',
        description: 'The menu item has been created successfully.',
      });
      resetMenuItemForm();
      setShowMenuItemDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating menu item',
        description: error.message || 'An error occurred while creating the menu item.',
        variant: 'destructive',
      });
    }
  });
  
  // Update menu item mutation
  const updateMenuItemMutation = useMutation({
    mutationFn: (menuItem: Partial<MenuItem> & { id: number }) => 
      apiRequest<MenuItem>(`/api/admin/menu-items/${menuItem.id}`, { 
        method: 'PUT', 
        body: JSON.stringify(menuItem)
      }),
    onSuccess: () => {
      if (selectedMenu) {
        queryClient.invalidateQueries({ queryKey: ['/api/admin/menus', selectedMenu.id, 'items'] });
      }
      toast({
        title: 'Menu item updated',
        description: 'The menu item has been updated successfully.',
      });
      setShowMenuItemDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating menu item',
        description: error.message || 'An error occurred while updating the menu item.',
        variant: 'destructive',
      });
    }
  });
  
  // Delete menu item mutation
  const deleteMenuItemMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/admin/menu-items/${id}`, { 
        method: 'DELETE'
      }),
    onSuccess: () => {
      if (selectedMenu) {
        queryClient.invalidateQueries({ queryKey: ['/api/admin/menus', selectedMenu.id, 'items'] });
      }
      toast({
        title: 'Menu item deleted',
        description: 'The menu item has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting menu item',
        description: error.message || 'An error occurred while deleting the menu item.',
        variant: 'destructive',
      });
    }
  });
  
  // Reset form states
  const resetMenuForm = () => {
    setMenuForm({
      name: '',
      location: '',
      description: '',
      active: true
    });
  };
  
  const resetMenuItemForm = () => {
    setMenuItemForm({
      title: '',
      url: '',
      icon: '',
      iconType: 'fas',
      itemType: 'link',
      order: menuItems ? menuItems.length : 0,
      menuId: selectedMenu?.id || 0,
      parentId: null,
      target: '_self',
      active: true
    });
  };
  
  // Handle opening the edit menu dialog
  const handleEditMenu = (menu: Menu) => {
    setMenuForm({
      name: menu.name,
      location: menu.location,
      description: menu.description || '',
      active: menu.active
    });
    setSelectedMenu(menu);
    setShowMenuDialog(true);
  };
  
  // Handle opening the create menu dialog
  const handleCreateMenu = () => {
    resetMenuForm();
    setSelectedMenu(null);
    setShowMenuDialog(true);
  };
  
  // Handle menu submit
  const handleMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!menuForm.name || !menuForm.location) {
      toast({
        title: 'Validation error',
        description: 'Name and location are required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    if (selectedMenu) {
      // Update existing menu
      updateMenuMutation.mutate({
        id: selectedMenu.id,
        ...menuForm
      });
    } else {
      // Create new menu
      createMenuMutation.mutate(menuForm);
    }
  };
  
  // Handle delete menu
  const handleDeleteMenu = (id: number) => {
    if (window.confirm('Are you sure you want to delete this menu? This will also delete all menu items.')) {
      deleteMenuMutation.mutate(id);
    }
  };
  
  // Handle opening the edit menu item dialog
  const handleEditMenuItem = (menuItem: MenuItem) => {
    setMenuItemForm({
      title: menuItem.title,
      url: menuItem.url || '',
      icon: menuItem.icon || '',
      iconType: menuItem.iconType || 'fas',
      itemType: menuItem.itemType || 'link',
      order: menuItem.order,
      menuId: menuItem.menuId,
      parentId: menuItem.parentId,
      target: menuItem.target || '_self',
      active: menuItem.active
    });
    setSelectedMenuItem(menuItem);
    setIsMenuItemCreate(false);
    setShowMenuItemDialog(true);
  };
  
  // Handle opening the create menu item dialog
  const handleCreateMenuItem = () => {
    if (!selectedMenu) {
      toast({
        title: 'No menu selected',
        description: 'Please select a menu first before creating a menu item.',
        variant: 'destructive',
      });
      return;
    }
    
    resetMenuItemForm();
    setIsMenuItemCreate(true);
    setShowMenuItemDialog(true);
  };
  
  // Handle menu item submit
  const handleMenuItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!menuItemForm.title || !menuItemForm.url) {
      toast({
        title: 'Validation error',
        description: 'Title and URL are required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!selectedMenu) {
      toast({
        title: 'No menu selected',
        description: 'Please select a menu first.',
        variant: 'destructive',
      });
      return;
    }
    
    const submitData = {
      ...menuItemForm,
      menuId: selectedMenu.id
    };
    
    if (isMenuItemCreate) {
      // Create new menu item
      createMenuItemMutation.mutate(submitData);
    } else if (selectedMenuItem) {
      // Update existing menu item
      updateMenuItemMutation.mutate({
        id: selectedMenuItem.id,
        ...submitData
      });
    }
  };
  
  // Handle delete menu item
  const handleDeleteMenuItem = (id: number) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      deleteMenuItemMutation.mutate(id);
    }
  };
  
  // Set the selected menu from the table
  const handleSelectMenu = (menu: Menu) => {
    setSelectedMenu(menu);
  };
  
  // Effect to initialize menuItemForm.menuId when selectedMenu changes
  useEffect(() => {
    if (selectedMenu) {
      setMenuItemForm(prev => ({
        ...prev,
        menuId: selectedMenu.id
      }));
    }
  }, [selectedMenu]);
  
  // Organize menu items in a parent-child structure
  const organizeMenuItems = (items: MenuItem[] = []): { item: MenuItem, children: MenuItem[] }[] => {
    const topLevelItems = items.filter(item => !item.parentId);
    
    return topLevelItems.map(item => {
      const children = items.filter(child => child.parentId === item.id);
      return { item, children };
    });
  };
  
  const organizedMenuItems = organizeMenuItems(menuItems);
  
  return (
    <DashboardLayout>
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button variant="link">Dashboard</Button>
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Menu Management</span>
          </div>
        </div>
        
        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Menu Management</h1>
        </div>
        
        {/* Main Content */}
        <div className="flex space-x-6">
          {/* Menus panel */}
          <div className="w-1/3 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Menus</h2>
              <Button onClick={handleCreateMenu} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Menu
              </Button>
            </div>
            
            {menusLoading ? (
              <div className="text-center py-4">Loading menus...</div>
            ) : menus && menus.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menus.map((menu: Menu) => (
                    <TableRow 
                      key={menu.id} 
                      className={selectedMenu?.id === menu.id ? 'bg-muted' : ''}
                      onClick={() => handleSelectMenu(menu)}
                    >
                      <TableCell className="font-medium">{menu.name}</TableCell>
                      <TableCell>{menu.location}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${menu.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {menu.active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={(e) => {
                            e.stopPropagation();
                            handleEditMenu(menu);
                          }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMenu(menu.id);
                          }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No menus found. Create your first menu to get started.
              </div>
            )}
          </div>
          
          {/* Menu items panel */}
          <div className="w-2/3 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedMenu ? `Menu Items for ${selectedMenu.name}` : 'Menu Items'}
              </h2>
              <Button 
                onClick={handleCreateMenuItem} 
                size="sm" 
                disabled={!selectedMenu}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Menu Item
              </Button>
            </div>
            
            {!selectedMenu ? (
              <div className="text-center py-10 text-muted-foreground">
                Please select a menu from the left panel to view and manage its items.
              </div>
            ) : menuItemsLoading ? (
              <div className="text-center py-4">Loading menu items...</div>
            ) : organizedMenuItems.length > 0 ? (
              <div className="space-y-4">
                {organizedMenuItems.map(({ item, children }) => (
                  <div key={item.id} className="border rounded-md">
                    <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                      <div className="flex items-center">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-sm text-muted-foreground ml-2">({item.url})</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditMenuItem(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteMenuItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {children.length > 0 && (
                      <div className="pl-6 pr-4 py-2 border-t">
                        {children.map((child: MenuItem) => (
                          <div key={child.id} className="flex items-center justify-between py-2">
                            <div className="flex items-center">
                              <ChevronRight className="h-4 w-4 text-muted-foreground mr-2" />
                              <span>{child.title}</span>
                              <span className="text-sm text-muted-foreground ml-2">({child.url})</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditMenuItem(child)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteMenuItem(child.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No menu items found for this menu. Add your first menu item to get started.
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Menu form dialog */}
      <Dialog open={showMenuDialog} onOpenChange={setShowMenuDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMenu ? 'Edit Menu' : 'Create New Menu'}</DialogTitle>
            <DialogDescription>
              {selectedMenu 
                ? 'Update the details for this menu.' 
                : 'Fill in the details to create a new menu.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleMenuSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name"
                    placeholder="Main Menu"
                    value={menuForm.name}
                    onChange={(e) => setMenuForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location"
                    placeholder="header"
                    value={menuForm.location}
                    onChange={(e) => setMenuForm(prev => ({ ...prev, location: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  placeholder="Main navigation menu shown in the header"
                  value={menuForm.description}
                  onChange={(e) => setMenuForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="active"
                  checked={menuForm.active}
                  onCheckedChange={(checked) => setMenuForm(prev => ({ ...prev, active: checked }))}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowMenuDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {selectedMenu ? 'Update Menu' : 'Create Menu'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Menu item form dialog */}
      <Dialog open={showMenuItemDialog} onOpenChange={setShowMenuItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isMenuItemCreate ? 'Add Menu Item' : 'Edit Menu Item'}</DialogTitle>
            <DialogDescription>
              {isMenuItemCreate 
                ? 'Create a new menu item for this menu.' 
                : 'Update the details for this menu item.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleMenuItemSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title"
                  placeholder="Home"
                  value={menuItemForm.title}
                  onChange={(e) => setMenuItemForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input 
                  id="url"
                  placeholder="/"
                  value={menuItemForm.url}
                  onChange={(e) => setMenuItemForm(prev => ({ ...prev, url: e.target.value }))}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Input 
                    id="icon"
                    placeholder="home"
                    value={menuItemForm.icon || ''}
                    onChange={(e) => setMenuItemForm(prev => ({ ...prev, icon: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iconType">Icon Type</Label>
                  <Input 
                    id="iconType"
                    placeholder="fas"
                    value={menuItemForm.iconType || 'fas'}
                    onChange={(e) => setMenuItemForm(prev => ({ ...prev, iconType: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <Input 
                    id="order"
                    type="number"
                    value={menuItemForm.order}
                    onChange={(e) => setMenuItemForm(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target">Target</Label>
                  <Input 
                    id="target"
                    placeholder="_self"
                    value={menuItemForm.target || '_self'}
                    onChange={(e) => setMenuItemForm(prev => ({ ...prev, target: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="item-active"
                  checked={menuItemForm.active}
                  onCheckedChange={(checked) => setMenuItemForm(prev => ({ ...prev, active: checked }))}
                />
                <Label htmlFor="item-active">Active</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowMenuItemDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isMenuItemCreate ? 'Add Menu Item' : 'Update Menu Item'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MenuManager;