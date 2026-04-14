export type GalleryImage = {
  id: number;
  themeId: number;
  publicId: string;
  order: number;
  isActive: boolean;
  thumbnailUrl: string;
  fullUrl: string;
};

export type GalleryTheme = {
  id: number;
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
  images: GalleryImage[];
};

export type CreateThemePayload = {
  name: string;
  slug: string;
  order?: number;
};

export type UpdateThemePayload = {
  name?: string;
  slug?: string;
  order?: number;
  isActive?: boolean;
};

export type AddImagesPayload = {
  themeId: number;
  publicIds: string[];
};

export type ReorderImagesPayload = {
  images: { id: number; order: number }[];
};
