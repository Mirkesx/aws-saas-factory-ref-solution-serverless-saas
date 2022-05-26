import AwsS3 from "@uppy/aws-s3";
import { Dashboard } from "@uppy/react";
import { Uppy } from "@uppy/core";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import axios from "axios";
import AuthUtils from "../../utils/authUtils";

const uppy = new Uppy({
  autoProceed: true,
});
// uppy.use(Tus, {
//   endpoint: "https://tusd.tusdemo.net/files/", // use your tus endpoint here
//   resume: true,
//   retryDelays: [0, 1000, 3000, 5000],
//   autoProceed: true
// });
uppy.use(AwsS3, {
  getUploadParameters: async (file: any) => {
    const userData: any = AuthUtils.getIdTokenPayload();
    console.log("Before upload:", file);
    const res = await axios.get(
      "https://1zijscu1fh.execute-api.us-east-1.amazonaws.com/uploads",
      { params: { extension: file.extension, type: file.type, original_name: file.name, username: userData['cognito:username'], tenantId: userData['custom:tenantId'] } }
    );
    console.log("presignedURL", res.data.uploadURL);
    return {
      method: "PUT",
      url: res.data.uploadURL,
      // fields: data.fields,
      // Provide content type header required by S3
      headers: {
        "Content-Type": file.type,
      },
    };
  },
});

uppy.on("file-added", (file: any) => {
  console.log("Added file", file);
});

uppy.on("upload", (data: any) => {
  // data object consists of `id` with upload ID and `fileIDs` array
  // with file IDs in current upload
  const { id, fileIDs } = data;
  console.log(`Starting upload ${id} for files ${fileIDs}`);
});

uppy.on("progress", (progress: any) => {
  // progress: integer (total progress percentage)
  console.log(progress);
});

uppy.on("upload-success", (file: any, response: any) => {
  console.log("upload success");
  console.log(file.name, response.uploadURL);
});

uppy.on("complete", (result: any) => {
  console.log("successful files:", result.successful);
  console.log("failed files:", result.failed);
});

uppy.on("error", (error: any) => {
  console.error(error.stack);
});

uppy.on("upload-error", (file: any, error: any, response: any) => {
  console.log("error with file:", file.id);
  console.log("error message:", error);
});

uppy.on("cancel-all", (file: any, error: any, response: any) => {
  console.log("cancelled all files");
});

function SignFile() {
  return (
    <div className="page-panel">
      <Dashboard
        uppy={uppy}
        proudlyDisplayPoweredByUppy={false}
        showProgressDetails={true}
        hideUploadButton={true}
        width="100%"
        locale={{
          strings: {
            dropPasteFiles: "Drag files here to upload or %{browseFiles}",
            browseFiles: "browse from your computer",
          },
        }}
      />
    </div>
  );
}

export default SignFile;
