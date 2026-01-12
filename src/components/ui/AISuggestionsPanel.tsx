import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X, AlertTriangle, Sparkles, ArrowRight, Check, Eye, Loader2, Gauge } from "lucide-react";
import { useKitchen } from "@/context/KitchenContext";
import { AISuggestion } from "@/types/kitchen";
import { Button } from "@/components/ui/button";

interface SuggestionCardProps {
  suggestion: AISuggestion;
  onDismiss: () => void;
  onApply: () => void;
  onHighlight: () => void;
}

function SuggestionCard({ suggestion, onDismiss, onApply, onHighlight }: SuggestionCardProps) {
  const getIcon = () => {
    switch (suggestion.type) {
      case "expiry":
        return <AlertTriangle className="w-4 h-4" />;
      case "organization":
        return <Sparkles className="w-4 h-4" />;
      case "optimization":
        return <ArrowRight className="w-4 h-4" />;
      case "capacity":
        return <Gauge className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getPriorityColor = () => {
    switch (suggestion.priority) {
      case "high":
        return "border-destructive/40 bg-destructive/5";
      case "medium":
        return "border-amber-500/40 bg-amber-500/5";
      default:
        return "border-secondary/60 bg-secondary/20";
    }
  };

  const hasAction = !!suggestion.action;
  const hasZoneToHighlight = !!suggestion.zone_id || (suggestion.item_ids && suggestion.item_ids.length > 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      className={`ai-suggestion ${getPriorityColor()} rounded-xl border p-4 backdrop-blur-sm shadow-lg`}
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
              title="Dismiss"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {suggestion.description}
          </p>
          
          {/* Action buttons */}
          <div className="flex gap-2 mt-3">
            {hasZoneToHighlight && (
              <Button
                variant="outline"
                size="sm"
                onClick={onHighlight}
                className="h-7 text-xs"
              >
                <Eye className="w-3 h-3 mr-1" />
                Show
              </Button>
            )}
            {hasAction && (
              <Button
                variant="default"
                size="sm"
                onClick={onApply}
                className="h-7 text-xs"
              >
                <Check className="w-3 h-3 mr-1" />
                Apply
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function AISuggestionsPanel() {
  const { 
    suggestions, 
    dismissSuggestion, 
    applySuggestion, 
    highlightZones, 
    selectZone,
    isLoadingAI,
    generateAISuggestions,
    items,
    zones,
  } = useKitchen();

  const handleHighlight = (suggestion: AISuggestion) => {
    if (suggestion.zone_id) {
      highlightZones([suggestion.zone_id]);
      selectZone(suggestion.zone_id);
    } else if (suggestion.item_ids) {
      // Find zones containing these items and highlight them
      const zoneIds = new Set<string>();
      suggestion.item_ids.forEach(itemId => {
        const item = items.find(i => i.id === itemId);
        if (item?.zone_id) zoneIds.add(item.zone_id);
      });
      highlightZones(Array.from(zoneIds));
      if (zoneIds.size === 1) {
        selectZone(Array.from(zoneIds)[0]);
      }
    }
  };

  return (
    <div className="fixed bottom-4 left-4 w-80 z-20 space-y-2">
      {/* AI Generate Button */}
      {zones.length > 0 && suggestions.length === 0 && !isLoadingAI && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Button
            onClick={generateAISuggestions}
            variant="outline"
            className="w-full bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/40"
          >
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            Get AI Organization Tips
          </Button>
        </motion.div>
      )}
      
      {/* Loading indicator */}
      {isLoadingAI && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 p-4 rounded-xl bg-background/80 backdrop-blur-sm border"
        >
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Analyzing your kitchen...</span>
        </motion.div>
      )}
      
      {/* Suggestions list */}
      <AnimatePresence mode="popLayout">
        {suggestions.slice(0, 3).map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onDismiss={() => dismissSuggestion(suggestion.id)}
            onApply={() => applySuggestion(suggestion)}
            onHighlight={() => handleHighlight(suggestion)}
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
