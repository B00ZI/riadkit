"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, RefreshCw, FolderPlus } from "lucide-react";

interface Category {
    id: number;
    name: string;
    type: "menu" | "service";
    sort_order: number;
}

interface MenuItem {
    id: number;
    category_id: number;
    category?: Category;
    name: string;
    description: string | null;
    price: string;
    image_url: string | null;
    is_available: boolean;
}

interface Service {
    id: number;
    category_id: number | null;
    category?: Category;
    name: string;
    description: string | null;
    price: string | null;
    requires_quantity: boolean;
    is_available: boolean;
}

interface Excursion {
    id: number;
    name: string;
    description: string | null;
    price: string;
    duration: string | null;
    image_url: string | null;
    is_available: boolean;
}

export default function MenuManagementPage() {
    const [activeTab, setActiveTab] = useState<"categories" | "menu-items" | "services" | "excursions">("categories");
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [menuForm, setMenuForm] = useState({
        category_id: "",
        name: "",
        description: "",
        price: "",
        image_url: "",
        is_available: true,
    });

    // Tab 3: Services State
    const [services, setServices] = useState<Service[]>([]);
    const [serviceForm, setServiceForm] = useState({
        category_id: "",
        name: "",
        description: "",
        price: "",
        requires_quantity: false,
        is_available: true,
    });

    // Tab 4: Excursions State
    const [excursions, setExcursions] = useState<Excursion[]>([]);
    const [excursionForm, setExcursionForm] = useState({
        name: "",
        description: "",
        price: "",
        duration: "",
        image_url: "",
        is_available: true,
    });

    const [categoryForm, setCategoryForm] = useState({
        name: "",
        type: "menu" as "menu" | "service",
        sort_order: 0,
    });

    // Fetch all categories
    const fetchCategories = async () => {
        const token = Cookies.get("riadkit_token");
        try {
            const res = await fetch("http://192.168.100.53:8000/api/categories", {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setCategories(data);
            }
        } catch (err) {
            console.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchCategories();
    }, []);



    // Handle Category Submission (Create)
    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        const token = Cookies.get("riadkit_token");

        try {
            const res = await fetch("http://192.168.100.53:8000/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(categoryForm),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to create category");
            }

            setCategories([...categories, data]);
            setCategoryForm({ name: "", type: "menu", sort_order: 0 });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Category Deletion
    const handleCategoryDelete = async (id: number) => {
        if (!confirm("Are you sure? Deleting this category will delete all associated menu items or services!")) return;

        const token = Cookies.get("riadkit_token");
        try {
            const res = await fetch(`http://192.168.100.53:8000/api/categories/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setCategories(categories.filter((cat) => cat.id !== id));
            }
        } catch (err) {
            alert("Failed to delete category");
        }
    };

    // Fetch all menu items
    const fetchMenuItems = async () => {
        const token = Cookies.get("riadkit_token");
        try {
            const res = await fetch("http://192.168.100.53:8000/api/menu-items", {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setMenuItems(data);
            }
        } catch (err) {
            console.error("Failed to fetch menu items");
        }
    };

    // Trigger menu fetch when switching to the menu tab
    useEffect(() => {
        if (activeTab === "menu-items") {
            fetchMenuItems();
        }
    }, [activeTab]);

    // Handle Menu Item submission
    const handleMenuSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        const token = Cookies.get("riadkit_token");

        try {
            const res = await fetch("http://192.168.100.53:8000/api/menu-items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(menuForm),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to create menu item");
            }

            setMenuItems([...menuItems, data]);
            setMenuForm({
                category_id: "",
                name: "",
                description: "",
                price: "",
                image_url: "",
                is_available: true,
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Menu Item deletion
    const handleMenuDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this menu item?")) return;

        const token = Cookies.get("riadkit_token");
        try {
            const res = await fetch(`http://192.168.100.53:8000/api/menu-items/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setMenuItems(menuItems.filter((item) => item.id !== id));
            }
        } catch (err) {
            alert("Failed to delete menu item");
        }
    };
    // --- services backend handlers ---
    const fetchServices = async () => {
        const token = Cookies.get("riadkit_token");
        try {
            const res = await fetch("http://192.168.100.53:8000/api/services", {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setServices(data);
            }
        } catch (err) {
            console.error("Failed to fetch services");
        }
    };

    const handleServiceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        const token = Cookies.get("riadkit_token");

        try {
            const res = await fetch("http://192.168.100.53:8000/api/services", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...serviceForm,
                    category_id: serviceForm.category_id || null, // Convert empty string to null
                    price: serviceForm.price || null, // Handle free services
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to create service");
            }

            setServices([...services, data]);
            setServiceForm({
                category_id: "",
                name: "",
                description: "",
                price: "",
                requires_quantity: false,
                is_available: true,
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleServiceDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this service?")) return;

        const token = Cookies.get("riadkit_token");
        try {
            const res = await fetch(`http://192.168.100.53:8000/api/services/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setServices(services.filter((item) => item.id !== id));
            }
        } catch (err) {
            alert("Failed to delete service");
        }
    };

    // --- excursions backend handlers ---
    const fetchExcursions = async () => {
        const token = Cookies.get("riadkit_token");
        try {
            const res = await fetch("http://192.168.100.53:8000/api/excursions", {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setExcursions(data);
            }
        } catch (err) {
            console.error("Failed to fetch excursions");
        }
    };

    const handleExcursionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        const token = Cookies.get("riadkit_token");

        try {
            const res = await fetch("http://192.168.100.53:8000/api/excursions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(excursionForm),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to create excursion");
            }

            setExcursions([...excursions, data]);
            setExcursionForm({
                name: "",
                description: "",
                price: "",
                duration: "",
                image_url: "",
                is_available: true,
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleExcursionDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this excursion?")) return;

        const token = Cookies.get("riadkit_token");
        try {
            const res = await fetch(`http://192.168.100.53:8000/api/excursions/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setExcursions(excursions.filter((item) => item.id !== id));
            }
        } catch (err) {
            alert("Failed to delete excursion");
        }
    };

    // Trigger proper tab-based resource fetching
    useEffect(() => {
        if (activeTab === "services") {
            fetchServices();
        } else if (activeTab === "excursions") {
            fetchExcursions();
        }
    }, [activeTab]);

    if (loading) {
        return <div className="flex items-center gap-2"><RefreshCw className="animate-spin" /> Loading panel...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Menu & Offerings</h2>
                <p className="text-muted-foreground">Manage your food menu, room services, and excursions in one place.</p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-200 space-x-4">
                {(["categories", "menu-items", "services", "excursions"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-4 text-sm font-medium capitalize border-b-2 transition-all ${activeTab === tab
                            ? "border-emerald-600 text-emerald-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        {tab.replace("-", " ")}
                    </button>
                ))}
            </div>

            {/* Tab Contents */}
            {activeTab === "categories" && (
                <div className="grid md:grid-cols-3 gap-8 items-start">

                    {/* Create Category Form */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-lg">Add Category</CardTitle>
                            <CardDescription>Organize items into menus (e.g., drinks) or service blocks.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCategorySubmit} className="space-y-4">
                                {error && <div className="text-sm text-red-500 font-medium">{error}</div>}

                                <div className="space-y-2">
                                    <Label htmlFor="name">Category Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Breakfast, Spa, Drinks..."
                                        required
                                        value={categoryForm.name}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Category Type</Label>
                                    <select
                                        id="type"
                                        className="w-full p-2 border rounded-md text-sm bg-white"
                                        value={categoryForm.type}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value as "menu" | "service" })}
                                    >
                                        <option value="menu">Food / Drinks Menu</option>
                                        <option value="service">Hotel Services</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">Sort Order</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        value={categoryForm.sort_order}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: parseInt(e.target.value) || 0 })}
                                    />
                                </div>

                                <Button type="submit" className="w-full flex gap-2" disabled={submitting}>
                                    <Plus className="w-4 h-4" />
                                    {submitting ? "Saving..." : "Add Category"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Categories List */}
                    <div className="md:col-span-2 space-y-4">
                        {categories.length === 0 ? (
                            <Card className="p-8 text-center text-muted-foreground">
                                <FolderPlus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                No categories created yet. Create one on the left!
                            </Card>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {categories.map((cat) => (
                                    <Card key={cat.id} className="flex justify-between items-center p-4">
                                        <div>
                                            <h4 className="font-bold text-lg">{cat.name}</h4>
                                            <Badge variant={cat.type === "menu" ? "default" : "secondary"} className="mt-1 capitalize">
                                                {cat.type}
                                            </Badge>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleCategoryDelete(cat.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            )}

            {activeTab === "menu-items" && (
                <div className="grid md:grid-cols-3 gap-8 items-start">

                    {/* Create Menu Item Form */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-lg">Add Menu Item</CardTitle>
                            <CardDescription>Add a food or beverage item to your Riad's menu.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleMenuSubmit} className="space-y-4">
                                {error && <div className="text-sm text-red-500 font-medium">{error}</div>}

                                <div className="space-y-2">
                                    <Label htmlFor="menu_category">Category</Label>
                                    <select
                                        id="menu_category"
                                        className="w-full p-2 border rounded-md text-sm bg-white"
                                        required
                                        value={menuForm.category_id}
                                        onChange={(e) => setMenuForm({ ...menuForm, category_id: e.target.value })}
                                    >
                                        <option value="">Select a Category</option>
                                        {categories
                                            .filter((cat) => cat.type === "menu")
                                            .map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="menu_name">Item Name</Label>
                                    <Input
                                        id="menu_name"
                                        placeholder="e.g., Tagine de Poulet, Mint Tea..."
                                        required
                                        value={menuForm.name}
                                        onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="menu_description">Description</Label>
                                    <Input
                                        id="menu_description"
                                        placeholder="Ingredients, size, details..."
                                        value={menuForm.description}
                                        onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="menu_price">Price (MAD / Local Currency)</Label>
                                    <Input
                                        id="menu_price"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        required
                                        value={menuForm.price}
                                        onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="menu_image">Image URL (Optional)</Label>
                                    <Input
                                        id="menu_image"
                                        type="url"
                                        placeholder="https://..."
                                        value={menuForm.image_url}
                                        onChange={(e) => setMenuForm({ ...menuForm, image_url: e.target.value })}
                                    />
                                </div>

                                <Button type="submit" className="w-full flex gap-2" disabled={submitting}>
                                    <Plus className="w-4 h-4" />
                                    {submitting ? "Saving..." : "Add Menu Item"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Menu Items List */}
                    <div className="md:col-span-2 space-y-4">
                        {menuItems.length === 0 ? (
                            <Card className="p-8 text-center text-muted-foreground">
                                <FolderPlus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                No menu items created yet. Select a category and add your first item on the left!
                            </Card>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {menuItems.map((item) => (
                                    <Card key={item.id} className="flex flex-col justify-between p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-lg">{item.name}</h4>
                                                {item.description && <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>}
                                                <div className="flex gap-2 mt-2">
                                                    <Badge variant="outline" className="capitalize">
                                                        {item.category?.name || "Uncategorized"}
                                                    </Badge>
                                                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">
                                                        {item.price} MAD
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleMenuDelete(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            )}

            {activeTab === "services" && (
                <div className="grid md:grid-cols-3 gap-8 items-start">

                    {/* Create Service Form */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-lg">Add Service</CardTitle>
                            <CardDescription>Configure in-house requests (towels, laundry, etc.)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleServiceSubmit} className="space-y-4">
                                {error && <div className="text-sm text-red-500 font-medium">{error}</div>}

                                <div className="space-y-2">
                                    <Label htmlFor="srv_category">Category (Optional)</Label>
                                    <select
                                        id="srv_category"
                                        className="w-full p-2 border rounded-md text-sm bg-white"
                                        value={serviceForm.category_id}
                                        onChange={(e) => setServiceForm({ ...serviceForm, category_id: e.target.value })}
                                    >
                                        <option value="">No Category</option>
                                        {categories
                                            .filter((cat) => cat.type === "service")
                                            .map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="srv_name">Service Name</Label>
                                    <Input
                                        id="srv_name"
                                        placeholder="e.g., Clean My Room, Extra Pillow..."
                                        required
                                        value={serviceForm.name}
                                        onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="srv_description">Description</Label>
                                    <Input
                                        id="srv_description"
                                        placeholder="Optional details..."
                                        value={serviceForm.description}
                                        onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="srv_price">Price (Optional - MAD)</Label>
                                    <Input
                                        id="srv_price"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00 (leave blank if free)"
                                        value={serviceForm.price}
                                        onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                                    />
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="requires_quantity"
                                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                        checked={serviceForm.requires_quantity}
                                        onChange={(e) => setServiceForm({ ...serviceForm, requires_quantity: e.target.checked })}
                                    />
                                    <Label htmlFor="requires_quantity" className="text-sm cursor-pointer select-none">
                                        Requires Quantity counter (e.g., for Towels)
                                    </Label>
                                </div>

                                <Button type="submit" className="w-full flex gap-2" disabled={submitting}>
                                    <Plus className="w-4 h-4" />
                                    {submitting ? "Saving..." : "Add Service"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Services List */}
                    <div className="md:col-span-2 space-y-4">
                        {services.length === 0 ? (
                            <Card className="p-8 text-center text-muted-foreground">
                                <FolderPlus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                No hotel services created yet. Create your first service request option on the left!
                            </Card>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {services.map((srv) => (
                                    <Card key={srv.id} className="flex flex-col justify-between p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-lg">{srv.name}</h4>
                                                {srv.description && <p className="text-sm text-muted-foreground mt-0.5">{srv.description}</p>}
                                                <div className="flex gap-2 mt-2 flex-wrap">
                                                    <Badge variant="outline" className="capitalize">
                                                        {srv.category?.name || "In-Room Service"}
                                                    </Badge>
                                                    {srv.price ? (
                                                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none">
                                                            {srv.price} MAD
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">
                                                            Free
                                                        </Badge>
                                                    )}
                                                    {srv.requires_quantity && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            Allows Quantity
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleServiceDelete(srv.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            )}

            {activeTab === "excursions" && (
                <div className="grid md:grid-cols-3 gap-8 items-start">

                    {/* Create Excursion Form */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-lg">Add Excursion</CardTitle>
                            <CardDescription>Manage daily trips, tours, and outdoor hotel experiences.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleExcursionSubmit} className="space-y-4">
                                {error && <div className="text-sm text-red-500 font-medium">{error}</div>}

                                <div className="space-y-2">
                                    <Label htmlFor="exc_name">Excursion Name</Label>
                                    <Input
                                        id="exc_name"
                                        placeholder="e.g., Desert Quad Tour, Cooking Class..."
                                        required
                                        value={excursionForm.name}
                                        onChange={(e) => setExcursionForm({ ...excursionForm, name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="exc_description">Description</Label>
                                    <Input
                                        id="exc_description"
                                        placeholder="Briefly describe what's included..."
                                        value={excursionForm.description}
                                        onChange={(e) => setExcursionForm({ ...excursionForm, description: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="exc_duration">Duration</Label>
                                    <Input
                                        id="exc_duration"
                                        placeholder="e.g., 3 Hours, Half Day, Full Day..."
                                        value={excursionForm.duration}
                                        onChange={(e) => setExcursionForm({ ...excursionForm, duration: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="exc_price">Price (MAD / Local Currency)</Label>
                                    <Input
                                        id="exc_price"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        required
                                        value={excursionForm.price}
                                        onChange={(e) => setExcursionForm({ ...excursionForm, price: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="exc_image">Image URL (Optional)</Label>
                                    <Input
                                        id="exc_image"
                                        type="url"
                                        placeholder="https://..."
                                        value={excursionForm.image_url}
                                        onChange={(e) => setExcursionForm({ ...excursionForm, image_url: e.target.value })}
                                    />
                                </div>

                                <Button type="submit" className="w-full flex gap-2" disabled={submitting}>
                                    <Plus className="w-4 h-4" />
                                    {submitting ? "Saving..." : "Add Excursion"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Excursions List */}
                    <div className="md:col-span-2 space-y-4">
                        {excursions.length === 0 ? (
                            <Card className="p-8 text-center text-muted-foreground">
                                <FolderPlus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                No excursions registered yet. Set up local tours and trips on the left!
                            </Card>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {excursions.map((exc) => (
                                    <Card key={exc.id} className="flex flex-col justify-between p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-lg">{exc.name}</h4>
                                                {exc.description && <p className="text-sm text-muted-foreground mt-0.5">{exc.description}</p>}
                                                <div className="flex gap-2 mt-2">
                                                    <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-none">
                                                        {exc.price} MAD
                                                    </Badge>
                                                    {exc.duration && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {exc.duration}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleExcursionDelete(exc.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
}