import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus, Trash2, Edit2, Eye, EyeOff, Calendar, Monitor, Megaphone, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import {
  listPopupsAdmin,
  createPopup,
  updatePopup,
  deletePopup,
  type Popup,
  type PopupType,
  type PopupInsert,
} from "@/lib/db/popups";

const popupTypeLabels: Record<PopupType, { label: string; icon: React.ElementType }> = {
  modal: { label: "Modal", icon: Monitor },
  slide_in: { label: "Slide-in", icon: Megaphone },
  bar: { label: "Bar", icon: Megaphone },
};

const targetPageOptions = [
  { value: "/", label: "Homepage" },
  { value: "/products", label: "Products" },
  { value: "/blog", label: "Blog" },
  { value: "/about", label: "About" },
  { value: "/contact", label: "Contact" },
];

type FormData = {
  title: string;
  content: string;
  popup_type: PopupType;
  target_pages: string[];
  start_date: Date | null;
  end_date: Date | null;
  is_active: boolean;
  button_text: string;
  button_link: string;
  background_color: string;
  text_color: string;
  show_close_button: boolean;
  delay_seconds: number;
};

const defaultFormData: FormData = {
  title: "",
  content: "",
  popup_type: "modal",
  target_pages: [],
  start_date: null,
  end_date: null,
  is_active: true,
  button_text: "",
  button_link: "",
  background_color: "#3b82f6",
  text_color: "#ffffff",
  show_close_button: true,
  delay_seconds: 0,
};

