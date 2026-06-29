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
            type: "array",
            items: {
              type: "string"
            },
            example: [
              "img-20213312"
            ]
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
router.post(
  "/getmemberrole",
  /*
    #swagger.tags = ['3.Member']
    #swagger.summary = 'Get member role dropdown list'
    #swagger.description = 'Get member role dropdown list'

    #swagger.responses[200] = {
      description: 'dropdown list fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ sourcecontroller.getUserrole,
);

// finance cat

router.post(
  "/add-finance-category",
  /*
    #swagger.tags = ['9.Source']
    #swagger.summary = 'Add or Update Finance Category'

    #swagger.requestBody = {
      required: false,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },          
              cat_name: { type: "string", example: "Medical Expense" },
              cat_type: { type: "string", example: "income or expense" },
              cat_img : {type : "string", example : 1},
             status : {type : "string" , example : "active or inactive"}
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Finance Catgory saved successfully'
    }

   

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
  */
  sourcecontroller.addFinanceCategory,
);
router.post(
  "/get-finance-category",
  /*
    #swagger.tags = ['9.Source']
    #swagger.summary = 'Get Finance Category'

    #swagger.requestBody = {
      required: false,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },          
             status : {type : "string" , example : "active or inactive"},
             cat_type : {type : "string" , example : "income or expense"}
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Finance Catgory Fetched successfully'
    }

   

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
  */
  sourcecontroller.getFinCategory,
);
router.get(
  "/get-delete-reasons",
  /*
    #swagger.tags = ['9.Source']
    #swagger.summary = 'Get Delete Reasons'

    #swagger.description = 'Fetch all active delete reasons.'

    #swagger.responses[200] = {
      description: 'Delete reasons fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
  */
  sourcecontroller.getDeleteReasons,
);

export default router;
