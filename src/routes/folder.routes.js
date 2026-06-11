import { Router } from "express";
import {
  addUpdateFolderImages,
  addUpdateFolderName,
  getFolderImages,
  removeFolder,
} from "../controller/folder.controller.js";
const router = Router();

router.post(
  "/add-folder-name",
  /*
    #swagger.tags = ['11.Folder']
    #swagger.summary = 'Add or Update Folder'

    #swagger.requestBody = {
      required: false,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              user_id: {type: "string" , example: "USER_Yl_e5736"},
              folder_name : {type : "string" , example :"ABC folder"}
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Folder name saved successfully'
    }

   

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
  */
  addUpdateFolderName,
);

router.post(
  "/remove-folder-img",
  /*
    #swagger.tags = ['11.Folder']
    #swagger.summary = 'Remove Folder or Folder Images using type'

    #swagger.requestBody = {
      required: false,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              ids: { type: "string", example: "1,2,3" },
              type : {type :"string" , example : "folder or image"}
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Folder or Folder Images deleted successfully'
    }

   

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
  */

  removeFolder,
);

router.post(
  "/add-img-folder" /*
    #swagger.tags = ['11.Folder']
    #swagger.summary = 'Add Images into a Folder'

    #swagger.requestBody = {
      required: false,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              folder_id : {type : "string", example : "2"},
              media_ids : {type : "string" , example :"1,2"}
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Add Image into folder successfully'
    }

   

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
  */,

  addUpdateFolderImages,
);
router.post(
  "/get-img-folder" /*
    #swagger.tags = ['11.Folder']
    #swagger.summary = 'Get Folder Images'

    #swagger.requestBody = {
      required: false,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: { type: "string", example: "USER_Yl_e5736" },
              folder_id : {type : "string", example : "2"}
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Get Image  folder successfully'
    }

   

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
  */,

  getFolderImages,
);

export default router;
