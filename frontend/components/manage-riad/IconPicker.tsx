"use client";

import { HOUSE_RULE_ICONS, HOUSE_RULE_ICON_NAMES } from "@/lib/houseRuleIcons";

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
      {HOUSE_RULE_ICON_NAMES.map((name) => {
        const Icon = HOUSE_RULE_ICONS[name];
        const isSelected = value === name;

        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            title={name}
            className={`p-2.5 rounded-lg border transition-all flex items-center justify-center ${
              isSelected
                ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                : "border-border/60 hover:border-primary/40 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}
