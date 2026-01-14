import { useState } from "react";
import { useKitchen } from "@/context/KitchenContext";
import { ItemCategory, InventoryItem } from "@/types/kitchen";
import { getCategoryIcon, getCategoryLabel } from "@/utils/kitchenUtils";
import { getDefaultShape, getDefaultDimensions, getCategoryColor } from "@/utils/itemShapeUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedZoneId: string | null;
}

interface AddItemFormData {
  name: string;
  category: ItemCategory;
  quantity: number;
  unit: string;
  expiry_date?: string;
  purchase_date?: string;
  notes?: string;
  low_stock_threshold?: number;
}

// Generate unique ID for new items
const generateItemId = () => `inv-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

export function AddItemDialog({ isOpen, onClose, selectedZoneId }: AddItemDialogProps) {
  const { addItem, zones } = useKitchen();
  const selectedZone = zones.find((z) => z.id === selectedZoneId);

  const [formData, setFormData] = useState<AddItemFormData>({
    name: "",
    category: "food",
    quantity: 1,
    unit: "pieces",
  });

  const [expiryDate, setExpiryDate] = useState<Date>();
  const [purchaseDate, setPurchaseDate] = useState<Date>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories: ItemCategory[] = [
    "food",
    "beverages",
    "spices",
    "cookware",
    "utensils",
    "dishes",
    "storage",
    "cleaning",
    "appliances",
    "other",
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Item name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (formData.quantity <= 0 || !Number.isInteger(formData.quantity)) {
      newErrors.quantity = "Quantity must be a positive whole number";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Unit is required";
    }

    if (!selectedZoneId) {
      newErrors.zone = "Please select a zone first";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const shape = getDefaultShape(formData.category, formData.unit);
    const newItem: InventoryItem = {
      id: generateItemId(),
      name: formData.name.trim(),
      zone_id: selectedZoneId || "",
      category: formData.category,
      quantity: formData.quantity,
      unit: formData.unit.trim(),
      expiry_date: expiryDate ? format(expiryDate, "yyyy-MM-dd") : undefined,
      purchase_date: purchaseDate ? format(purchaseDate, "yyyy-MM-dd") : undefined,
      notes: formData.notes?.trim() || undefined,
      low_stock_threshold: formData.low_stock_threshold || null,
      shape,
      dimensions: getDefaultDimensions(shape, formData.category),
      color: getCategoryColor(formData.category),
    };

    addItem(newItem);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      name: "",
      category: "food",
      quantity: 1,
      unit: "pieces",
    });
    setExpiryDate(undefined);
    setPurchaseDate(undefined);
    setErrors({});
    onClose();
  };

  const isFormValid = formData.name.trim() && formData.category && formData.quantity > 0 && formData.unit.trim() && selectedZoneId;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Add Item {selectedZone && `to ${selectedZone.name}`}
          </DialogTitle>
          <DialogDescription>
            {selectedZone 
              ? `Adding item to ${selectedZone.name}`
              : "Please select a zone first before adding items"}
          </DialogDescription>
          {!selectedZone && (
            <p className="text-sm text-destructive mt-2">
              ⚠️ No zone selected. Please select a zone from the 3D view first.
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Item Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Olive Oil, Pasta, Rice"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as ItemCategory })}
            >
              <SelectTrigger id="category" className={errors.category ? "border-destructive" : ""}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    <span className="flex items-center gap-2">
                      <span>{getCategoryIcon(category)}</span>
                      <span>{getCategoryLabel(category)}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category}</p>
            )}
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">
                Quantity <span className="text-destructive">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                step="1"
                placeholder="1"
                value={formData.quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  const parsed = parseInt(value, 10);
                  setFormData({ ...formData, quantity: !isNaN(parsed) && parsed > 0 ? parsed : 1 });
                }}
                className={errors.quantity ? "border-destructive" : ""}
              />
              {errors.quantity && (
                <p className="text-xs text-destructive">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">
                Unit <span className="text-destructive">*</span>
              </Label>
              <Input
                id="unit"
                placeholder="pieces, bottle, box"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className={errors.unit ? "border-destructive" : ""}
              />
              {errors.unit && (
                <p className="text-xs text-destructive">{errors.unit}</p>
              )}
            </div>
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label>Expiry Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !expiryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expiryDate}
                  onSelect={setExpiryDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Purchase Date */}
          <div className="space-y-2">
            <Label>Purchase Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !purchaseDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {purchaseDate ? format(purchaseDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={purchaseDate}
                  onSelect={setPurchaseDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Low Stock Threshold */}
          <div className="space-y-2">
            <Label htmlFor="threshold">Low Stock Threshold (Optional)</Label>
            <Input
              id="threshold"
              type="number"
              min="0"
              step="1"
              placeholder="e.g., 2"
              value={formData.low_stock_threshold || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  setFormData({ ...formData, low_stock_threshold: undefined });
                } else {
                  const parsed = parseInt(value, 10);
                  setFormData({ 
                    ...formData, 
                    low_stock_threshold: !isNaN(parsed) && parsed >= 0 ? parsed : undefined 
                  });
                }
              }}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this item..."
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid}>
              Add Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
