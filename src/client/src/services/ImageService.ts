import { ImagePickerAsset } from "./../../node_modules/expo-image-picker/build/ImagePicker.types.d";
import { UserImageListDto } from "../models/Images/UserImageListDto";
import { api } from "./api";
import axios from "axios";

export const ImageService: IImageService = {
  async UploadPicture(
    asset: ImagePickerAsset,
  ): Promise<UserImageListDto | null> {
    try {
      const formData = new FormData();

      formData.append("file", {
        uri: asset.uri,
        name: asset.fileName ?? "photo.jpg",
        type: asset.mimeType ?? "image/jpeg",
      } as any);

      const response = await api.post<UserImageListDto>(
        "/image/uploadPicture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("ImageService Error:", error);
      return null;
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
      console.error("test: " + userId, error);
      console.error("ImageService Error:", error);
      return [];
    }
  },
  async GetUserProfilePicture(
    userId: string,
  ): Promise<UserImageListDto | null> {
    let a: unknown;
    a = 4;

    try {
      var response = await api.get<UserImageListDto>(
        "/image/getUserProfilePicture",
        { params: { userId: userId } },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.errors[0]);
      } else {
        console.error("Non-Axios Error:", error);
      }
      return null;
    }
  },
  async SetProfilePicture(imageId: string): Promise<boolean> {
    try {
      var response = await api.post<boolean>("/image/SetProfilePicture", null, {
        params: { imageId: imageId },
      });
      return response.data;
    } catch (error) {
      console.error("ImageService Error:", error);
      return false;
    }
  },
  async DeletePicture(imageId: string): Promise<boolean> {
    try {
      console.log(imageId);
      var response = await api.delete<boolean>(
        `/image/DeletePicture/${imageId}`,
      );
      return response.data;
    } catch (error) {
      console.error("ImageService Error:", error);
      return false;
    }
  },
};

interface IImageService {
  UploadPicture(file: ImagePickerAsset): Promise<UserImageListDto | null>;
  GetUserPictures(userId: string): Promise<UserImageListDto[]>;
  GetUserProfilePicture(userId: string): Promise<UserImageListDto | null>;
  SetProfilePicture(imageId: string): Promise<boolean>;
  DeletePicture(imageId: string): Promise<boolean>;
}
