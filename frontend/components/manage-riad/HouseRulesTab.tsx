"use client";

import { useState } from "react";
import { HouseRule } from "@/hooks/useCatalog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  BookOpen,
} from "lucide-react";
import { HOUSE_RULE_ICONS } from "@/lib/houseRuleIcons";

interface HouseRulesTabProps {
  houseRules: HouseRule[];
  onOpenDialog: (rule?: HouseRule) => void;
  onDelete: (id: number, name: string) => void;
  onToggleActive?: (id: number, currentStatus: boolean) => Promise<void>;
}

export function HouseRulesTab({
  houseRules,
  onOpenDialog,
  onDelete,
  onToggleActive,
}: HouseRulesTabProps) {
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const handleToggle = async (rule: HouseRule) => {
    if (!onToggleActive) return;
    setTogglingId(rule.id);
    try {
      await onToggleActive(rule.id, !rule.is_active);
    } catch (err) {
      // Ignore
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
            House Rules
          </h3>
          <p className="text-xs text-muted-foreground">
            Breakfast hours, check-out times, quiet hours, and more
          </p>
        </div>
        <Button
          size="sm"
          className="h-9 text-xs font-black uppercase tracking-wide px-4"
          onClick={() => onOpenDialog()}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Rule
        </Button>
      </div>

      {houseRules.length === 0 ? (
        <Card className="p-12 border-dashed bg-card/50 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
          <BookOpen className="w-10 h-10 text-muted-foreground/40" />
          <div>
            <p className="text-sm font-bold text-foreground">No house rules yet</p>
            <p className="text-xs">
              Add rules like breakfast times, quiet hours, or smoking policies.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenDialog()}
            className="mt-2 text-xs font-black uppercase"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Rule
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {houseRules
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((rule) => {
              const isVisible = rule.is_active ?? true;
              const isToggling = togglingId === rule.id;
              const Icon = HOUSE_RULE_ICONS[rule.icon] ?? HOUSE_RULE_ICONS.Info;

              return (
                <Card
                  key={rule.id}
                  className={`p-4 bg-card border transition-all animate-in fade-in duration-300 ${
                    isVisible
                      ? "border-border/80 hover:border-primary/40 shadow-2xs"
                      : "border-border/40 bg-muted/20 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2.5 bg-primary/5 text-primary rounded-xl border border-primary/10 shrink-0 mt-0.5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary bg-primary/8 px-2 py-0.5 rounded-md border border-primary/15 leading-tight">
                            {rule.value}
                          </span>
                          <span className="font-black text-sm uppercase tracking-tight text-foreground truncate">
                            {rule.title}
                          </span>
                          {!isVisible && (
                            <Badge variant="destructive" className="text-[9px] font-black uppercase px-1.5 py-0">
                              Hidden
                            </Badge>
                          )}
                        </div>
                        {rule.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 pt-0.5">
                            {rule.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        size="sm"
                        variant={isVisible ? "outline" : "secondary"}
                        disabled={isToggling}
                        onClick={() => handleToggle(rule)}
                        className={`h-8 text-[11px] font-black uppercase px-2.5 ${
                          isVisible
                            ? "hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 dark:hover:bg-amber-950/30"
                            : "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400"
                        }`}
                      >
                        {isToggling ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : isVisible ? (
                          <><EyeOff className="w-3.5 h-3.5 mr-1" /> Hide</>
                        ) : (
                          <><Eye className="w-3.5 h-3.5 mr-1" /> Show</>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onOpenDialog(rule)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="Edit rule"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(rule.id, rule.title)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:border-destructive/50 hover:bg-destructive/10"
                        title="Delete rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
}
