import express from "express";
import * as sourcecontroller from "../controller/source.controller.js";
import upload from "../config/multer.js";
import validateFiles from "../middleware/fileSize.middleware.js";
import docfiles from "../middleware/uploadDocs.middleware.js";
import imgfiles from "../middleware/uploadImgs.middleware.js";
import vidfiles from "../middleware/uploadVids.middleware.js";

const router = express.Router();

router.post(
  "/upload",
  /*
#swagger.tags = ['2.Media']
#swagger.summary = 'Upload media'
#swagger.description = 'Upload images, videos or documents'

#swagger.consumes = ['multipart/form-data']

#swagger.requestBody = {
  required: true,
  content: {
    "multipart/form-data": {
      schema: {
        type: "object",
        properties: {
          files: {
            type: "array",
            items: {
              type: "string",
              format: "binary"
            }
          },
          org_name: {
            type: "string",
            example: "img-20213312"
          }
        }
      }
    }
  }
}

#swagger.responses[200] = {
  description: 'Media uploaded successfully',
}

#swagger.responses[500] = {
  description: 'Internal Server Error',
}
*/
  upload.array("files"),
  validateFiles,
  sourcecontroller.uploadMedia,
);
router.post(
  "/upload-docs",
  /*
#swagger.tags = ['2.Media']
#swagger.summary = 'Upload Documents'
#swagger.description = 'Upload documents only'

#swagger.consumes = ['multipart/form-data']

#swagger.requestBody = {
  required: true,
  content: {
    "multipart/form-data": {
      schema: {
        type: "object",
        properties: {
          files: {
            type: "array",
            items: {
              type: "string",
              format: "binary"
            }
          },
                user_id: {
            type: "string",
            example: "USR001"
          }
        }
      }
    }
  }
}

#swagger.responses[200] = {
  description: 'Documents uploaded successfully',
}

#swagger.responses[500] = {
  description: 'Internal Server Error',
}
*/
  upload.array("files"),
  docfiles,
  sourcecontroller.uploadMedia,
);
router.post(
  "/upload-imgs",
  /*
#swagger.tags = ['2.Media']
#swagger.summary = 'Upload Images '
#swagger.description = 'Upload Images Only'

#swagger.consumes = ['multipart/form-data']

#swagger.requestBody = {
  required: true,
  content: {
    "multipart/form-data": {
      schema: {
        type: "object",
        properties: {
          files: {
            type: "array",
            items: {
              type: "string",
              format: "binary"
            }
          },
                user_id: {
            type: "string",
            example: "USER_efKL6767"
          }
        }
      }
    }
  }
}

#swagger.responses[200] = {
  description: 'Images uploaded successfully',
}

#swagger.responses[500] = {
  description: 'Internal Server Error',
}
*/
  upload.array("files"),
  imgfiles,
  sourcecontroller.uploadMedia,
);
router.post(
  "/upload-vids",
  /*
#swagger.tags = ['2.Media']
#swagger.summary = 'Upload Videos '
#swagger.description = 'Upload Videos Only'

#swagger.consumes = ['multipart/form-data']

#swagger.requestBody = {
  required: true,
  content: {
    "multipart/form-data": {
      schema: {
        type: "object",
        properties: {
          files: {
            type: "array",
            items: {
              type: "string",
              format: "binary"
            }
          },
            user_id: {
            type: "string",
            example: "USER_efKL6767"
          }
        }
      }
    }
  }
}

#swagger.responses[200] = {
  description: 'Videos uploaded successfully',
}

#swagger.responses[500] = {
  description: 'Internal Server Error',
}
*/
  upload.array("files"),
  vidfiles,
  sourcecontroller.uploadMedia,
);

router.post("/addrole", sourcecontroller.addUserrole);
router.post("/updaterole", sourcecontroller.updateUserrole);
router.post("/getrole", sourcecontroller.getUserrole);

export default router;
