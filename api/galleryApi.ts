import { publicClient, adminClient } from "./axios";
import axios from "axios";

class GalleryApi {
  // ── Public ────────────────────────────────────────────────────

  getGallery = () => publicClient.get(`/gallery`);

  // ── Admin — Signature + Upload ────────────────────────────────

  getUploadSignature = (folder: "gallery" | "staffs") =>
    adminClient.get(`/admin/gallery/sign`, { params: { folder } });

  // Upload thẳng lên Cloudinary — không qua BE
  uploadToCloudinary = async (
    file: File,
    signature: {
      signature: string;
      timestamp: number;
      apiKey: string;
      cloudName: string;
      folder: string;
    },
  ) => {
    const form = new FormData();
    form.append("file", file);
    form.append("signature", signature.signature);
    form.append("timestamp", String(signature.timestamp));
    form.append("api_key", signature.apiKey);
    form.append("folder", signature.folder);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
      form,
    );
    return res.data.public_id as string;
  };

  // Upload nhiều ảnh song song — dùng chung 1 signature
  uploadManyToCloudinary = async (
    files: File[],
    signature: {
      signature: string;
      timestamp: number;
      apiKey: string;
      cloudName: string;
      folder: string;
    },
  ): Promise<string[]> => {
    return Promise.all(
      files.map((file) => this.uploadToCloudinary(file, signature)),
    );
  };

  // ── Admin — Themes ────────────────────────────────────────────

  getThemes = () => adminClient.get(`/admin/gallery/themes`);

  createTheme = (data: { name: string; slug: string; order?: number }) =>
    adminClient.post(`/admin/gallery/themes`, data);

  updateTheme = (
    id: number,
    data: { name?: string; slug?: string; order?: number; isActive?: boolean },
  ) => adminClient.patch(`/admin/gallery/themes/${id}`, data);

  deleteTheme = (id: number) =>
    adminClient.delete(`/admin/gallery/themes/${id}`);

  // ── Admin — Images ────────────────────────────────────────────

  addImages = (data: { themeId: number; publicIds: string[] }) =>
    adminClient.post(`/admin/gallery/images`, data);

  deleteImage = (id: number) =>
    adminClient.delete(`/admin/gallery/images/${id}`);

  reorderImages = (data: { images: { id: number; order: number }[] }) =>
    adminClient.patch(`/admin/gallery/images/reorder`, data);
}

const galleryApi = new GalleryApi();
export default galleryApi;
