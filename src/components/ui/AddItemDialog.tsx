import { useState, useEffect } from "react";
import { Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useKitchen } from "@/context/KitchenContext";
import { ItemCategory } from "@/types/kitchen";
import { getCategoryIcon, getCategoryLabel } from "@/utils/kitchenUtils";
import { useToast } from "@/hooks/use-toast";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedZoneId?: string | null;
}

export function AddItemDialog({ open, onOpenChange, preselectedZoneId }: AddItemDialogProps) {
  const { addItem, zones } = useKitchen();
  const { toast } = useToast();

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ItemCategory>("food");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("pieces");
  const [zoneId, setZoneId] = useState(preselectedZoneId || "");
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update zone when preselected zone changes
  useEffect(() => {
    if (preselectedZoneId) {
      setZoneId(preselectedZoneId);
    }
  }, [preselectedZoneId]);

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
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Item name is required";
    }

    if (!category) {
      newErrors.category = "Category is required";
    }

    const quantityNum = parseFloat(quantity);
    if (!quantity || isNaN(quantityNum) || quantityNum <= 0) {
      newErrors.quantity = "Quantity must be a positive number";
    }

    if (!unit.trim()) {
      newErrors.unit = "Unit is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Generate unique ID
    const id = crypto.randomUUID();

    // Create new item
    const newItem = {
      id,
      name: name.trim(),
      category,
      quantity: parseFloat(quantity),
      unit: unit.trim(),
      zone_id: zoneId || "",
      expiry_date: expiryDate || undefined,
      notes: notes.trim() || undefined,
    };

    // Add item using context
    addItem(newItem);

    // Show success toast
    toast({
      title: "Item added successfully",
      description: `${name} has been added to your inventory.`,
    });

    // Reset form
    resetForm();

    // Close dialog
    onOpenChange(false);
  };

  const resetForm = () => {
    setName("");
    setCategory("food");
    setQuantity("1");
    setUnit("pieces");
    setZoneId(preselectedZoneId || "");
    setExpiryDate("");
    setNotes("");
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  // Filter zones to only show valid storage zones
  const validZones = zones.filter(
    (z) => !["countertop", "window", "sink", "stove", "dishwasher", "microwave"].includes(z.zone_type)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Add New Item
          </DialogTitle>
          <DialogDescription>
            Add a new item to your kitchen inventory. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Item Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Item Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Tomato Sauce"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={(value) => setCategory(value as ItemCategory)}>
                <SelectTrigger id="category" className={errors.category ? "border-destructive" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      <span className="flex items-center gap-2">
                        {getCategoryIcon(cat)} {getCategoryLabel(cat)}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">
                  Quantity <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  step="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={errors.quantity ? "border-destructive" : ""}
                />
                {errors.quantity && <p className="text-xs text-destructive">{errors.quantity}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="unit">
                  Unit <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g., pieces, bottle, box"
                  className={errors.unit ? "border-destructive" : ""}
                />
                {errors.unit && <p className="text-xs text-destructive">{errors.unit}</p>}
              </div>
            </div>

            {/* Zone Assignment */}
            <div className="grid gap-2">
              <Label htmlFor="zone">Zone (Optional)</Label>
              <Select value={zoneId} onValueChange={setZoneId}>
                <SelectTrigger id="zone">
                  <SelectValue placeholder="Select a zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No zone (unassigned)</SelectItem>
                  {validZones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Expiry Date */}
            <div className="grid gap-2">
              <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
              <Input
                id="expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Add Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
