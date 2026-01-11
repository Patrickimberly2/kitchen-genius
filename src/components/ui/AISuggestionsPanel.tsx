import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X, AlertTriangle, Sparkles, ArrowRight } from "lucide-react";
import { useKitchen } from "@/context/KitchenContext";
import { AISuggestion } from "@/types/kitchen";

function SuggestionCard({ suggestion, onDismiss }: { suggestion: AISuggestion; onDismiss: () => void }) {
  const getIcon = () => {
    switch (suggestion.type) {
      case "expiry":
        return <AlertTriangle className="w-4 h-4" />;
      case "organization":
        return <Sparkles className="w-4 h-4" />;
      case "optimization":
        return <ArrowRight className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getPriorityColor = () => {
    switch (suggestion.priority) {
      case "high":
        return "border-destructive/40 bg-destructive/5";
      case "medium":
        return "border-accent/40 bg-accent/5";
      default:
        return "border-secondary/60 bg-secondary/20";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      className={`ai-suggestion ${getPriorityColor()}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0 text-accent">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-foreground text-sm">{suggestion.title}</h4>
            <button
              onClick={onDismiss}
              className="p-1 rounded-lg hover:bg-muted/50 transition-colors shrink-0"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {suggestion.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function AISuggestionsPanel() {
  const { suggestions, dismissSuggestion } = useKitchen();

  if (suggestions.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 w-80 z-20 space-y-2">
      <AnimatePresence mode="popLayout">
        {suggestions.slice(0, 3).map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onDismiss={() => dismissSuggestion(suggestion.id)}
          />
        ))}
      </AnimatePresence>
      
      {suggestions.length > 3 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground text-center py-1"
        >
          +{suggestions.length - 3} more suggestion{suggestions.length - 3 > 1 ? "s" : ""}
        </motion.p>
      )}
    </div>
  );
}
