"use client";

import {
  Wifi, Clock, CigaretteOff, VolumeX, Dog, Baby, DoorOpen,
  KeyRound, Utensils, Wine, Coffee, ShowerHead, Bath, Bed, Shirt,
  WashingMachine, Flame, AirVent, Fan, Snowflake, Sun, Moon, Lock,
  ShieldCheck, Camera, Users, UserRound, Footprints, Leaf, Trees,
  Mountain, Waves, Car, Bike, ParkingCircle, MapPin, Phone, Bell,
  CircleHelp, Info,
  type LucideIcon,
} from "lucide-react";

export const HOUSE_RULE_ICONS: Record<string, LucideIcon> = {
  Wifi, Clock, CigaretteOff, VolumeX, Dog, Baby, DoorOpen,
  KeyRound, Utensils, Wine, Coffee, ShowerHead, Bath, Bed, Shirt,
  WashingMachine, Flame, AirVent, Fan, Snowflake, Sun, Moon, Lock,
  ShieldCheck, Camera, Users, UserRound, Footprints, Leaf, Trees,
  Mountain, Waves, Car, Bike, ParkingCircle, MapPin, Phone, Bell,
  CircleHelp, Info,
};

export const HOUSE_RULE_ICON_NAMES = Object.keys(HOUSE_RULE_ICONS);

export function getHouseRuleIcon(name: string): LucideIcon {
  return HOUSE_RULE_ICONS[name] ?? Info;
}
