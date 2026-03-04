import { UserImageListDto } from "../models/Images/UserImageListDto";
import { api } from "./api";

export const ImageService: IImageService = {
  async DownloadPicture(fileId: string): Promise<string> {
    try {
      const response = await api.get("/image/DownloadPicture", {
        params: { id: fileId },
        responseType: "blob",
      });

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(response.data);
      });
    } catch (error) {
      console.error("ImageService Error:", error);
      throw error;
    }
  },
  async GetUserPictures(userId: string): Promise<UserImageListDto[]> {
    try {
      var response = await api.get<UserImageListDto[]>(
        "/image/getUserPictures",
        { params: { userId: userId } },
      );
      return response.data;
    } catch (error) {
      console.error("api error:", error);
      throw error;
    }
  },
  async GetUserProfilePicture(
    userId: string,
  ): Promise<UserImageListDto | null> {
    try {
      var response = await api.get<UserImageListDto>(
        "/image/getUserProfilePicture",
        { params: { userId: userId } },
      );
      return response.data;
    } catch (error) {
      // console.log("api error:", error);
      return null;
    }
  },
  async SetProfilePicture(imageId: string): Promise<boolean> {
    try {
      var response = await api.post<boolean>("/image/SetProfilePicture", {
        params: { imageId: imageId },
      });
      return response.data;
    } catch (error) {
      console.error("api error:", error);
      throw error;
    }
  },
};

interface IImageService {
  // UploadPicture(): Promise<string[]>;
  DownloadPicture(fileId: string): Promise<string>;
  GetUserPictures(userId: string): Promise<UserImageListDto[]>;
  GetUserProfilePicture(userId: string): Promise<UserImageListDto | null>;
  SetProfilePicture(imageId: string): Promise<boolean>;
}
