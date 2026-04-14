export type Service = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
};

export type CreateServicePayload = {
  name: string;
  description?: string;
  price: number;
};

export type UpdateServicePayload = {
  name?: string;
  description?: string;
  price?: number;
  isActive?: boolean;
};