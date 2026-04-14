export type StaffAvatarUrls = {
  avatar: string; // 200x200
  thumbnail: string; // 400x400
  profile: string; // 1200x1600
};

export type Staff = {
  id: number;
  name: string;
  description: string | null;
  avatarUrl: StaffAvatarUrls | null;
  isActive: boolean;
};

export type CreateStaffPayload = {
  name: string;
  description?: string;
  avatar?: File;
};

export type UpdateStaffPayload = {
  name?: string;
  description?: string;
  isActive?: boolean;
  avatar?: File;
};
