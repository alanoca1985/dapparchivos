export type FileCardKind = "document" | "figma" | "image" | "video" | "pdf";

export type BadgeVariant = "choredBlue" | "sharedOrange" | "choredPurple";

export type ToastVariant = "success" | "info" | "warning";

export type NavKey =
  | "dashboard"
  | "files"
  | "driveSync"
  | "shared"
  | "trash"
  | "settings";

export type FileCardModel = {
  id: string;
  kind: FileCardKind;
  name: string;
  sizeLabel: string;
  storageType: "Decentralized";
  badgeVariant: BadgeVariant;
  previewUrl?: string;
  previewFileName?: string;
  downloadUrl?: string;
};

export type ToastModel = {
  id: string;
  message: string;
  variant: ToastVariant;
};
