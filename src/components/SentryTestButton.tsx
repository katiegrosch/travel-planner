import * as Sentry from "@sentry/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/**
 * Test component for verifying Sentry integration
 * Add this to any page to test error tracking
 */
export default function SentryTestButton() {
  const triggerError = () => {
    toast.error("Triggering test error...");
    // This will be caught by Sentry
    throw new Error("🦙 Test Error: Sentry is working!");
  };

  const testBreadcrumbs = () => {
    // Add custom breadcrumbs to help with debugging
    Sentry.addBreadcrumb({
      category: "user-action",
      message: "User clicked test breadcrumb button",
      level: "info",
    });
    
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "User navigated through test flow",
      level: "info",
    });

    toast.success("Breadcrumbs added! Now trigger an error to see them in Sentry.");
  };

  const captureMessage = () => {
    Sentry.captureMessage("🦙 Llama Trip test message", "info");
    toast.success("Test message sent to Sentry!");
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 p-4 bg-white border rounded-lg shadow-lg z-50">
      <div className="text-sm font-semibold mb-2">Sentry Test Controls</div>
      <Button 
        onClick={triggerError}
        variant="destructive"
        size="sm"
      >
        Trigger Error
      </Button>
      <Button 
        onClick={testBreadcrumbs}
        variant="secondary"
        size="sm"
      >
        Add Breadcrumbs
      </Button>
      <Button 
        onClick={captureMessage}
        variant="outline"
        size="sm"
      >
        Send Message
      </Button>
    </div>
  );
}


