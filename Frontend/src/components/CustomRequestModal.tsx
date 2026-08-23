import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { createCustomDatasetRequest } from "@/api/apiHub";
import { toast } from "sonner";

interface CustomRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emptyForm = {
  category: "",
  country: "",
  state: "",
  city: "",
  recordsNeeded: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  notes: "",
};

const CustomRequestModal = ({ isOpen, onClose }: CustomRequestModalProps) => {
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (key: keyof typeof emptyForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.contactName.trim() || !form.contactEmail.trim()) {
      toast.error("Name and email are required");
      return;
    }

    setIsSubmitting(true);
    try {
      await createCustomDatasetRequest(form);
      toast.success("Request submitted! We'll email you shortly.");
      setForm(emptyForm);
      onClose();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to submit request. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[92vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-card-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Request a Custom Dataset
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground -mt-2">
          Can't find exactly what you need? Tell us your requirements and we'll put together a custom list for you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="e.g. Restaurants" value={form.category} onChange={updateField("category")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="recordsNeeded">Records needed</Label>
              <Input id="recordsNeeded" placeholder="e.g. 500" value={form.recordsNeeded} onChange={updateField("recordsNeeded")} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input id="country" placeholder="India" value={form.country} onChange={updateField("country")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state">State</Label>
              <Input id="state" placeholder="Optional" value={form.state} onChange={updateField("state")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Optional" value={form.city} onChange={updateField("city")} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="contactName">Your name *</Label>
              <Input id="contactName" required value={form.contactName} onChange={updateField("contactName")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contactEmail">Email *</Label>
              <Input id="contactEmail" type="email" required value={form.contactEmail} onChange={updateField("contactEmail")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contactPhone">Phone</Label>
            <Input id="contactPhone" placeholder="Optional" value={form.contactPhone} onChange={updateField("contactPhone")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Additional details</Label>
            <Textarea
              id="notes"
              placeholder="Any specific fields, industries, or filters you need..."
              rows={3}
              value={form.notes}
              onChange={updateField("notes")}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full h-10">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomRequestModal;