export default function AdminPopups() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  const { data: popups = [], isLoading } = useQuery({
    queryKey: ["admin", "popups"],
    queryFn: listPopupsAdmin,
  });

  const createMutation = useMutation({
    mutationFn: createPopup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "popups"] });
      toast.success("Popup created successfully");
      closeDialog();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PopupInsert> }) => updatePopup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "popups"] });
      toast.success("Popup updated successfully");
      closeDialog();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePopup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "popups"] });
      toast.success("Popup deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) => 
      updatePopup(id, { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "popups"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingPopup(null);
    setFormData(defaultFormData);
  };

  const openCreateDialog = () => {
    setEditingPopup(null);
    setFormData(defaultFormData);
    setDialogOpen(true);
  };

  const openEditDialog = (popup: Popup) => {
    setEditingPopup(popup);
    setFormData({
      title: popup.title,
      content: popup.content,
      popup_type: popup.popup_type,
      target_pages: popup.target_pages || [],
      start_date: popup.start_date ? new Date(popup.start_date) : null,
      end_date: popup.end_date ? new Date(popup.end_date) : null,
      is_active: popup.is_active,
      button_text: popup.button_text || "",
      button_link: popup.button_link || "",
      background_color: popup.background_color || "#3b82f6",
      text_color: popup.text_color || "#ffffff",
      show_close_button: popup.show_close_button,
      delay_seconds: popup.delay_seconds || 0,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    const payload: PopupInsert = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      popup_type: formData.popup_type,
      target_pages: formData.target_pages,
      start_date: formData.start_date?.toISOString() || null,
      end_date: formData.end_date?.toISOString() || null,
      is_active: formData.is_active,
      button_text: formData.button_text.trim() || null,
      button_link: formData.button_link.trim() || null,
      background_color: formData.background_color || null,
      text_color: formData.text_color || null,
      show_close_button: formData.show_close_button,
      delay_seconds: formData.delay_seconds,
    };

    if (editingPopup) {
      updateMutation.mutate({ id: editingPopup.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const toggleTargetPage = (page: string) => {
    setFormData(prev => ({
      ...prev,
      target_pages: prev.target_pages.includes(page)
        ? prev.target_pages.filter(p => p !== page)
        : [...prev.target_pages, page],
    }));
  };

  const getStatusBadge = (popup: Popup) => {
    const now = new Date();
    const start = popup.start_date ? new Date(popup.start_date) : null;
    const end = popup.end_date ? new Date(popup.end_date) : null;

    if (!popup.is_active) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (start && now < start) {
      return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Scheduled</Badge>;
    }
    if (end && now > end) {
      return <Badge variant="secondary">Expired</Badge>;
    }
    return <Badge className="bg-green-600">Active</Badge>;
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading popups...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Create and manage promotional popups and banners for your site.
        </p>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" /> New Popup
        </Button>
      </div>

      {popups.length === 0 ? (
        <Card className="bg-card/50">
          <CardContent className="py-12 text-center">
            <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No popups yet</h3>
            <p className="text-muted-foreground mb-4">Create your first promotional popup or banner.</p>
            <Button onClick={openCreateDialog}>Create Popup</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {popups.map((popup) => (
            <Card key={popup.id} className="bg-card/50">
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{popup.title}</h3>
                      {getStatusBadge(popup)}
                      <Badge variant="outline">{popupTypeLabels[popup.popup_type].label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{popup.content}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {popup.target_pages && popup.target_pages.length > 0 ? (
                        <span>Pages: {popup.target_pages.join(", ")}</span>
                      ) : (
                        <span>All pages</span>
                      )}
                      {popup.start_date && (
                        <span>• Starts: {format(new Date(popup.start_date), "MMM d, yyyy")}</span>
                      )}
                      {popup.end_date && (
                        <span>• Ends: {format(new Date(popup.end_date), "MMM d, yyyy")}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleActiveMutation.mutate({ id: popup.id, is_active: !popup.is_active })}
                      title={popup.is_active ? "Deactivate" : "Activate"}
                    >
                      {popup.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(popup)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm("Delete this popup?")) {
                          deleteMutation.mutate(popup.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPopup ? "Edit Popup" : "Create Popup"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Summer Sale!"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="popup_type">Popup Type</Label>
                <Select
                  value={formData.popup_type}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, popup_type: v as PopupType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modal">Modal (Center)</SelectItem>
                    <SelectItem value="slide_in">Slide-in (Corner)</SelectItem>
                    <SelectItem value="bar">Bar (Top/Bottom)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter your promotional message..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="button_text">Button Text</Label>
                <Input
                  id="button_text"
                  value={formData.button_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                  placeholder="e.g., Shop Now"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="button_link">Button Link</Label>
                <Input
                  id="button_link"
                  value={formData.button_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_link: e.target.value }))}
                  placeholder="e.g., /products"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.start_date && "text-muted-foreground")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.start_date ? format(formData.start_date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={formData.start_date || undefined}
                      onSelect={(d) => setFormData(prev => ({ ...prev, start_date: d || null }))}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.end_date && "text-muted-foreground")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.end_date ? format(formData.end_date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={formData.end_date || undefined}
                      onSelect={(d) => setFormData(prev => ({ ...prev, end_date: d || null }))}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Pages (leave empty for all pages)</Label>
              <div className="flex flex-wrap gap-2">
                {targetPageOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant={formData.target_pages.includes(option.value) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTargetPage(option.value)}
                  >
                    {option.label}
                    {formData.target_pages.includes(option.value) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="background_color">Background</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.background_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.background_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="text_color">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.text_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, text_color: e.target.value }))}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.text_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, text_color: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delay">Delay (seconds)</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.delay_seconds}
                  onChange={(e) => setFormData(prev => ({ ...prev, delay_seconds: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(v) => setFormData(prev => ({ ...prev, is_active: v }))}
                />
                <Label>Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.show_close_button}
                  onCheckedChange={(v) => setFormData(prev => ({ ...prev, show_close_button: v }))}
                />
                <Label>Show Close Button</Label>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <div 
                className="rounded-lg p-4 text-center"
                style={{ 
                  backgroundColor: formData.background_color, 
                  color: formData.text_color 
                }}
              >
                <h4 className="font-bold text-lg mb-2">{formData.title || "Your Title"}</h4>
                <p className="mb-3">{formData.content || "Your promotional message here..."}</p>
                {formData.button_text && (
                  <Button variant="secondary" size="sm">
                    {formData.button_text}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingPopup ? "Update" : "Create"} Popup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
